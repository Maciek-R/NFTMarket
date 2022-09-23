// require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-waffle");
// require('hardhat-deploy');
// require("dotenv").config()
// require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      }
    ],
  },
  // namedAccounts: {
  //   deployer: {
  //     default: 0,
  //   },
  //   feeCollector: {
  //     default: 0,
  //   },
  // },
  // networks: {
    // localhost: {
    //   accounts: [process.env.PRIVATE_KEY]
    // },
    // matic: {
    //   url: "https://rpc-mainnet.maticvigil.com/v1/" + process.env.RPC_APP_ID,
    //   accounts: [process.env.MATIC_PRIVATE_KEY]
    // },
    // boba: {
    //   url: "https://mainnet.boba.network/",
    //   chainId: 288,
    //   accounts: [process.env.BOBA_PRIVATE_KEY]
    // },
    // mumbai: {
    //   url: "https://matic-mumbai.chainstacklabs.com/",
    //   chainId: 80001,
    //   accounts: [process.env.MUMBAI_PRIVATE_KEY]
    // }
  // },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  // etherscan: {
    // apiKey: process.env.ETHERSCAN_API_KEY
  // },
  // paths: {
  //   sources: "./contracts",
  //   artifacts: "./artifacts"
  // }
};