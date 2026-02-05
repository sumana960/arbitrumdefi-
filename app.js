// ================== CONFIG ==================
const ARBITRUM_CHAIN_ID = "0xa4b1"; // 42161

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

// ================== WALLET ==================
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask non détecté");
    return;
  }

  // Force Arbitrum
  const currentChain = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (currentChain !== ARBITRUM_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARBITRUM_CHAIN_ID }],
      });
    } catch (err) {
      alert("Veuillez passer sur Arbitrum One");
      return;
    }
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById("wallet").innerText =
    "Wallet connecté : " + address;

  token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);
  staking = new ethers.Contract(STAKING_ADDRESS, stakingAbi, signer);
}

// ================== ACTIONS ==================
async function approve() {
  try {
    const amount = document.getElementById("approveAmount").value;
    if (!amount || amount <= 0) return alert("Montant invalide");

    const tx = await token.approve(
      STAKING_ADDRESS,
      ethers.utils.parseEther(amount)
    );
    await tx.wait();
    alert("Approve réussi ✅");
  } catch (err) {
    alert("Erreur approve ❌");
    console.error(err);
  }
}

async function stake() {
  try {
    const amount = document.getElementById("stakeAmount").value;
    if (!amount || amount <= 0) return alert("Montant invalide");

    const tx = await staking.stake(
      ethers.utils.parseEther(amount)
    );
    await tx.wait();
    alert("Stake réussi ✅");
  } catch (err) {
    alert("Erreur stake ❌");
    console.error(err);
  }
}

async function claim() {
  try {
    const tx = await staking.claim();
    await tx.wait();
    alert("Rewards claimés ✅");
  } catch (err) {
    alert("Erreur claim ❌");
    console.error(err);
  }
}

async function unstake() {
  try {
    const amount = document.getElementById("unstakeAmount").value;
    if (!amount || amount <= 0) return alert("Montant invalide");

    const tx = await staking.unstake(
      ethers.utils.parseEther(amount)
    );
    await tx.wait();
    alert("Unstake réussi ✅");
  } catch (err) {
    alert("Erreur unstake ❌");
    console.error(err);
  }
