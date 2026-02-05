# ArbitrumDeFi

ArbitrumDeFi is a simple decentralized finance (DeFi) project built on **Arbitrum One**.  
It includes an **ERC20 token** and a **staking smart contract** allowing users to stake tokens and earn rewards.

This project is designed for **learning, demonstration, and portfolio purposes**.

---

## 📄 Smart Contracts

- **ARBDEFI Token (ERC20)**  
  `0x200f34919354B51A700fC3d48103747eb6c933D0`

- **Staking Contract**  
  `0x84338201F97e28Acd9ed93046d49c98B5D991853`

Network: **Arbitrum One**

---

## ✨ Features

- Stake ARBDEFI tokens
- Claim staking rewards anytime
- Unstake tokens without lock period
- Non-inflationary rewards (rewards are funded, not minted)
- Simple and transparent logic

---

## 🚀 How to Use (Step by Step)

### 1️⃣ Connect Wallet
- Open the dApp
- Click **Connect Wallet**
- Make sure MetaMask is connected to **Arbitrum One**

---

### 2️⃣ Import the Token (one time)
In MetaMask:
- Go to **Import Tokens**
- Paste the token address
- Symbol: `ARBDEFI`
- Decimals: `18`

---

### 3️⃣ Approve Tokens
Before staking, you must approve the staking contract.

- Enter the amount you want to stake (example: `100`)
- Click **Approve**
- Confirm the transaction in MetaMask

⚠️ This step is required only once (or if allowance is insufficient).

---

### 4️⃣ Stake Tokens
- Enter the amount to stake
- Click **Stake**
- Confirm the transaction

Your tokens are now locked in the staking contract.

---

### 5️⃣ Claim Rewards
- Click **Claim**
- Rewards earned will be sent directly to your wallet

You can claim rewards **anytime** without unstaking.

---

### 6️⃣ Unstake Tokens
- Enter the amount you want to unstake
- Click **Unstake**
- Confirm the transaction

Your staked tokens will be returned to your wallet.

---

## 🔒 Security Notes

- Built using OpenZeppelin contracts
- Protected against reentrancy attacks
- Owner can update reward rate (for testing/education)
- No hidden minting during staking

---

## ⚠️ Disclaimer

This project is **experimental and educational**.  
It is **not audited** and **not intended for production use or real financial investment**.

Use at your own risk.

---

## 👨‍💻 Author

Built by an independent developer as a Solidity & Web3 learning project.  
Feedback and improvements are welcome.
