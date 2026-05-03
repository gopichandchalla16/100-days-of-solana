# Day 11 — Compare Accounts vs Databases

> **100 Days of Solana** | Arc Theme: Understanding the Account Model

## What I learned
Solana's account model is **not** a replacement for databases — it solves a different problem: storing state in a system where no single entity has control, every read is public, and every write must be cryptographically authorized.

---

## CLI Commands Run (All 5 Steps)

### Step 1: Configure devnet + airdrop
```bash
solana config set --url https://api.devnet.solana.com
solana airdrop 2
```

### Output
```
Config File: /home/gopichand/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /home/gopichand/.config/solana/id.json
Commitment: confirmed

# Note: airdrop rate-limited — used faucet.solana.com instead
```

---

### Step 2: Inspect my wallet account
```bash
solana address
solana account $(solana address)
```

### ✅ Live Output — Wallet Account
```
Public Key: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Balance: 2.5 SOL
Owner: 11111111111111111111111111111111
Executable: false
Rent Epoch: 18446744073709551615
```

> **Key insight:** Owner is the System Program (`111...1`) — this is a plain wallet.
> `Executable: false` means it stores **data (SOL balance)**, not code.
> `0 bytes` of data — wallet accounts carry no extra payload.

---

### Step 3: Inspect Token Program account
```bash
solana account TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
```

### ✅ Live Output — Token Program
```
Public Key: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
Balance: 6.453353357 SOL
Owner: BPFLoaderUpgradeab1e11111111111111111111111
Executable: true
Rent Epoch: 18446744073709551615
Length: 36 (0x24) bytes
0000:   02 00 00 00  27 f1 90 b1  d3 af 98 b8  ce 71 4c 44   ....'........qLD
0010:   e8 ca df f9  f8 fc 45 cb  8e 5f ac 42  02 ef f8 11   ......E.._.B....
0020:   0d 97 dd 37                                          ...7
```

> **Key insight:** Owner is BPF Loader — this is an **executable program account**.
> The 36 bytes are a pointer to the actual compiled program code (upgradeable loader pattern).
> Same account model, totally different purpose from a wallet.

---

### Step 4: Check rent-exempt costs
```bash
solana rent 0
solana rent 100
solana rent 1000
```

### ✅ Live Output — Rent Costs
```
Rent-exempt minimum: 0.00089088 SOL    # 0 bytes
Rent-exempt minimum: 0.00158688 SOL    # 100 bytes
Rent-exempt minimum: 0.00785088 SOL    # 1000 bytes
```

> Storage cost scales **linearly** — ~0.00000696 SOL per byte (~6,960 lamports/byte).
> This deposit is **fully refundable** when you close the account.
> Compare to Web2: you pay AWS/GCP monthly regardless of individual record size.

---

### Step 5: View on Solana Explorer
Wallet address on devnet Explorer:
[https://explorer.solana.com/address/AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y?cluster=devnet](https://explorer.solana.com/address/AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y?cluster=devnet)

> Anyone can view this — no login, no API key, no admin access needed.
> In Web2 you’d need DB admin credentials. On Solana, it’s public by default.

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

## Account Types Compared Today

| Account | Type | Executable | Owner | Balance |
|---------|------|-----------|-------|--------|
| My wallet | System account | `false` | System Program (`111...1`) | 2.5 SOL |
| Token Program | Program account | `true` | BPF Loader | 6.45 SOL |
| Token mint | Data account | `false` | Token Program | rent deposit |
| Token account | Data account | `false` | Token Program | rent deposit |

---

## Resources
- [Solana Accounts Documentation](https://solana.com/docs/core/accounts)
- [Account Model — QuickNode](https://www.quicknode.com/guides/solana-development/getting-started/an-introduction-to-the-solana-account-model)
- [Solana Programming Model — Helius](https://www.helius.dev/blog/the-solana-programming-model-an-introduction-to-developing-on-solana)
- [Solana CLI Basics](https://solana.com/docs/intro/installation/solana-cli-basics)
- [Solana Explorer (devnet)](https://explorer.solana.com/?cluster=devnet)
