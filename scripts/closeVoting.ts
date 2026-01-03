import hre from "hardhat";

async function closeVoting() {
  // Get the deployed contract address
  const contractAddress = "0x5E95A1e4922Eeccc5B76cdFB0c59aad77fCd1d40";
  
  // Get the Voting contract
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = Voting.attach(contractAddress);
  
  console.log("Attempting to close voting...");
  console.log("Contract address:", contractAddress);
  
  // Get the signer (admin)
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);
  
  // Check if this account is the admin
  const admin = await voting.admin();
  console.log("Contract admin:", admin);
  console.log("Is deployer the admin?", deployer.address.toLowerCase() === admin.toLowerCase());
  
  // Close voting
  const tx = await voting.closeVoting();
  console.log("Transaction sent:", tx.hash);
  
  // Wait for confirmation
  await tx.wait();
  console.log("Voting closed successfully!");
  
  // Verify the status
  const votingActive = await voting.votingActive();
  console.log("Voting active:", votingActive);
}

closeVoting().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});