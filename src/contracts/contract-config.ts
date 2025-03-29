// Contract ABIs and addresses
import { config } from "../utils/config"

// Token contract ABI (simplified for example)
export const tokenContractABI = [
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",

  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",

  // Write functions
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
]

// Bounty contract ABI (simplified for example)
export const bountyContractABI = [
  // Events
  "event BountyCreated(uint256 indexed bountyId, address indexed creator, uint256 reward)",
  "event BountyAccepted(uint256 indexed bountyId, address indexed worker)",
  "event BountyCompleted(uint256 indexed bountyId, address indexed worker)",
  "event BountyCancelled(uint256 indexed bountyId)",

  // Read functions
  "function getBounty(uint256 bountyId) view returns (address creator, string title, string description, uint256 reward, uint8 status, address worker)",
  "function getBountyCount() view returns (uint256)",
  "function getUserBounties(address user) view returns (uint256[])",

  // Write functions
  "function createBounty(string title, string description, uint256 reward) returns (uint256)",
  "function acceptBounty(uint256 bountyId) returns (bool)",
  "function completeBounty(uint256 bountyId) returns (bool)",
  "function cancelBounty(uint256 bountyId) returns (bool)",
]

// Marketplace contract ABI (simplified for example)
export const marketplaceContractABI = [
  // Events
  "event ItemListed(uint256 indexed itemId, address indexed seller, uint256 price)",
  "event ItemSold(uint256 indexed itemId, address indexed buyer, address indexed seller, uint256 price)",
  "event ItemDelisted(uint256 indexed itemId)",

  // Read functions
  "function getItem(uint256 itemId) view returns (address seller, string title, string description, uint256 price, string fileHash, bool isActive)",
  "function getItemCount() view returns (uint256)",
  "function getUserItems(address user) view returns (uint256[])",

  // Write functions
  "function listItem(string title, string description, uint256 price, string fileHash) returns (uint256)",
  "function buyItem(uint256 itemId) returns (bool)",
  "function delistItem(uint256 itemId) returns (bool)",
]

// Contract addresses from config
export const contractAddresses = {
  token: config.contracts.token,
  bounty: config.contracts.bounty,
  marketplace: config.contracts.marketplace,
}

