// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Window;
use screenshots::Screen;
use base64::Engine as _;
use base64::engine::general_purpose::STANDARD;
use serde::Serialize;

#[derive(Serialize)]
struct ScreenshotResponse {
    base64_image: String,
}

#[tauri::command]
async fn take_screenshot(window: Window) -> Result<ScreenshotResponse, String> {
    // Get the window position and size
    let position = window.outer_position().unwrap();
    let size = window.outer_size().unwrap();

    // Capture the screen
    let screens = Screen::all().unwrap();
    let screen = screens[0];
    
    let image = screen.capture_area(
        position.x as i32,
        position.y as i32,
        size.width as u32,
        size.height as u32
    ).map_err(|e| e.to_string())?;

    // Convert to base64
    let base64_image = STANDARD.encode(image.as_raw());

    Ok(ScreenshotResponse { base64_image })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![take_screenshot])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
