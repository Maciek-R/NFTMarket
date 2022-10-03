require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy');
require("@nomiclabs/hardhat-etherscan");
require("./env");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      }
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545"
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_RINKEBY_KEY,
      chainId: 4,
      accounts: [process.env.RINKEBY_PRIVATE_KEY]
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  etherscan: {
    // apiKey: process.env.ETHERSCAN_API_KEY
    apiKey: {
      rinkeby: process.env.ETHERSCAN_RINKEBY_API_KEY
    }
  }
};