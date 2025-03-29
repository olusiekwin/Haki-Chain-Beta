// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HakiToken
 * @dev ERC20 Token for the HakiChain platform
 */
contract HakiToken is ERC20, Ownable {
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @dev Constructor that gives the msg.sender all of existing tokens.
     */
    constructor(uint256 initialSupply) ERC20("HakiToken", "HAKI") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(address to, uint256 amount) public onlyOwner returns (bool) {
        _mint(to, amount);
        emit TokensMinted(to, amount);
        return true;
    }

    /**
     * @dev Function to burn tokens
     * @param from The address that will have tokens burned.
     * @param amount The amount of tokens to burn.
     * @return A boolean that indicates if the operation was successful.
     */
    function burn(address from, uint256 amount) public onlyOwner returns (bool) {
        _burn(from, amount);
        emit TokensBurned(from, amount);
        return true;
    }
}

