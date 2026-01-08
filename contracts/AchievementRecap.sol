// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title AchievementRecap
 * @dev Anchor verifiable achievements and milestones on-chain
 */
contract AchievementRecap {
    enum Category {
        CODE,           // "Deployed my first dapp"
        LEARNING,       // "Completed Solidity course"
        FITNESS,        // "Ran my first marathon"
        BUSINESS,       // "Hit $10K MRR"
        SOCIAL,         // "Hit 10K followers"
        CREATIVE,       // "Launched my album"
        OTHER           // Custom achievements
    }

    struct Achievement {
        address user;
        uint256 timestamp;
        string title;           // "Deployed my first Base dapp"
        Category category;
        string proof;          // URL or description of proof
        uint256 likes;
        bool verified;         // Community verified
    }

    // All achievements
    Achievement[] public achievements;
    
    // User's achievement indices
    mapping(address => uint256[]) public userAchievements;
    
    // Achievement likes
    mapping(uint256 => mapping(address => bool)) public hasLiked;
    
    // Daily limit tracking
    mapping(address => mapping(uint256 => bool)) public dailySubmissions;
    
    // Verification votes (achievement ID => voter => bool)
    mapping(uint256 => mapping(address => bool)) public verificationVotes;
    mapping(uint256 => uint256) public verificationCount;
    
    // Events
    event AchievementPosted(
        uint256 indexed achievementId,
        address indexed user,
        string title,
        Category category,
        uint256 timestamp
    );
    
    event AchievementLiked(
        uint256 indexed achievementId,
        address indexed liker
    );
    
    event AchievementVerified(
        uint256 indexed achievementId,
        address indexed verifier,
        uint256 totalVotes
    );

    /**
     * @dev Post a new achievement
     */
    function postAchievement(
        string calldata title,
        Category category,
        string calldata proof
    ) external returns (uint256) {
        require(bytes(title).length > 0 && bytes(title).length <= 200, "Invalid title length");
        require(bytes(proof).length <= 500, "Proof too long");
        
        uint256 daysSinceEpoch = block.timestamp / 1 days;
        require(!dailySubmissions[msg.sender][daysSinceEpoch], "Already posted today");
        
        dailySubmissions[msg.sender][daysSinceEpoch] = true;
        
        Achievement memory newAchievement = Achievement({
            user: msg.sender,
            timestamp: block.timestamp,
            title: title,
            category: category,
            proof: proof,
            likes: 0,
            verified: false
        });
        
        achievements.push(newAchievement);
        uint256 achievementId = achievements.length - 1;
        userAchievements[msg.sender].push(achievementId);
        
        emit AchievementPosted(achievementId, msg.sender, title, category, block.timestamp);
        
        return achievementId;
    }

    /**
     * @dev Like an achievement
     */
    function likeAchievement(uint256 achievementId) external {
        require(achievementId < achievements.length, "Invalid achievement");
        require(!hasLiked[achievementId][msg.sender], "Already liked");
        
        hasLiked[achievementId][msg.sender] = true;
        achievements[achievementId].likes++;
        
        emit AchievementLiked(achievementId, msg.sender);
    }

    /**
     * @dev Verify an achievement (community validation)
     */
    function verifyAchievement(uint256 achievementId) external {
        require(achievementId < achievements.length, "Invalid achievement");
        require(!verificationVotes[achievementId][msg.sender], "Already verified");
        require(achievements[achievementId].user != msg.sender, "Cannot verify own achievement");
        
        verificationVotes[achievementId][msg.sender] = true;
        verificationCount[achievementId]++;
        
        // Auto-verify after 3 verifications
        if (verificationCount[achievementId] >= 3 && !achievements[achievementId].verified) {
            achievements[achievementId].verified = true;
        }
        
        emit AchievementVerified(achievementId, msg.sender, verificationCount[achievementId]);
    }

    /**
     * @dev Get total achievements
     */
    function getTotalAchievements() external view returns (uint256) {
        return achievements.length;
    }

    /**
     * @dev Get user's achievement count
     */
    function getUserAchievementCount(address user) external view returns (uint256) {
        return userAchievements[user].length;
    }

    /**
     * @dev Get user's achievements
     */
    function getUserAchievements(address user) external view returns (uint256[] memory) {
        return userAchievements[user];
    }

    /**
     * @dev Get latest achievements
     */
    function getLatestAchievements(uint256 offset, uint256 limit) 
        external 
        view 
        returns (Achievement[] memory) 
    {
        require(offset < achievements.length, "Offset out of bounds");
        
        uint256 end = offset + limit;
        if (end > achievements.length) {
            end = achievements.length;
        }
        
        uint256 resultLength = end - offset;
        Achievement[] memory result = new Achievement[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = achievements[achievements.length - 1 - offset - i];
        }
        
        return result;
    }

    /**
     * @dev Check if user can post today
     */
    function canPostToday(address user) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return !dailySubmissions[user][today];
    }

    /**
     * @dev Get achievements by category
     */
    function getAchievementsByCategory(Category category, uint256 limit) 
        external 
        view 
        returns (Achievement[] memory) 
    {
        uint256 count = 0;
        
        // Count matching achievements
        for (uint256 i = 0; i < achievements.length && count < limit; i++) {
            if (achievements[achievements.length - 1 - i].category == category) {
                count++;
            }
        }
        
        Achievement[] memory result = new Achievement[](count);
        uint256 index = 0;
        
        // Collect matching achievements
        for (uint256 i = 0; i < achievements.length && index < count; i++) {
            Achievement memory achievement = achievements[achievements.length - 1 - i];
            if (achievement.category == category) {
                result[index] = achievement;
                index++;
            }
        }
        
        return result;
    }
}
