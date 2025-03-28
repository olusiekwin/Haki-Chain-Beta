// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title HakiToken
 * @dev ERC20 Token for the Haki platform
 */
contract HakiToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Events
    event RewardIssued(address recipient, uint256 amount, string reason);
    
    /**
     * @dev Constructor
     * @param admin Address of the admin
     */
    constructor(address admin) ERC20("Haki Token", "HAKI") {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
        _setupRole(MINTER_ROLE, admin);
    }
    
    /**
     * @dev Mint tokens to an address
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
    
    /**
     * @dev Issue reward tokens to a user
     * @param recipient Address of the recipient
     * @param amount Amount of tokens to reward
     * @param reason Reason for the reward
     */
    function issueReward(address recipient, uint256 amount, string memory reason) external onlyRole(MINTER_ROLE) {
        _mint(recipient, amount);
        emit RewardIssued(recipient, amount, reason);
    }
    
    /**
     * @dev Add a new minter
     * @param minter Address of the new minter
     */
    function addMinter(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, minter);
    }
    
    /**
     * @dev Remove a minter
     * @param minter Address of the minter to remove
     */
    function removeMinter(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, minter);
    }
}

