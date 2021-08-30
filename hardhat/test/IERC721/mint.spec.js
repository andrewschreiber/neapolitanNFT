const {
  SALE_PRICE,
  PREFIX,
  INSUFFICIENT_FUNDS,
  ADDRESS_0,
  INITIAL_BASE_URI,
  INITIAL_BASE_URI_EXTENSION,
  NEAPOLITANS_FACTORY_NAME,
} = require("../utils/constants");

const { eth } = require("web3");
const { ethers } = require("hardhat");
const { describe, beforeEach, it } = require("mocha");
const { expect, assert } = require("chai");

describe("mint.spec.js", () => {
  let Neapolitans, neapolitans, owner, user1, user2, provider;
  let contractReadOnly, contractAsOwner, contractAsUser1, contractAsUser2;

  before(async () => {
    provider = await ethers.getDefaultProvider();
    [owner, user1, user2, _] = await ethers.getSigners();

    Neapolitans = await ethers.getContractFactory(NEAPOLITANS_FACTORY_NAME);
    neapolitans = await Neapolitans.deploy();

    contractReadOnly = neapolitans.connect(provider);
    contractAsOwner = neapolitans.connect(owner);
    contractAsUser1 = neapolitans.connect(user1);
    contractAsUser2 = neapolitans.connect(user2);
  });

  it("User1 successfully mints", async () => {
    await contractAsOwner.flipSaleState();
    await contractAsUser1.mintNeapolitan(1, {
      from: user1.address,
      value: ethers.utils.parseEther("0.01"),
    });
    const ownerNFTCount = await neapolitans.balanceOf(user1.address);
    console.log(`${ownerNFTCount}`);
    expect(`${ownerNFTCount}`).to.equal("1");
  });
});
