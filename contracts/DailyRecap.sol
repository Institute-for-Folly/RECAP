// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DailyRecap
 * @dev Store daily recaps on-chain with one recap per address per day limit
 */
contract DailyRecap {
    struct Recap {
        address user;
        uint256 timestamp;
        bytes32 contentHash;
    }

    // Mapping from address to date (in days since epoch) to recap hash
    mapping(address => mapping(uint256 => bytes32)) public dailyRecaps;
    
    // Array to store all recaps for querying
    Recap[] public recaps;
    
    // Events
    event RecapSubmitted(
        address indexed user,
        uint256 indexed daysSinceEpoch,
        bytes32 contentHash,
        uint256 timestamp
    );

    /**
     * @dev Submit a daily recap
     * @param contentHash Hash of the recap content (keccak256)
     */
    function submitRecap(bytes32 contentHash) external {
        require(contentHash != bytes32(0), "Content hash cannot be empty");
        
        uint256 daysSinceEpoch = block.timestamp / 1 days;
        
        // Check if user already submitted a recap today
        require(
            dailyRecaps[msg.sender][daysSinceEpoch] == bytes32(0),
            "Already submitted a recap today"
        );
        
        // Store the recap
        dailyRecaps[msg.sender][daysSinceEpoch] = contentHash;
        
        recaps.push(Recap({
            user: msg.sender,
            timestamp: block.timestamp,
            contentHash: contentHash
        }));
        
        emit RecapSubmitted(msg.sender, daysSinceEpoch, contentHash, block.timestamp);
    }

    /**
     * @dev Check if a user has submitted a recap for a specific day
     * @param user Address to check
     * @param daysSinceEpoch Day to check (days since Unix epoch)
     */
    function hasRecapForDay(address user, uint256 daysSinceEpoch) external view returns (bool) {
        return dailyRecaps[user][daysSinceEpoch] != bytes32(0);
    }

    /**
     * @dev Get recap hash for a specific user and day
     * @param user Address to query
     * @param daysSinceEpoch Day to query (days since Unix epoch)
     */
    function getRecapForDay(address user, uint256 daysSinceEpoch) external view returns (bytes32) {
        return dailyRecaps[user][daysSinceEpoch];
    }

    /**
     * @dev Check if a user can submit a recap today
     * @param user Address to check
     */
    function canSubmitToday(address user) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return dailyRecaps[user][today] == bytes32(0);
    }

    /**
     * @dev Get total number of recaps submitted
     */
    function getTotalRecaps() external view returns (uint256) {
        return recaps.length;
    }

    /**
     * @dev Get recap at specific index
     * @param index Index in the recaps array
     */
    function getRecapAtIndex(uint256 index) external view returns (Recap memory) {
        require(index < recaps.length, "Index out of bounds");
        return recaps[index];
    }

    /**
     * @dev Get latest recaps (paginated)
     * @param offset Starting index
     * @param limit Number of recaps to return
     */
    function getLatestRecaps(uint256 offset, uint256 limit) 
        external 
        view 
        returns (Recap[] memory) 
    {
        require(offset < recaps.length, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > recaps.length) {
            end = recaps.length;
        }
        
        uint256 resultLength = end - offset;
        Recap[] memory result = new Recap[](resultLength);
        
        // Return in reverse order (latest first)
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = recaps[recaps.length - 1 - offset - i];
        }
        
        return result;
    }
}
