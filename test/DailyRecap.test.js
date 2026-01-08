const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("DailyRecap", function () {
  let dailyRecap;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const DailyRecap = await ethers.getContractFactory("DailyRecap");
    dailyRecap = await DailyRecap.deploy();
    await dailyRecap.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await dailyRecap.getAddress()).to.be.properAddress;
    });

    it("Should have zero recaps initially", async function () {
      expect(await dailyRecap.getTotalRecaps()).to.equal(0);
    });
  });

  describe("Submit Recap", function () {
    it("Should allow submitting a recap", async function () {
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("My first recap"));
      
      await expect(dailyRecap.submitRecap(contentHash))
        .to.emit(dailyRecap, "RecapSubmitted")
        .withArgs(
          owner.address,
          await time.latest().then(t => Math.floor(t / 86400)),
          contentHash,
          await time.latest()
        );

      expect(await dailyRecap.getTotalRecaps()).to.equal(1);
    });

    it("Should not allow empty content hash", async function () {
      const emptyHash = ethers.ZeroHash;
      
      await expect(dailyRecap.submitRecap(emptyHash))
        .to.be.revertedWith("Content hash cannot be empty");
    });

    it("Should not allow submitting twice in the same day", async function () {
      const contentHash1 = ethers.keccak256(ethers.toUtf8Bytes("First recap"));
      const contentHash2 = ethers.keccak256(ethers.toUtf8Bytes("Second recap"));
      
      await dailyRecap.submitRecap(contentHash1);
      
      await expect(dailyRecap.submitRecap(contentHash2))
        .to.be.revertedWith("Already submitted a recap today");
    });

    it("Should allow submitting after a day has passed", async function () {
      const contentHash1 = ethers.keccak256(ethers.toUtf8Bytes("First recap"));
      const contentHash2 = ethers.keccak256(ethers.toUtf8Bytes("Second recap"));
      
      await dailyRecap.submitRecap(contentHash1);
      
      // Move forward 1 day
      await time.increase(86400);
      
      await expect(dailyRecap.submitRecap(contentHash2))
        .to.not.be.reverted;

      expect(await dailyRecap.getTotalRecaps()).to.equal(2);
    });

    it("Should allow different users to submit on the same day", async function () {
      const contentHash1 = ethers.keccak256(ethers.toUtf8Bytes("User 1 recap"));
      const contentHash2 = ethers.keccak256(ethers.toUtf8Bytes("User 2 recap"));
      
      await dailyRecap.connect(addr1).submitRecap(contentHash1);
      await dailyRecap.connect(addr2).submitRecap(contentHash2);

      expect(await dailyRecap.getTotalRecaps()).to.equal(2);
    });
  });

  describe("Query Functions", function () {
    beforeEach(async function () {
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("Test recap"));
      await dailyRecap.connect(owner).submitRecap(contentHash);
    });

    it("Should check if user has recap for specific day", async function () {
      const currentDay = Math.floor(await time.latest() / 86400);
      
      expect(await dailyRecap.hasRecapForDay(owner.address, currentDay))
        .to.be.true;
      
      expect(await dailyRecap.hasRecapForDay(addr1.address, currentDay))
        .to.be.false;
    });

    it("Should get recap hash for specific day", async function () {
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("Test recap"));
      const currentDay = Math.floor(await time.latest() / 86400);
      
      const storedHash = await dailyRecap.getRecapForDay(owner.address, currentDay);
      expect(storedHash).to.equal(contentHash);
    });

    it("Should check if user can submit today", async function () {
      expect(await dailyRecap.canSubmitToday(owner.address))
        .to.be.false;
      
      expect(await dailyRecap.canSubmitToday(addr1.address))
        .to.be.true;
    });

    it("Should get recap at specific index", async function () {
      const recap = await dailyRecap.getRecapAtIndex(0);
      expect(recap.user).to.equal(owner.address);
    });

    it("Should revert when getting recap at invalid index", async function () {
      await expect(dailyRecap.getRecapAtIndex(999))
        .to.be.revertedWith("Index out of bounds");
    });
  });

  describe("Get Latest Recaps", function () {
    beforeEach(async function () {
      // Submit 5 recaps from different users/times
      for (let i = 0; i < 5; i++) {
        const signer = [owner, addr1, addr2][i % 3];
        const contentHash = ethers.keccak256(
          ethers.toUtf8Bytes(`Recap ${i}`)
        );
        await dailyRecap.connect(signer).submitRecap(contentHash);
        
        if (i < 4) {
          await time.increase(86400); // Move forward 1 day
        }
      }
    });

    it("Should get latest recaps with pagination", async function () {
      const recaps = await dailyRecap.getLatestRecaps(0, 3);
      expect(recaps.length).to.equal(3);
      
      // Should be in reverse order (latest first)
      const latestRecap = recaps[0];
      expect(latestRecap.contentHash).to.equal(
        ethers.keccak256(ethers.toUtf8Bytes("Recap 4"))
      );
    });

    it("Should handle limit exceeding total recaps", async function () {
      const recaps = await dailyRecap.getLatestRecaps(0, 100);
      expect(recaps.length).to.equal(5);
    });

    it("Should revert on invalid offset", async function () {
      await expect(dailyRecap.getLatestRecaps(100, 10))
        .to.be.revertedWith("Offset out of bounds");
    });
  });
});
