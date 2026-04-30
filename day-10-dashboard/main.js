import { createSolanaRpc, devnet, address } from "@solana/kit";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

const fetchBtn    = document.getElementById("fetch-btn");
const addressInput = document.getElementById("address-input");
const errorMsg    = document.getElementById("error-msg");
const loading     = document.getElementById("loading");
const results     = document.getElementById("results");
const balanceVal  = document.getElementById("balance-value");
const balanceAddr = document.getElementById("balance-address");
const txList      = document.getElementById("tx-list");

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = "block";
}

function hideError() {
  errorMsg.style.display = "none";
}

function setLoading(on) {
  loading.style.display = on ? "block" : "none";
  fetchBtn.disabled = on;
  fetchBtn.textContent = on ? "Loading..." : "Fetch Data";
}

async function fetchData() {
  const raw = addressInput.value.trim();
  if (!raw) { showError("Please enter a Solana address."); return; }

  hideError();
  results.style.display = "none";
  setLoading(true);

  try {
    const addr = address(raw);

    // Fetch balance
    const { value: lamports } = await rpc.getBalance(addr).send();
    const sol = Number(lamports) / 1_000_000_000;
    balanceVal.textContent  = `${sol.toFixed(9)} SOL`;
    balanceAddr.textContent = raw;

    // Fetch last 5 transactions
    const signatures = await rpc
      .getSignaturesForAddress(addr, { limit: 5 })
      .send();

    txList.innerHTML = "";

    if (signatures.length === 0) {
      txList.innerHTML = `<li style="color:#64748b;font-size:0.9rem;padding:1rem 0">No transactions found for this address on devnet.</li>`;
    } else {
      for (const tx of signatures) {
        const time = tx.blockTime
          ? new Date(Number(tx.blockTime) * 1000).toLocaleString()
          : "unknown";
        const explorerUrl = `https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`;
        const statusClass = tx.err ? "status-failed" : "status-success";
        const statusText  = tx.err ? "Failed" : "Success";

        txList.innerHTML += `
          <li class="tx-item">
            <div class="tx-sig">
              <a href="${explorerUrl}" target="_blank" rel="noopener">${tx.signature}</a>
            </div>
            <div class="tx-meta">
              <span>Slot: ${tx.slot}</span>
              <span>Time: ${time}</span>
              <span class="tx-status ${statusClass}">${statusText}</span>
            </div>
          </li>`;
      }
    }

    results.style.display = "block";

  } catch (err) {
    showError(`Error: ${err.message || "Invalid address or network issue. Please try again."}`);
  } finally {
    setLoading(false);
  }
}

fetchBtn.addEventListener("click", fetchData);
addressInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchData();
});
