const NFTUniqueAsset = artifacts.require("NFTUniqueAsset");
const NFTUniqueAssetMarket = artifacts.require("NFTUniqueAssetMarket");

module.exports = function(deployer) {
  deployer.deploy(NFTUniqueAssetMarket, NFTUniqueAsset.address);
};
