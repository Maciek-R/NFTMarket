const NFTUniqueAssetMarket = artifacts.require("NFTUniqueAssetMarket");

module.exports = function(deployer) {
  deployer.deploy(NFTUniqueAssetMarket, "Unique NFT Asset", "UNA", 100);
};
