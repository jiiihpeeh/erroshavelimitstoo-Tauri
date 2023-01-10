use libc::c_char;
use std::ffi::CStr;
use std::str;
use std::env;

fn rstr_to_cchar (s:&str) ->   *const c_char {
    let cchar: *const c_char = s.as_ptr() as *const c_char;
    return cchar;
}
fn cchar_to_string (s: *const c_char) -> String {
    let init_str: &CStr = unsafe { CStr::from_ptr(s) };
    let init_slice: &str = init_str.to_str().unwrap();
    let init: String = init_slice.to_owned();
    return init;
}

#[link(name = "callnim", kind = "static")]
extern "C" {
    fn NimMain();
    fn callNim(a: *const c_char) -> *const c_char;
}



fn run_nim(args: &str)-> String {
    // initialize nim gc memory, types and stack
    unsafe {
        NimMain();
    }
    return cchar_to_string(unsafe { callNim(rstr_to_cchar(args)) });
}

#[cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![nim_caller,get_env, file_exists])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn nim_caller(name: &str) -> String {
    //println!("{}", name);
    return run_nim(name);
}

#[tauri::command]
fn get_env(name: String) -> String {
    return  env::var(name).unwrap_or("none".to_string());
}
#[tauri::command]
fn file_exists(name: &str) -> bool {
    return std::path::Path::new(name).exists();
}

