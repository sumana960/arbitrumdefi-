// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/*
    ArbitrumDeFiStaking
    - Staking ERC20 standard
    - Rewards non inflationnistes (pool financé)
    - Sécurité renforcée
    - Gas optimisé (Arbitrum friendly)
*/
contract ArbitrumDeFiStaking is Ownable, ReentrancyGuard {

    IERC20 public immutable token;

    // rewards par seconde par token staké (1e18)
    uint256 public rewardRate;
    uint256 public totalStaked;

    struct User {
        uint128 amount;       // tokens stakés
        uint128 rewardDebt;   // rewards accumulées
        uint64 lastUpdate;    // dernier update
    }

    mapping(address => User) public users;

    // -------- EVENTS --------
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event RewardsFunded(uint256 amount);

    constructor(address tokenAddress, uint256 initialRewardRate)
        Ownable(msg.sender)
    {
        require(tokenAddress != address(0), "Zero token address");
        require(initialRewardRate > 0, "Zero reward rate");

        token = IERC20(tokenAddress);
        rewardRate = initialRewardRate;
    }

    // -------- INTERNAL --------
    function _update(address user) internal {
        User storage u = users[user];

        if (u.amount != 0) {
            uint256 elapsed = block.timestamp - u.lastUpdate;
            uint256 reward = (elapsed * rewardRate * u.amount) / 1e18;

            // protection overflow logique (sécurité long terme)
            require(
                reward <= type(uint128).max - u.rewardDebt,
                "Reward overflow"
            );

            u.rewardDebt += uint128(reward);
        }

        u.lastUpdate = uint64(block.timestamp);
    }

    // -------- USER FUNCTIONS --------
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Zero stake");

        _update(msg.sender);

        token.transferFrom(msg.sender, address(this), amount);

        users[msg.sender].amount += uint128(amount);
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        User storage u = users[msg.sender];
        require(amount > 0, "Zero amount");
        require(u.amount >= amount, "Not enough staked");

        _update(msg.sender);

        u.amount -= uint128(amount);
        totalStaked -= amount;

        token.transfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    function claim() external nonReentrant {
        _update(msg.sender);

        uint256 reward = users[msg.sender].rewardDebt;
        require(reward > 0, "No rewards");
        require(
            token.balanceOf(address(this)) >= reward,
            "Insufficient reward balance"
        );

        users[msg.sender].rewardDebt = 0;

        token.transfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    // -------- VIEW --------
    function pendingReward(address user) external view returns (uint256) {
        User memory u = users[user];
        if (u.amount == 0) return u.rewardDebt;

        uint256 elapsed = block.timestamp - u.lastUpdate;
        return u.rewardDebt + (elapsed * rewardRate * u.amount) / 1e18;
    }

    // -------- ADMIN --------
    function setRewardRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Zero reward rate");

        uint256 old = rewardRate;
        rewardRate = newRate;

        emit RewardRateUpdated(old, newRate);
    }

    function fundRewards(uint256 amount) external onlyOwner {
        require(amount > 0, "Zero amount");

        token.transferFrom(msg.sender, address(this), amount);

        emit RewardsFunded(amount);
    }
}
