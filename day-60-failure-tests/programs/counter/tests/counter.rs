use anchor_lang::{
    prelude::Pubkey,
    solana_program::system_program,
    AccountDeserialize, InstructionData, ToAccountMetas,
};
use litesvm::LiteSVM;
use solana_instruction::Instruction;
use solana_keypair::Keypair;
use solana_signer::Signer;
use solana_transaction::Transaction;

// ── helpers ──────────────────────────────────────────────────────────────────

fn setup_svm_with_program() -> (LiteSVM, Pubkey) {
    let mut svm = LiteSVM::new();
    let program_id = counter::ID;

    // CARGO_MANIFEST_DIR = .../day-60-failure-tests/programs/counter
    // ../../target/deploy/ = .../day-60-failure-tests/target/deploy/
    let so_path = concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../target/deploy/counter.so"
    );

    // Give a clear error message if the .so is missing
    assert!(
        std::path::Path::new(so_path).exists(),
        "counter.so not found at {}. Run: cargo build-sbf --manifest-path programs/counter/Cargo.toml --sbf-out-dir target/deploy",
        so_path
    );

    svm.add_program_from_file(program_id, so_path).unwrap();
    (svm, program_id)
}

fn build_initialize_tx(
    svm: &LiteSVM,
    program_id: Pubkey,
    authority: &Keypair,
    counter_kp: &Keypair,
) -> Transaction {
    let ix = Instruction {
        program_id,
        accounts: counter::accounts::Initialize {
            counter: counter_kp.pubkey(),
            authority: authority.pubkey(),
            system_program: system_program::ID,
        }
        .to_account_metas(None),
        data: counter::instruction::Initialize {}.data(),
    };
    Transaction::new_signed_with_payer(
        &[ix],
        Some(&authority.pubkey()),
        &[authority, counter_kp],
        svm.latest_blockhash(),
    )
}

fn build_increment_tx(
    svm: &LiteSVM,
    program_id: Pubkey,
    authority: &Keypair,
    counter: Pubkey,
) -> Transaction {
    let ix = Instruction {
        program_id,
        accounts: counter::accounts::Increment {
            counter,
            authority: authority.pubkey(),
        }
        .to_account_metas(None),
        data: counter::instruction::Increment {}.data(),
    };
    Transaction::new_signed_with_payer(
        &[ix],
        Some(&authority.pubkey()),
        &[authority],
        svm.latest_blockhash(),
    )
}

// ── happy-path test (from Day 59 — must be kept) ─────────────────────────────

#[test]
fn initialize_then_increment() {
    let (mut svm, program_id) = setup_svm_with_program();

    let authority = Keypair::new();
    svm.airdrop(&authority.pubkey(), 1_000_000_000).unwrap();
    let counter_kp = Keypair::new();

    let init_tx = build_initialize_tx(&svm, program_id, &authority, &counter_kp);
    svm.send_transaction(init_tx).expect("initialize should succeed");

    let inc_tx = build_increment_tx(&svm, program_id, &authority, counter_kp.pubkey());
    svm.send_transaction(inc_tx).expect("increment should succeed");

    let account = svm.get_account(&counter_kp.pubkey()).unwrap();
    let parsed = counter::Counter::try_deserialize(&mut account.data.as_slice()).unwrap();
    assert_eq!(parsed.count, 1);
    assert_eq!(parsed.authority, authority.pubkey());
}

// ── failure test 1: wrong authority cannot increment ─────────────────────────

#[test]
fn increment_fails_when_wrong_authority_signs() {
    let (mut svm, program_id) = setup_svm_with_program();

    let authority_a = Keypair::new();
    let authority_b = Keypair::new();
    svm.airdrop(&authority_a.pubkey(), 1_000_000_000).unwrap();
    svm.airdrop(&authority_b.pubkey(), 1_000_000_000).unwrap();

    let counter = Keypair::new();

    // authority_a creates the counter. This must succeed.
    let init_tx = build_initialize_tx(&svm, program_id, &authority_a, &counter);
    svm.send_transaction(init_tx).expect("initialize should succeed");

    // authority_b tries to increment it. This must fail.
    let bad_tx = build_increment_tx(&svm, program_id, &authority_b, counter.pubkey());

    let result = svm.send_transaction(bad_tx);
    println!("{:?}", result);
    assert!(
        result.is_err(),
        "increment should fail when signed by the wrong authority"
    );
}

// ── failure test 2: cannot initialize the same counter twice ─────────────────

#[test]
fn initialize_fails_when_counter_already_exists() {
    let (mut svm, program_id) = setup_svm_with_program();

    let authority = Keypair::new();
    svm.airdrop(&authority.pubkey(), 1_000_000_000).unwrap();

    let counter = Keypair::new();

    let first_tx = build_initialize_tx(&svm, program_id, &authority, &counter);
    svm.send_transaction(first_tx).expect("first initialize should succeed");

    // Advance the blockhash so the second tx is not a duplicate of the first.
    svm.expire_blockhash();

    // Same counter keypair, same payer. The account is already on chain.
    let second_tx = build_initialize_tx(&svm, program_id, &authority, &counter);

    let result = svm.send_transaction(second_tx);
    println!("{:?}", result);
    assert!(
        result.is_err(),
        "initializing the same counter twice should fail"
    );
}
