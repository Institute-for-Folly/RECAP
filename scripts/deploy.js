const hre = require("hardhat");

async function main() {
  console.log("Deploying DailyRecap contract...");

  const DailyRecap = await hre.ethers.getContractFactory("DailyRecap");
  const dailyRecap = await DailyRecap.deploy();

  await dailyRecap.waitForDeployment();

  const address = await dailyRecap.getAddress();
  console.log(`DailyRecap deployed to: ${address}`);
  
  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await dailyRecap.deploymentTransaction().wait(5);
  
  console.log("Deployment complete!");
  console.log(`\nTo verify the contract, run:`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
