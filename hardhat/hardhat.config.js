/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const INFURA_URL_RINKEBY =
  "https://rinkeby.infura.io/v3/82194ef4b66f42fea8a1d2fdeceff907";
const INFURA_URL_MAINNET =
  "https://mainnet.infura.io/v3/82194ef4b66f42fea8a1d2fdeceff907";
// Test net eth
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100000,
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        // Copy of main net
        url: INFURA_URL_MAINNET, // Could use Alchemy for hisotry
      },
      accounts: {
        privateKey: [`0x${PRIVATE_KEY}`],
        balance: "100000000000000000000",
      },
      gas: 12450000, // Maximum a contract can use
      gasPrice: 194071069761,
    },
    develop: {
      // Fresh local blockchain
      url: "127.0.0.1",
      accounts: [`0x${PRIVATE_KEY}`],
      port: 8545,
      network_id: "31337",
    },
    rinkeby: {
      // Test net
      url: INFURA_URL_RINKEBY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mainnet: {
      // Main net!!
      url: INFURA_URL_MAINNET,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
