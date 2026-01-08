// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DailyRecap
 * @dev Store daily proof card hashes on-chain with one recap per address per day limit
 * @notice dayId is computed canonically from block.timestamp / 1 days
 */
contract DailyRecap {
    // Mapping from address to dayId to recap hash
    mapping(address => mapping(uint256 => bytes32)) public recapHash;
    
    // Track last day submitted by each address
    mapping(address => uint256) public lastDaySubmitted;
    
    // Events
    event RecapSubmitted(
        address indexed user,
        uint256 indexed dayId,
        bytes32 recapHash,
        uint256 timestamp
    );

    /**
     * @dev Submit a daily recap hash (dayId computed from block.timestamp)
     * @param _recapHash Hash of the recap content (keccak256)
     */
    function submitRecap(bytes32 _recapHash) external {
        require(_recapHash != bytes32(0), "Recap hash cannot be empty");
        
        // Compute canonical dayId from block.timestamp
        uint256 dayId = block.timestamp / 1 days;
        
        require(recapHash[msg.sender][dayId] == bytes32(0), "Already submitted recap for this day");
        
        // Store the recap hash
        recapHash[msg.sender][dayId] = _recapHash;
        lastDaySubmitted[msg.sender] = dayId;
        
        emit RecapSubmitted(msg.sender, dayId, _recapHash, block.timestamp);
    }

    /**
     * @dev Get current dayId (computed from block.timestamp)
     */
    function getCurrentDayId() external view returns (uint256) {
        return block.timestamp / 1 days;
    }

    /**
     * @dev Get recap hash for a specific user and day
     * @param user Address to query
     * @param dayId Day to query
     */
    function getRecapHash(address user, uint256 dayId) external view returns (bytes32) {
        return recapHash[user][dayId];
    }

    /**
     * @dev Check if a user has submitted a recap for a specific day
     * @param user Address to check
     * @param dayId Day to check
     */
    function hasRecapForDay(address user, uint256 dayId) external view returns (bool) {
        return recapHash[user][dayId] != bytes32(0);
    }

    /**
     * @dev Check if a user can submit a recap for today
     * @param user Address to check
     */
    function canSubmitToday(address user) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return recapHash[user][today] == bytes32(0);
    }
}
