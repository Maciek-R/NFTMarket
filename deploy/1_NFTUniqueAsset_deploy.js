const {network, ethers} = require("hardhat")

const tokenName = "Unique NFT Asset";
const tokenSymbol = "UNA";
const tokenMaxSupply = 100;

module.exports = async ({deployments}) => {
  const {log} = deployments
  let nftUniqueAssetMarket;
  log("Deploying NFTUniqueAssetMarket")
  if (network.name === "localhost" || network.name === "rinkeby") {
    const NftUniqueAssetMarket = await ethers.getContractFactory("NFTUniqueAssetMarket");
    nftUniqueAssetMarket = await NftUniqueAssetMarket.deploy(tokenName, tokenSymbol, tokenMaxSupply);
  } else {
    throw new Error("Cannot deploy NFTUniqueAssetMarket - unsupported network")
  }

  const nftUniqueAssetAddress = await nftUniqueAssetMarket.getNftContractAddress();
  log("NFTUniqueAssetMarket:");
  log("npx hardhat verify --network " + network.name + " " + nftUniqueAssetMarket.address + " '" + tokenName +  "' " + tokenSymbol + " " + tokenMaxSupply)
  log("NFTUniqueAsset:");
  log("npx hardhat verify --network " + network.name + " " + nftUniqueAssetAddress + " '" + tokenName +  "' " + tokenSymbol + " " + tokenMaxSupply)
}
