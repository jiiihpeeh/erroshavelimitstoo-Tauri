fn main() {
  // tell rustc to link with some libhello.a library
  println!("cargo:rustc-link=callnim");
  // and it should search the Cargo.toml directory for that library
  println!("cargo:rustc-link-search={}", std::env::var("CARGO_MANIFEST_DIR").unwrap());
  tauri_build::build()
}
