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
  let Neapolitans, neapolitans, owner, caleb, andrew, provider;
  let contractReadOnly, contractAsOwner, contractAsCaleb, contractAsAndrew;

  before(async () => {
    provider = await ethers.getDefaultProvider();
    [owner, caleb, andrew, _] = await ethers.getSigners();

    Neapolitans = await ethers.getContractFactory(NEAPOLITANS_FACTORY_NAME);
    neapolitans = await Neapolitans.deploy();

    contractReadOnly = neapolitans.connect(provider);
    contractAsOwner = neapolitans.connect(owner);
    contractAsCaleb = neapolitans.connect(caleb);
    contractAsAndrew = neapolitans.connect(andrew);
  });

  it("Caleb successfully mints", async () => {
    await contractAsOwner.flipSaleState();
    await neapolitans.mintNeapolitan(1, {
      from: caleb.address,
      value: ethers.utils.parseEther("0.01"),
    });
    const ownerNFTCount = await neapolitans.balanceOf(caleb.address);
    console.log(`${ownerNFTCount}`);
    expect(`${ownerNFTCount}`).to.equal("1");
    // const tokenId = await contractAsOwner.tokenOfOwnerByIndex(caleb.address, 0);
    // await contractAsCaleb.approve(andrew.address, tokenId);
    // const getApproved = await contractAsCaleb.getApproved(tokenId);
    // expect(getApproved).to.equal(andrew.address);
  });
});
