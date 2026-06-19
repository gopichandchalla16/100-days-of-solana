use std::process::Command;
use std::path::PathBuf;

fn main() {
    // Only run during `cargo test`, not during `cargo build-sbf`
    // Tell cargo to re-run this if the program source changes
    println!("cargo:rerun-if-changed=src/lib.rs");
    println!("cargo:rerun-if-changed=Cargo.toml");

    // Determine the workspace root (two levels up from programs/counter)
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").unwrap();
    let workspace_root = PathBuf::from(&manifest_dir)
        .parent() // programs
        .unwrap()
        .parent() // day-60-failure-tests
        .unwrap()
        .to_path_buf();

    let deploy_dir = workspace_root.join("target").join("deploy");
    let so_file = deploy_dir.join("counter.so");

    // Only build if the .so doesn't exist yet
    if !so_file.exists() {
        std::fs::create_dir_all(&deploy_dir).ok();

        // Try cargo build-sbf first (works with stable Rust)
        let status = Command::new("cargo")
            .args([
                "build-sbf",
                "--manifest-path",
                &format!("{}/Cargo.toml", manifest_dir),
                "--sbf-out-dir",
                deploy_dir.to_str().unwrap(),
            ])
            .status();

        match status {
            Ok(s) if s.success() => {}
            _ => {
                // Fallback: try anchor build from workspace root
                Command::new("anchor")
                    .arg("build")
                    .current_dir(&workspace_root)
                    .status()
                    .ok();
            }
        }
    }
}
