/**
 * How to deploy:
 * npx hardhat run scripts/deployRinkeby.js --network rinkeby
 * */

const fs = require("fs");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  const Neapolitans = await ethers.getContractFactory(
    "contracts/Neapolitans.sol:Neapolitans"
  );
  const neapolitans = await Neapolitans.deploy();

  console.log(`Neapolitan address: ${neapolitans.address}`);

  const data = {
    address: neapolitans.address,
    abi: JSON.parse(neapolitans.interface.format("json")),
  };
  console.log(JSON.stringify(data));

  fs.writeFileSync("../NeapolitanRinkeby.json", JSON.stringify(data));
  const gasCost = await deployer.getBalance();
  console.log("Gas Cost:", balance - gasCost);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
