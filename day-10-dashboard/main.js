import { createSolanaRpc, devnet, address } from "@solana/kit";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

const btn    = document.getElementById("fetch-btn");
const input  = document.getElementById("addr-input");
const errBar = document.getElementById("error-bar");
const loadBar= document.getElementById("loading-bar");
const results= document.getElementById("results");
const balVal = document.getElementById("bal-val");
const balAddr= document.getElementById("bal-addr");
const txCnt  = document.getElementById("tx-count");
const txList = document.getElementById("tx-list");

const showErr = msg => { errBar.textContent = "\u26A0 " + msg; errBar.style.display = "block"; };
const hideErr = () => { errBar.style.display = "none"; };

function setLoading(on) {
  loadBar.style.display = on ? "block" : "none";
  btn.disabled = on;
  btn.textContent = on ? "Loading…" : "Fetch Data";
}

async function fetchData() {
  const raw = input.value.trim();
  if (!raw) { showErr("Please enter a Solana address."); return; }
  hideErr();
  results.style.display = "none";
  setLoading(true);

  try {
    const addr = address(raw);

    const { value: lamports } = await rpc.getBalance(addr).send();
    balVal.textContent  = (Number(lamports) / 1_000_000_000).toFixed(9) + " SOL";
    balAddr.textContent = raw;

    const sigs = await rpc.getSignaturesForAddress(addr, { limit: 5 }).send();
    txCnt.textContent = sigs.length;
    txList.innerHTML = "";

    if (!sigs.length) {
      txList.innerHTML = '<li class="no-tx">No transactions found on devnet for this address.</li>';
    } else {
      sigs.forEach(tx => {
        const time = tx.blockTime ? new Date(Number(tx.blockTime) * 1000).toLocaleString() : "unknown";
        const url = `https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`;
        txList.innerHTML += `
          <li class="tx-item">
            <div class="tx-sig"><a href="${url}" target="_blank" rel="noopener">${tx.signature}</a></div>
            <div class="tx-meta">
              <span>Slot: ${tx.slot}</span>
              <span>\u23F1 ${time}</span>
              <span class="status ${tx.err ? 'status-err':'status-ok'}">${tx.err ? 'Failed':'Success'}</span>
            </div>
          </li>`;
      });
    }
    results.style.display = "block";
  } catch(e) {
    showErr(e.message || "Invalid address or network error.");
  } finally {
    setLoading(false);
  }
}

btn.addEventListener("click", fetchData);
input.addEventListener("keydown", e => e.key === "Enter" && fetchData());
fetchData(); // auto-fetch on load
