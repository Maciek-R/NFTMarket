const NFTUniqueAssetMarket = artifacts.require("NFTUniqueAssetMarket");

//TODO update to use hardhat
module.exports = function(deployer) {
  deployer.deploy(NFTUniqueAssetMarket, "Unique NFT Asset", "UNA", 100);
};
