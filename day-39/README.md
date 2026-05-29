# Day 39 — Inspect and Compare Token Extension Configurations

> **Challenge:** Slow down and read before writing. Inspect the three Token-2022 mints from Days 36–38 using the CLI, compare their extensions, on-chain data sizes, rent costs, and authority structures.

---

## Mints Inspected

| Day | Mint Address | Extension(s) |
|-----|-------------|-------------|
| Day 36 | `DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4` | Interest-Bearing |
| Day 37 | `49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8` | Transfer Fees + Interest-Bearing + Metadata |
| Day 38 | `HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY` | Default Account State (Frozen) |

---

## Step 1 — Inspect Day 36 (Interest-Bearing)

```bash
spl-token display DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

```
SPL Token Mint
  Address: DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 1000000000000
  Decimals: 9
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Interest-bearing:
    Current rate: 15000bps
    Average rate: 500bps
    Rate authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
```

**Key observations:**
- One extension only → smallest account
- No freeze authority → accounts cannot be frozen after creation
- `Current rate: 15000bps` — updated from initial 500bps on Day 36
- `Average rate: 500bps` — historical average preserved even after rate change
- The extension does **not** change raw balances; it provides a calculation layer for wallets

---

## Step 2 — Inspect Day 37 (Multi-Extension)

```bash
spl-token display 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8 \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

```
SPL Token Mint
  Address: 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 100000
  Decimals: 2
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: (not set)
Extensions
  Interest-bearing:
    Current rate: 5bps
    Average rate: 5bps
    Rate authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Transfer fees:
    Current fee: 100bps
    Current maximum: 50000
    Config authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withdrawal authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Withheld fees: 0
  Metadata Pointer:
    Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Metadata address: 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
  Metadata:
    Update Authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
    Mint: 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
    Name: ArcCoin
    Symbol: ARC
    URI: https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/CompressedCoil/metadata.json
```

**Key observations:**
- Three extensions → largest account (599 bytes)
- Each extension occupies its own TLV block in the account data
- Metadata is stored **inside the mint account itself** (metadata address = mint address)
- Transfer fee has two separate authority roles: config authority and withdrawal authority

---

## Step 3 — Inspect Day 38 (Default Frozen)

```bash
spl-token display HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY \
  --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

```
SPL Token Mint
  Address: HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY
  Program: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
  Supply: 100000000000
  Decimals: 9
  Mint authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
  Freeze authority: AWKYsCGBcfGLSz6QpmXzRn7EJ9fRhiJsjYSLDV3c9L9y
Extensions
  Default state: Frozen
```

**Key observations:**
- Smallest account at 171 bytes — DefaultAccountState adds minimal data (just 1 byte for the state enum)
- `Freeze authority` is **set** — required to thaw accounts
- `Default state: Frozen` — every new token account starts locked
- No rate authority, no transfer fee authority — clean minimal configuration

---

## Step 4 — Account Size & Rent Comparison

```bash
solana account DAETveGGDwGFNDJC4kdnciwVV9tQwcbTpTv3D8uYYip4
# Length: 222 bytes | Balance: 0.002436 SOL

solana account 49voYHPxJPZjHPHyhpThAPzAnbL6yZrZ57Jz2Jzrbfn8
# Length: 599 bytes | Balance: 0.00505992 SOL

solana account HphJrVXTTUzysE3iAWjpzYqX7UeWi7Yig8ER5mX4BoNY
# Length: 171 bytes | Balance: 0.00208104 SOL
```

---

## Step 5 — Full Comparison Table

| | Day 36 | Day 37 | Day 38 |
|--|--------|--------|--------|
| **Mint** | `DAETveGG...` | `49voYHPx...` | `HphJrVXT...` |
| **Extensions** | Interest-Bearing | Interest + Transfer Fees + Metadata | Default Account State |
| **Data Size** | **222 bytes** | **599 bytes** | **171 bytes** |
| **Rent (SOL)** | **0.002436** | **0.005060** | **0.002081** |
| **Decimals** | 9 | 2 | 9 |
| **Mint Authority** | `AWKYsCGBc...` | `AWKYsCGBc...` | `AWKYsCGBc...` |
| **Freeze Authority** | *(not set)* | *(not set)* | `AWKYsCGBc...` |
| **Rate Authority** | `AWKYsCGBc...` | `AWKYsCGBc...` | *(none)* |
| **Transfer Fee Authority** | *(none)* | `AWKYsCGBc...` | *(none)* |
| **Metadata Update Authority** | *(none)* | `AWKYsCGBc...` | *(none)* |
| **Current Interest Rate** | 15000 bps | 5 bps | *(none)* |
| **Transfer Fee** | *(none)* | 100 bps (1%) | *(none)* |
| **Default Account State** | Initialized | Initialized | **Frozen** |

---

## Key Insights

### 1. Extensions cost SOL

```
Day 38 (1 tiny extension):  171 bytes → 0.002081 SOL
Day 36 (1 medium extension): 222 bytes → 0.002436 SOL
Day 37 (3 extensions + metadata string): 599 bytes → 0.005060 SOL
```

The metadata extension is the biggest cost driver — it stores variable-length strings (name, symbol, URI) directly inside the mint account. Each character costs rent.

### 2. Authority roles are distributed

Token Extensions split control across multiple roles:

| Authority | Controls |
|-----------|----------|
| Mint authority | Who can mint new tokens |
| Freeze authority | Who can freeze/thaw accounts |
| Rate authority | Who can update the interest rate |
| Transfer fee config authority | Who can change the fee % |
| Transfer fee withdrawal authority | Who can harvest withheld fees |
| Metadata update authority | Who can update name/symbol/URI |

In production: these should be **different keys** held by different parties (e.g., a multisig).

### 3. Extensions cannot be added after creation

> You must declare all extensions **at mint creation time**. The account is allocated with exactly the space needed for the declared extensions. Adding one later would require reallocating the account — which Token-2022 does not allow.

This is like defining a database schema before writing rows. Plan your token's capabilities upfront.

### 4. DefaultAccountState adds almost no overhead

Day 38 is actually **smaller** than Day 36, because DefaultAccountState only adds 1–2 bytes (a state enum) while the Interest-Bearing extension stores timestamps and rate history (52+ bytes).

---

## Web2 Analogy

| Concept | Web2 | Solana Token-2022 |
|---------|------|-------------------|
| Reading config | `cat package.json` | `spl-token display [MINT]` |
| Feature flags | App config / env vars | Extension TLV blocks |
| Storage cost | Cloud DB pricing per GB | Rent-exempt SOL deposit |
| Authority model | IAM roles / RBAC | Mint/Freeze/Rate/Fee authorities |
| Schema lock-in | DB migrations needed | Extensions immutable post-creation |

---

*Part of [#100DaysOfSolana](https://github.com/gopichandchalla16/100-days-of-solana) — building in public daily.*
