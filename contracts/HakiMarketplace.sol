// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HakiMarketplace
 * @dev Contract for marketplace of legal templates and services
 */
contract HakiMarketplace is Ownable, ReentrancyGuard {
    // Token contract
    IERC20 public hakiToken;
    
    // Platform fee percentage (in basis points, e.g. 250 = 2.5%)
    uint256 public platformFeeRate = 250;
    
    // Item struct
    struct Item {
        uint256 id;
        address seller;
        string title;
        string description;
        uint256 price;
        string fileHash;
        bool isActive;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    // Item mapping and counter
    mapping(uint256 => Item) public items;
    uint256 public itemCount;
    
    // User items mapping
    mapping(address => uint256[]) public userItems;
    
    // Purchased items mapping
    mapping(address => mapping(uint256 => bool)) public purchases;
    
    // Events
    event ItemListed(uint256 indexed itemId, address indexed seller, uint256 price);
    event ItemSold(uint256 indexed itemId, address indexed buyer, address indexed seller, uint256 price);
    event ItemDelisted(uint256 indexed itemId);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    
    /**
     * @dev Constructor
     * @param _tokenAddress Address of the HAKI token contract
     */
    constructor(address _tokenAddress) {
        hakiToken = IERC20(_tokenAddress);
        itemCount = 0;
    }
    
    /**
     * @dev List a new item
     * @param _title Title of the item
     * @param _description Description of the item
     * @param _price Price in HAKI tokens
     * @param _fileHash IPFS hash of the file
     * @return itemId ID of the created item
     */
    function listItem(
        string memory _title,
        string memory _description,
        uint256 _price,
        string memory _fileHash
    ) external returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        
        // Increment item count
        itemCount++;
        
        // Create new item
        Item memory newItem = Item({
            id: itemCount,
            seller: msg.sender,
            title: _title,
            description: _description,
            price: _price,
            fileHash: _fileHash,
            isActive: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        // Store item
        items[itemCount] = newItem;
        
        // Add to user's items
        userItems[msg.sender].push(itemCount);
        
        // Emit event
        emit ItemListed(itemCount, msg.sender, _price);
        
        return itemCount;
    }
    
    /**
     * @dev Buy an item
     * @param _itemId ID of the item to buy
     */
    function buyItem(uint256 _itemId) external nonReentrant {
        require(_itemId > 0 && _itemId <= itemCount, "Invalid item ID");
        require(items[_itemId].isActive, "Item is not active");
        require(items[_itemId].seller != msg.sender, "Cannot buy your own item");
        require(!purchases[msg.sender][_itemId], "Already purchased this item");
        
        Item storage item = items[_itemId];
        
        // Check buyer has enough tokens
        require(hakiToken.balanceOf(msg.sender) >= item.price, "Insufficient token balance");
        require(hakiToken.allowance(msg.sender, address(this)) >= item.price, "Token allowance too low");
        
        // Calculate platform fee
        uint256 platformFee = (item.price * platformFeeRate) / 10000;
        uint256 sellerAmount = item.price - platformFee;
        
        // Transfer tokens from buyer to contract
        hakiToken.transferFrom(msg.sender, address(this), item.price);
        
        // Transfer seller amount to seller
        hakiToken.transfer(item.seller, sellerAmount);
        
        // Record purchase
        purchases[msg.sender][_itemId] = true;
        
        // Emit event
        emit ItemSold(_itemId, msg.sender, item.seller, item.price);
    }
    
    /**
     * @dev Delist an item
     * @param _itemId ID of the item to delist
     */
    function delistItem(uint256 _itemId) external {
        require(_itemId > 0 && _itemId <= itemCount, "Invalid item ID");
        require(items[_itemId].isActive, "Item is already inactive");
        require(msg.sender == items[_itemId].seller || msg.sender == owner(), "Not authorized");
        
        // Update item
        items[_itemId].isActive = false;
        items[_itemId].updatedAt = block.timestamp;
        
        // Emit event
        emit ItemDelisted(_itemId);
    }
    
    /**
     * @dev Update platform fee rate
     * @param _newFeeRate New fee rate in basis points
     */
    function updatePlatformFee(uint256 _newFeeRate) external onlyOwner {
        require(_newFeeRate <= 1000, "Fee cannot exceed 10%");
        
        uint256 oldFeeRate = platformFeeRate;
        platformFeeRate = _newFeeRate;
        
        emit PlatformFeeUpdated(oldFeeRate, _newFeeRate);
    }
    
    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = hakiToken.balanceOf(address(this));
        require(balance > 0, "No fees to withdraw");
        
        hakiToken.transfer(owner(), balance);
    }
    
    /**
     * @dev Check if user has purchased an item
     * @param _user Address of the user
     * @param _itemId ID of the item
     * @return bool True if user has purchased the item
     */
    function hasPurchased(address _user, uint256 _itemId) external view returns (bool) {
        return purchases[_user][_itemId];
    }
    
    /**
     * @dev Get an item by ID
     * @param _itemId ID of the item
     * @return Item details
     */
    function getItem(uint256 _itemId) external view returns (
        address seller,
        string memory title,
        string memory description,
        uint256 price,
        string memory fileHash,
        bool isActive
    ) {
        require(_itemId > 0 && _itemId <= itemCount, "Invalid item ID");
        
        Item memory item = items[_itemId];
        
        return (
            item.seller,
            item.title,
            item.description,
            item.price,
            item.fileHash,
            item.isActive
        );
    }
    
    /**
     * @dev Get all items listed by a user
     * @param _user Address of the user
     * @return Array of item IDs
     */
    function getUserItems(address _user) external view returns (uint256[] memory) {
        return userItems[_user];
    }
}

