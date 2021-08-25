const { eth } = require("web3");
const { ethers } = require("hardhat");

const SALE_PRICE = ethers.utils.parseEther("0.01");
const PREFIX = "VM Exception while processing transaction: ";
const INSUFFICIENT_FUNDS = "insufficient funds for intrinsic transaction cost";
const ADDRESS_0 = "0x0000000000000000000000000000000000000000";
const INITIAL_BASE_URI = "https://meebits.larvalabs.com/meebit/";
const INITIAL_BASE_URI_EXTENSION = ".json";
const NEAPOLITANS_FACTORY_NAME = "contracts/Neapolitans.sol:Neapolitans";
("contracts/GetBlockTimeForTesting.sol:GetBlockTimeForTesting");

module.exports = {
  SALE_PRICE,
  PREFIX,
  INSUFFICIENT_FUNDS,
  ADDRESS_0,
  INITIAL_BASE_URI,
  INITIAL_BASE_URI_EXTENSION,
  NEAPOLITANS_FACTORY_NAME,
};
