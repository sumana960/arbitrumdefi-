// ================= CONFIG =================
const ARBITRUM_CHAIN_ID = "0xa4b1";

const TOKEN_ADDRESS = "0x200f34919354B51A700fC3d48103747eb6c933D0";
const STAKING_ADDRESS = "0x84338201F97e28Acd9ed93046d49c98B5D991853";

const tokenAbi = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];

const stakingAbi = [
  "function stake(uint256 amount)",
  "function unstake(uint256 amount)",
  "function claim()"
];

let provider, signer, token, staking;

// ================= UTILS =================
function status(msg) {
  document.getElementById("status").innerText = msg;
}

function requireConnection() {
  if (!signer) {
    alert("Connecte ton wallet d'abord");
    throw new Error("Wallet non connecté");
  }
}

// ================= WALLET =================
async function connectWallet() {
  if (!window.ethereum) {
    alert("Installe MetaMask");
    return;
  }

  let chainId = await ethereum.request({ method: "eth_chainId" });

  if (chainId !== ARBITRUM_CHAIN_ID) {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARBITRUM_CHAIN_ID }]
      });
    } catch (e) {
      alert("Passe sur le réseau Arbitrum One dans MetaMask");
      return;
    }
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById("wallet").innerText = "Connecté : " + address;

  token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
  staking = new ethers.Contract(STAKING_ADDRESS, stakingAbi, signer);

  status("Wallet connecté");
}

// ================= ACTIONS =================
async function approve() {
  try {
    requireConnection();
    const amount = document.getElementById("approveAmount").value;

    status("Approve en cours...");
    const tx = await token.approve(STAKING_ADDRESS, ethers.utils.parseEther(amount));
    await tx.wait();

    status("Approve confirmé ✅");
  } catch (e) {
    console.error(e);
    status("Erreur approve ❌");
  }
}

async function stake() {
  try {
    requireConnection();
    const amount = document.getElementById("stakeAmount").value;

    status("Stake en cours...");
    const tx = await staking.stake(ethers.utils.parseEther(amount));
    await tx.wait();

    status("Stake confirmé ✅");
  } catch (e) {
    console.error(e);
    status("Erreur stake ❌");
  }
}

async function claim() {
  try {
    requireConnection();

    status("Claim en cours...");
    const tx = await staking.claim();
    await tx.wait();

    status("Rewards récupérés ✅");
  } catch (e) {
    console.error(e);
    status("Erreur claim ❌");
  }
}

async function unstake() {
  try {
    requireConnection();
    const amount = document.getElementById("unstakeAmount").value;

    status("Unstake en cours...");
    const tx = await staking.unstake(ethers.utils.parseEther(amount));
    await tx.wait();

    status("Unstake confirmé ✅");
  } catch (e) {
    console.error(e);
    status("Erreur unstake ❌");
  }
}
