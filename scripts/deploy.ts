import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const greeterFactory = await ethers.getContractFactory("Greeter");
  const greeter = await greeterFactory.deploy("Hello, aa!");
  console.log("Greeter contract address:", greeter.target);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
