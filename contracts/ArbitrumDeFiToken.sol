// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
    ArbitrumDeFiToken
    - ERC20 standard
    - Supply cap fixe
    - Mint contrôlé
    - Gas optimisé
    - Prêt pour staking séparé
*/
contract ArbitrumDeFiToken is ERC20, Ownable {

    /// @notice Supply maximale (10 millions)
    uint256 public constant MAX_SUPPLY = 10_000_000 ether;

    constructor() ERC20("ArbitrumDeFi", "ARBDEFI") Ownable(msg.sender) {
        // Mint initial (10 % de la supply)
        _mint(msg.sender, 1_000_000 ether);
    }

    /**
     * @notice Mint de nouveaux tokens (ex: rewards, liquidité)
     * @dev Capé par MAX_SUPPLY
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Zero address");
        require(amount > 0, "Zero amount");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");

        _mint(to, amount);
    }
}
