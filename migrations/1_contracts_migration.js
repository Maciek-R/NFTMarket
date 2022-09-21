const NFTUniqueAsset = artifacts.require("NFTUniqueAsset");

module.exports = function(deployer) {
  deployer.deploy(NFTUniqueAsset, "Unique NFT Asset", "UNA");
};
