// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title HakiEscrow
 * @dev Manages escrow for legal bounties
 */
contract HakiEscrow {
    // Enum for milestone status
    enum MilestoneStatus { Pending, InProgress, Completed, Released }
    
    // Enum for escrow status
    enum EscrowStatus { Active, Completed, Refunded }
    
    // Struct for milestone
    struct Milestone {
        string id;
        uint256 amount;
        string description;
        MilestoneStatus status;
        uint256 completedAt;
    }
    
    // Struct for escrow
    struct Escrow {
        string bountyId;
        address ngo;
        address lawyer;
        uint256 totalAmount;
        uint256 releasedAmount;
        EscrowStatus status;
        uint256 createdAt;
        uint256 updatedAt;
        Milestone[] milestones;
    }
    
    // Mapping from escrow ID to escrow
    mapping(string => Escrow) public escrows;
    
    // Events
    event EscrowCreated(string escrowId, string bountyId, address ngo, uint256 totalAmount);
    event LawyerAssigned(string escrowId, address lawyer);
    event MilestoneCompleted(string escrowId, string milestoneId, uint256 completedAt);
    event MilestoneReleased(string escrowId, string milestoneId, address lawyer, uint256 amount);
    event EscrowRefunded(string escrowId, address ngo, uint256 amount);
    event EscrowCompleted(string escrowId);
    
    /**
     * @dev Create a new escrow
     * @param escrowId Unique ID for the escrow
     * @param bountyId ID of the bounty
     * @param lawyer Address of the lawyer (can be address(0) if not assigned yet)
     * @param milestoneDescriptions Array of milestone descriptions
     * @param milestoneAmounts Array of milestone amounts
     */
    function createEscrow(
        string memory escrowId,
        string memory bountyId,
        address ngo,
        address lawyer,
        string[] memory milestoneDescriptions,
        uint256[] memory milestoneAmounts
    ) external payable {
        require(milestoneDescriptions.length == milestoneAmounts.length, "Milestone arrays must have same length");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            totalAmount += milestoneAmounts[i];
        }
        
        require(msg.value == totalAmount, "Sent value must match total milestone amounts");
        
        Escrow storage newEscrow = escrows[escrowId];
        newEscrow.bountyId = bountyId;
        newEscrow.ngo = ngo;
        newEscrow.lawyer = lawyer;
        newEscrow.totalAmount = totalAmount;
        newEscrow.releasedAmount = 0;
        newEscrow.status = EscrowStatus.Active;
        newEscrow.createdAt = block.timestamp;
        newEscrow.updatedAt = block.timestamp;
        
        // Create milestones
        for (uint256 i = 0; i < milestoneDescriptions.length; i++) {
            Milestone memory milestone;
            milestone.id = string(abi.encodePacked("milestone-", i.toString()));
            milestone.amount = milestoneAmounts[i];
            milestone.description = milestoneDescriptions[i];
            milestone.status = MilestoneStatus.Pending;
            milestone.completedAt = 0;
            
            newEscrow.milestones.push(milestone);
        }
        
        emit EscrowCreated(escrowId, bountyId, ngo, totalAmount);
    }
    
    /**
     * @dev Assign a lawyer to an escrow
     * @param escrowId ID of the escrow
     * @param lawyer Address of the lawyer
     */
    function assignLawyer(string memory escrowId, address lawyer) external {
        Escrow storage escrow = escrows[escrowId];
        
        require(escrow.ngo == msg.sender, "Only NGO can assign lawyer");
        require(escrow.lawyer == address(0), "Lawyer already assigned");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        
        escrow.lawyer = lawyer;
        escrow.updatedAt = block.timestamp;
        
        // Update first milestone to in-progress
        if (escrow.milestones.length > 0) {
            escrow.milestones[0].status = MilestoneStatus.InProgress;
        }
        
        emit LawyerAssigned(escrowId, lawyer);
    }
    
    /**
     * @dev Complete a milestone
     * @param escrowId ID of the escrow
     * @param milestoneIndex Index of the milestone
     */
    function completeMilestone(string memory escrowId, uint256 milestoneIndex) external {
        Escrow storage escrow = escrows[escrowId];
        
        require(escrow.lawyer == msg.sender, "Only assigned lawyer can complete milestone");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(milestoneIndex < escrow.milestones.length, "Invalid milestone index");
        require(escrow.milestones[milestoneIndex].status == MilestoneStatus.InProgress, "Milestone not in progress");
        
        escrow.milestones[milestoneIndex].status = MilestoneStatus.Completed;
        escrow.milestones[milestoneIndex].completedAt = block.timestamp;
        escrow.updatedAt = block.timestamp;
        
        emit MilestoneCompleted(escrowId, escrow.milestones[milestoneIndex].id, block.timestamp);
    }
    
    /**
     * @dev Release payment for a completed milestone
     * @param escrowId ID of the escrow
     * @param milestoneIndex Index of the milestone
     */
    function releaseMilestonePayment(string memory escrowId, uint256 milestoneIndex) external {
        Escrow storage escrow = escrows[escrowId];
        
        require(escrow.ngo == msg.sender, "Only NGO can release payment");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(milestoneIndex < escrow.milestones.length, "Invalid milestone index");
        require(escrow.milestones[milestoneIndex].status == MilestoneStatus.Completed, "Milestone not completed");
        
        uint256 amount = escrow.milestones[milestoneIndex].amount;
        escrow.milestones[milestoneIndex].status = MilestoneStatus.Released;
        escrow.releasedAmount += amount;
        escrow.updatedAt = block.timestamp;
        
        // Transfer payment to lawyer
        payable(escrow.lawyer).transfer(amount);
        
        emit MilestoneReleased(escrowId, escrow.milestones[milestoneIndex].id, escrow.lawyer, amount);
        
        // If all milestones are released, mark escrow as completed
        bool allReleased = true;
        for (uint256 i = 0; i < escrow.milestones.length; i++) {
            if (escrow.milestones[i].status != MilestoneStatus.Released) {
                allReleased = false;
                break;
            }
        }
        
        if (allReleased) {
            escrow.status = EscrowStatus.Completed;
            emit EscrowCompleted(escrowId);
        } else if (milestoneIndex + 1 < escrow.milestones.length) {
            // Set next milestone to in-progress
            escrow.milestones[milestoneIndex + 1].status = MilestoneStatus.InProgress;
        }
    }
    
    /**
     * @dev Refund escrow to NGO (only if no lawyer assigned or admin)
     * @param escrowId ID of the escrow
     */
    function refundEscrow(string memory escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        
        require(escrow.ngo == msg.sender, "Only NGO can refund escrow");
        require(escrow.status == EscrowStatus.Active, "Escrow not active");
        require(escrow.lawyer == address(0), "Lawyer already assigned");
        
        uint256 remainingAmount = escrow.totalAmount - escrow.releasedAmount;
        escrow.status = EscrowStatus.Refunded;
        escrow.updatedAt = block.timestamp;
        
        // Transfer remaining funds back to NGO
        payable(escrow.ngo).transfer(remainingAmount);
        
        emit EscrowRefunded(escrowId, escrow.ngo, remainingAmount);
    }
    
    /**
     * @dev Get escrow details
     * @param escrowId ID of the escrow
     */
    function getEscrow(string memory escrowId) external view returns (
        string memory bountyId,
        address ngo,
        address lawyer,
        uint256 totalAmount,
        uint256 releasedAmount,
        EscrowStatus status,
        uint256 createdAt,
        uint256 updatedAt,
        uint256 milestonesCount
    ) {
        Escrow storage escrow = escrows[escrowId];
        
        return (
            escrow.bountyId,
            escrow.ngo,
            escrow.lawyer,
            escrow.totalAmount,
            escrow.releasedAmount,
            escrow.status,
            escrow.createdAt,
            escrow.updatedAt,
            escrow.milestones.length
        );
    }
    
    /**
     * @dev Get milestone details
     * @param escrowId ID of the escrow
     * @param milestoneIndex Index of the milestone
     */
    function getMilestone(string memory escrowId, uint256 milestoneIndex) external view returns (
        string memory id,
        uint256 amount,
        string memory description,
        MilestoneStatus status,
        uint256 completedAt
    ) {
        Escrow storage escrow = escrows[escrowId];
        require(milestoneIndex < escrow.milestones.length, "Invalid milestone index");
        
        Milestone storage milestone = escrow.milestones[milestoneIndex];
        
        return (
            milestone.id,
            milestone.amount,
            milestone.description,
            milestone.status,
            milestone.completedAt
        );
    }
}

