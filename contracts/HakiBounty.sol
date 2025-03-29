// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HakiBounty
 * @dev Contract for managing legal bounties on the HakiChain platform
 */
contract HakiBounty is Ownable, ReentrancyGuard {
    // Token contract
    IERC20 public hakiToken;
    
    // Bounty status enum
    enum BountyStatus { Open, InProgress, Completed, Cancelled }
    
    // Bounty struct
    struct Bounty {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 reward;
        BountyStatus status;
        address worker;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    // Bounty mapping and counter
    mapping(uint256 => Bounty) public bounties;
    uint256 public bountyCount;
    
    // User bounties mapping
    mapping(address => uint256[]) public userBounties;
    mapping(address => uint256[]) public workerBounties;
    
    // Events
    event BountyCreated(uint256 indexed bountyId, address indexed creator, uint256 reward);
    event BountyAccepted(uint256 indexed bountyId, address indexed worker);
    event BountyCompleted(uint256 indexed bountyId, address indexed worker, uint256 reward);
    event BountyCancelled(uint256 indexed bountyId);
    
    /**
     * @dev Constructor
     * @param _tokenAddress Address of the HAKI token contract
     */
    constructor(address _tokenAddress) {
        hakiToken = IERC20(_tokenAddress);
        bountyCount = 0;
    }
    
    /**
     * @dev Create a new bounty
     * @param _title Title of the bounty
     * @param _description Description of the bounty
     * @param _reward Reward amount in HAKI tokens
     * @return bountyId ID of the created bounty
     */
    function createBounty(
        string memory _title,
        string memory _description,
        uint256 _reward
    ) external returns (uint256) {
        require(_reward > 0, "Reward must be greater than 0");
        require(hakiToken.balanceOf(msg.sender) >= _reward, "Insufficient token balance");
        require(hakiToken.allowance(msg.sender, address(this)) >= _reward, "Token allowance too low");
        
        // Transfer tokens from creator to contract
        hakiToken.transferFrom(msg.sender, address(this), _reward);
        
        // Increment bounty count
        bountyCount++;
        
        // Create new bounty
        Bounty memory newBounty = Bounty({
            id: bountyCount,
            creator: msg.sender,
            title: _title,
            description: _description,
            reward: _reward,
            status: BountyStatus.Open,
            worker: address(0),
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        // Store bounty
        bounties[bountyCount] = newBounty;
        
        // Add to user's bounties
        userBounties[msg.sender].push(bountyCount);
        
        // Emit event
        emit BountyCreated(bountyCount, msg.sender, _reward);
        
        return bountyCount;
    }
    
    /**
     * @dev Accept a bounty
     * @param _bountyId ID of the bounty to accept
     */
    function acceptBounty(uint256 _bountyId) external {
        require(_bountyId > 0 && _bountyId <= bountyCount, "Invalid bounty ID");
        require(bounties[_bountyId].status == BountyStatus.Open, "Bounty is not open");
        require(bounties[_bountyId].creator != msg.sender, "Creator cannot accept own bounty");
        
        // Update bounty
        bounties[_bountyId].status = BountyStatus.InProgress;
        bounties[_bountyId].worker = msg.sender;
        bounties[_bountyId].updatedAt = block.timestamp;
        
        // Add to worker's bounties
        workerBounties[msg.sender].push(_bountyId);
        
        // Emit event
        emit BountyAccepted(_bountyId, msg.sender);
    }
    
    /**
     * @dev Complete a bounty
     * @param _bountyId ID of the bounty to complete
     */
    function completeBounty(uint256 _bountyId) external nonReentrant {
        require(_bountyId > 0 && _bountyId <= bountyCount, "Invalid bounty ID");
        require(bounties[_bountyId].status == BountyStatus.InProgress, "Bounty is not in progress");
        
        Bounty storage bounty = bounties[_bountyId];
        
        // Only creator can mark as complete
        require(msg.sender == bounty.creator, "Only creator can complete bounty");
        
        // Update bounty
        bounty.status = BountyStatus.Completed;
        bounty.updatedAt = block.timestamp;
        
        // Transfer reward to worker
        hakiToken.transfer(bounty.worker, bounty.reward);
        
        // Emit event
        emit BountyCompleted(_bountyId, bounty.worker, bounty.reward);
    }
    
    /**
     * @dev Cancel a bounty
     * @param _bountyId ID of the bounty to cancel
     */
    function cancelBounty(uint256 _bountyId) external nonReentrant {
        require(_bountyId > 0 && _bountyId <= bountyCount, "Invalid bounty ID");
        require(bounties[_bountyId].status == BountyStatus.Open, "Can only cancel open bounties");
        require(msg.sender == bounties[_bountyId].creator, "Only creator can cancel");
        
        Bounty storage bounty = bounties[_bountyId];
        
        // Update bounty
        bounty.status = BountyStatus.Cancelled;
        bounty.updatedAt = block.timestamp;
        
        // Return tokens to creator
        hakiToken.transfer(bounty.creator, bounty.reward);
        
        // Emit event
        emit BountyCancelled(_bountyId);
    }
    
    /**
     * @dev Get a bounty by ID
     * @param _bountyId ID of the bounty
     * @return Bounty details
     */
    function getBounty(uint256 _bountyId) external view returns (
        address creator,
        string memory title,
        string memory description,
        uint256 reward,
        uint8 status,
        address worker
    ) {
        require(_bountyId > 0 && _bountyId <= bountyCount, "Invalid bounty ID");
        
        Bounty memory bounty = bounties[_bountyId];
        
        return (
            bounty.creator,
            bounty.title,
            bounty.description,
            bounty.reward,
            uint8(bounty.status),
            bounty.worker
        );
    }
    
    /**
     * @dev Get all bounties created by a user
     * @param _user Address of the user
     * @return Array of bounty IDs
     */
    function getUserBounties(address _user) external view returns (uint256[] memory) {
        return userBounties[_user];
    }
    
    /**
     * @dev Get all bounties accepted by a worker
     * @param _worker Address of the worker
     * @return Array of bounty IDs
     */
    function getWorkerBounties(address _worker) external view returns (uint256[] memory) {
        return workerBounties[_worker];
    }
}

