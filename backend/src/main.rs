use axum::{
    extract::{Json, Path, State},
    http::StatusCode,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgPoolOptions, FromRow, Pool, Postgres};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[derive(Clone)]
struct AppState {
    pool: Pool<Postgres>,
}

#[derive(Serialize, Clone)]
struct TimeSlot {
    date: String,
    times: Vec<String>,
}

#[derive(Serialize, FromRow)]
#[serde(rename_all = "camelCase")]
struct Doctor {
    id: uuid::Uuid,
    name: String,
    specialization: String,
    bio: Option<String>,
    price: i32,
    image_url: Option<String>,
    rating: f32,
    #[sqlx(rename = "experience_years")]
    experience: i32,
    #[sqlx(skip)]
    available_slots: Vec<TimeSlot>,
}

#[derive(Deserialize)]
struct CreateAppointment {
    doctor_id: uuid::Uuid,
    patient_name: String,
    patient_phone: String,
    start_time: String,
}

#[derive(Serialize)]
struct AppointmentResponse {
    id: uuid::Uuid,
    status: String,
}

#[derive(Serialize, FromRow)]
#[serde(rename_all = "camelCase")]
struct AppointmentRow {
    id: uuid::Uuid,
    patient_name: String,
    doctor_name: String, // Получаем через JOIN
    start_time: chrono::DateTime<chrono::Utc>,
    status: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;

    //sqlx::migrate!("./migrations").run(&pool).await?;

    let state = AppState { pool };

    let app = Router::new()
        .route("/", get(root))
        .route("/api/doctors", get(get_doctors))
        .route("/api/doctors/:id", get(get_doctor))
        // Обновили маршрут: теперь он поддерживает и POST (создание), и GET (просмотр)
        .route(
            "/api/appointments",
            post(create_appointment).get(get_appointments),
        )
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("🚀 Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

async fn root() -> &'static str {
    "Medical System Backend is Online! 🟢"
}

async fn get_doctors(
    State(state): State<AppState>,
) -> Result<Json<Vec<Doctor>>, (StatusCode, String)> {
    let doctors_db = sqlx::query_as::<_, Doctor>("SELECT * FROM doctors")
        .fetch_all(&state.pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let doctors_with_slots: Vec<Doctor> = doctors_db
        .into_iter()
        .map(|mut doc| {
            doc.available_slots = get_mock_slots();
            doc
        })
        .collect();

    Ok(Json(doctors_with_slots))
}

async fn get_doctor(
    State(state): State<AppState>,
    Path(id): Path<uuid::Uuid>,
) -> Result<Json<Doctor>, (StatusCode, String)> {
    let doctor_db = sqlx::query_as::<_, Doctor>("SELECT * FROM doctors WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    match doctor_db {
        Some(mut doctor) => {
            doctor.available_slots = get_mock_slots();
            Ok(Json(doctor))
        }
        None => Err((StatusCode::NOT_FOUND, "Doctor not found".to_string())),
    }
}

async fn create_appointment(
    State(state): State<AppState>,
    Json(payload): Json<CreateAppointment>,
) -> Result<Json<AppointmentResponse>, (StatusCode, String)> {
    let parsed_time = chrono::DateTime::parse_from_rfc3339(&payload.start_time)
        .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid date format".to_string()))?
        .with_timezone(&chrono::Utc);

    let result = sqlx::query!(
        r#"
        INSERT INTO appointments (doctor_id, patient_name, patient_phone, start_time)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        "#,
        payload.doctor_id,
        payload.patient_name,
        payload.patient_phone,
        parsed_time
    )
    .fetch_one(&state.pool)
    .await;

    match result {
        Ok(record) => Ok(Json(AppointmentResponse {
            id: record.id,
            status: "created".to_string(),
        })),
        Err(sqlx::Error::Database(db_err)) => {
            if db_err.code().unwrap_or_default() == "23505" {
                Err((StatusCode::CONFLICT, "Time slot booked!".to_string()))
            } else {
                Err((StatusCode::INTERNAL_SERVER_ERROR, db_err.to_string()))
            }
        }
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}

async fn get_appointments(
    State(state): State<AppState>,
) -> Result<Json<Vec<AppointmentRow>>, (StatusCode, String)> {
    let sql = r#"
        SELECT 
            a.id, 
            a.patient_name, 
            d.name as doctor_name, 
            a.start_time, 
            a.status 
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        ORDER BY a.start_time DESC
    "#;

    let appointments = sqlx::query_as::<_, AppointmentRow>(sql)
        .fetch_all(&state.pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(appointments))
}

// Вспомогательная функция для слотов
fn get_mock_slots() -> Vec<TimeSlot> {
    vec![
        TimeSlot {
            // Завтра
            date: "2026-02-18".to_string(),
            times: vec![
                "09:00".to_string(),
                "09:30".to_string(),
                "10:00".to_string(),
                "11:30".to_string(),
                "14:00".to_string(),
                "15:30".to_string(),
                "17:00".to_string(),
            ],
        },
        TimeSlot {
            // Послезавтра
            date: "2026-02-19".to_string(),
            times: vec![
                "09:00".to_string(),
                "10:30".to_string(),
                "12:00".to_string(),
                "13:30".to_string(),
                "15:00".to_string(),
                "16:30".to_string(),
            ],
        },
        TimeSlot {
            // Пятница
            date: "2026-02-20".to_string(),
            times: vec![
                "10:00".to_string(),
                "11:00".to_string(),
                "13:00".to_string(),
                "14:00".to_string(),
                "15:00".to_string(),
                "16:00".to_string(),
            ],
        },
    ]
}
