use anchor_lang::{
    prelude::Pubkey,
    AccountDeserialize,
};
use litesvm::LiteSVM;
use solana_instruction::{AccountMeta, Instruction};
use solana_keypair::Keypair;
use solana_signer::Signer;
use solana_transaction::Transaction;

// Program ID must match declare_id! in lib.rs
const PROGRAM_ID: &str = "HzobnFUGbJ84agUuP1nDb3gJUHC3kCVmC6dcPTtNhwFG";

fn load_svm() -> (LiteSVM, Pubkey) {
    let program_id: Pubkey = PROGRAM_ID.parse().unwrap();
    let mut svm = LiteSVM::new();
    let so_path = concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../target/deploy/counter.so"
    );
    assert!(
        std::path::Path::new(so_path).exists(),
        "counter.so not found at {}. Run: cargo build-sbf \
         --manifest-path programs/counter/Cargo.toml \
         --sbf-out-dir target/deploy",
        so_path
    );
    svm.add_program_from_file(program_id, so_path).unwrap();
    (svm, program_id)
}

fn initialize_ix(
    program_id: Pubkey,
    counter: Pubkey,
    authority: Pubkey,
) -> Instruction {
    let mut data = anchor_lang::solana_program::hash::hash(b"global:initialize")
        .to_bytes()[..8]
        .to_vec();
    data.extend_from_slice(&[]);
    Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(counter, false),
            AccountMeta::new(authority, true),
            AccountMeta::new_readonly(
                anchor_lang::solana_program::system_program::ID,
                false,
            ),
        ],
        data,
    }
}

fn increment_ix(
    program_id: Pubkey,
    counter: Pubkey,
    authority: Pubkey,
) -> Instruction {
    let mut data = anchor_lang::solana_program::hash::hash(b"global:increment")
        .to_bytes()[..8]
        .to_vec();
    data.extend_from_slice(&[]);
    Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(counter, false),
            AccountMeta::new_readonly(authority, true),
        ],
        data,
    }
}

// ─── TEST 1: happy path ───────────────────────────────────────────────────────
#[test]
fn initialize_then_increment() {
    let (mut svm, program_id) = load_svm();
    let authority = Keypair::new();
    let counter = Keypair::new();
    svm.airdrop(&authority.pubkey(), 10_000_000_000).unwrap();

    // initialize
    let blockhash = svm.latest_blockhash();
    let ix = initialize_ix(program_id, counter.pubkey(), authority.pubkey());
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&authority.pubkey()),
        &[&authority, &counter],
        blockhash,
    );
    svm.send_transaction(tx)
        .expect("initialize should succeed");

    // increment
    let blockhash = svm.latest_blockhash();
    let ix = increment_ix(program_id, counter.pubkey(), authority.pubkey());
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&authority.pubkey()),
        &[&authority],
        blockhash,
    );
    svm.send_transaction(tx)
        .expect("increment should succeed");

    // verify count == 1
    let acct = svm.get_account(&counter.pubkey()).unwrap();
    let parsed = counter::Counter::try_deserialize(&mut &acct.data[..]).unwrap();
    assert_eq!(parsed.count, 1, "count should be 1 after one increment");
}

// ─── TEST 2: wrong authority is rejected ─────────────────────────────────────
#[test]
fn increment_fails_when_wrong_authority_signs() {
    let (mut svm, program_id) = load_svm();
    let authority = Keypair::new();
    let attacker  = Keypair::new();
    let counter   = Keypair::new();
    svm.airdrop(&authority.pubkey(), 10_000_000_000).unwrap();
    svm.airdrop(&attacker.pubkey(),  10_000_000_000).unwrap();

    // initialize with real authority
    let blockhash = svm.latest_blockhash();
    let ix = initialize_ix(program_id, counter.pubkey(), authority.pubkey());
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&authority.pubkey()),
        &[&authority, &counter],
        blockhash,
    );
    svm.send_transaction(tx)
        .expect("initialize should succeed");

    // attempt increment signed by attacker — must fail
    let blockhash = svm.latest_blockhash();
    let ix = increment_ix(program_id, counter.pubkey(), attacker.pubkey());
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&attacker.pubkey()),
        &[&attacker],
        blockhash,
    );
    let result = svm.send_transaction(tx);
    assert!(
        result.is_err(),
        "increment must fail when signed by the wrong authority"
    );
}

// ─── TEST 3: double-init is rejected ─────────────────────────────────────────
#[test]
fn initialize_fails_when_counter_already_exists() {
    let (mut svm, program_id) = load_svm();
    let authority = Keypair::new();
    let counter   = Keypair::new();
    svm.airdrop(&authority.pubkey(), 10_000_000_000).unwrap();

    // first init — must succeed
    let blockhash = svm.latest_blockhash();
    let ix = initialize_ix(program_id, counter.pubkey(), authority.pubkey());
    let tx = Transaction::new_signed_with_payer(
        &[ix.clone()],
        Some(&authority.pubkey()),
        &[&authority, &counter],
        blockhash,
    );
    svm.send_transaction(tx)
        .expect("first initialize should succeed");

    // second init with same counter keypair — must fail
    let blockhash = svm.latest_blockhash();
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&authority.pubkey()),
        &[&authority, &counter],
        blockhash,
    );
    let result = svm.send_transaction(tx);
    assert!(
        result.is_err(),
        "second initialize must fail — counter already exists"
    );
}
