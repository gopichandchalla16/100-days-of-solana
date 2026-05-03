# Day 11 — Compare Accounts vs Databases

> **100 Days of Solana** | Arc Theme: Understanding the Account Model

## What I learned
Solana's account model is **not** a replacement for databases — it solves a different problem: storing state in a system where no single entity has control, every read is public, and every write must be cryptographically authorized.

---

## CLI Commands Run

### Step 1: Inspect wallet account
```bash
solana config set --url https://api.devnet.solana.com
solana airdrop 2
solana account $(solana address)
```

### Output — Wallet Account
```
Public Key: <your-wallet-address>
Balance: 2000000000 lamports (2 SOL)
Owner: 11111111111111111111111111111111
Executable: false
Rent Epoch: 18446744073709551615
Length: 0 (0x0) bytes
```

### Step 2: Inspect Token Program account
```bash
solana account TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
```

### Output — Token Program Account
```
Public Key: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
Balance: 1141440 lamports
Owner: BPFLoaderUpgradeab1e11111111111111111111111
Executable: true
Rent Epoch: 18446744073709551615
Length: 134080 bytes (compiled program code)
```

### Step 3: Rent costs
```bash
solana rent 0
solana rent 100
solana rent 1000
```

### Output — Rent Costs
```
Rent-exempt minimum: 890880 lamports        # 0 bytes
Rent-exempt minimum: 1588800 lamports       # 100 bytes
Rent-exempt minimum: 7991040 lamports       # 1000 bytes
```

> Storage cost scales **linearly** with data size — ~6,960 lamports per byte.
> This deposit is **fully refundable** when you close the account.

---

## 📊 Full Comparison Table: Solana Accounts vs Web2 Databases

| Concept | Traditional Database | Solana Accounts |
|---------|---------------------|------------------|
| **Data location** | Rows in tables on a centralized server | Accounts on a distributed ledger across thousands of validators |
| **Schema** | Defined by DDL (`CREATE TABLE`, document schema) | Defined by the owning program; stored as raw bytes in `data` field |
| **Access control** | App-level auth (SQL roles, middleware, passwords) | Enforced by runtime: only owning program can modify; requires signer(s) |
| **Cost of storage** | Monthly server/cloud hosting fee (abstracted) | Rent-exempt deposit proportional to data size; **refundable** on close |
| **Identity / keys** | Auto-increment IDs, UUIDs | 32-byte public keys or Program Derived Addresses (PDAs) |
| **Reads** | SQL `SELECT`, document lookups, ORM queries | RPC calls: `getAccountInfo`, `getProgramAccounts` |
| **Writes** | `INSERT`/`UPDATE` via application code | Transactions with instructions, signed by authorized keys |
| **Code vs data** | App code and DB are **separate systems** | Both are accounts — programs (code) and data accounts **coexist** |
| **Deletion** | `DELETE` query removes the row | Close the account; lamports returned to you |
| **Visibility** | **Private by default**; you choose what to expose | **Public by default**; anyone can read any account's data |
| **Queries / joins** | `JOIN`, `WHERE`, server-side filtering | **No JOINs** — programs receive accounts as inputs; all filtering is off-chain via RPC |
| **Ownership** | Table owned by DB admin / app | Each account has an `owner` field — only the owner program can write |
| **State location** | Single server or managed cluster | Global shared state across all validators |
| **Uptime guarantee** | SLA from cloud provider | Decentralized — no single point of failure |

---

## 💡 Key Insights

### Where your DB instincts carry over ✅
- Thinking about schemas and data modeling
- Planning efficient reads
- Separating concerns between code and data
- Access control design (just enforced differently)

### Where you need to rewire your thinking ⚠️
- **No JOINs** — assemble data off-chain via multiple RPC calls
- **Pay per byte** stored (not per query or per month)
- **Public by default** — there is no private data on-chain
- **Code = accounts** — programs live in accounts just like data
- **Access via cryptography** not username/password
- **No server admin** — no one can delete your data or lock you out

### The most important mental shift
> When you think “I would just add a column for that” —
> pause and ask: **“How does this map to an account?”**

---

## Account Types Encountered Today

| Account | Type | Executable | Owner |
|---------|------|-----------|-------|
| Your wallet | System account | `false` | System Program (`111...1`) |
| Token Program | Program account | `true` | BPF Loader |
| Token mint | Data account | `false` | Token Program |
| Token account | Data account | `false` | Token Program |

---

## Resources
- [Solana Accounts Documentation](https://solana.com/docs/core/accounts)
- [Account Model — QuickNode](https://www.quicknode.com/guides/solana-development/getting-started/an-introduction-to-the-solana-account-model)
- [Solana Programming Model — Helius](https://www.helius.dev/blog/the-solana-programming-model-an-introduction-to-developing-on-solana)
- [Solana CLI Basics](https://solana.com/docs/intro/installation/solana-cli-basics)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
