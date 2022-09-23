const NFTUniqueAssetMarket = artifacts.require("NFTUniqueAssetMarket");
const { ethers } = require("ethers");
const NFTUniqueAsset = artifacts.require("NFTUniqueAsset");

var fs = require('fs');
const ABI_PATH = 'build/contracts/NFTUniqueAsset.json';
const fsPromises = fs.promises;

contract("NFTUniqueAssetMarket", async accounts => {
  it("should buy nft - increase contract balance and assign tokenId to caller", async () => {
    let marketInstance = await NFTUniqueAssetMarket.new("Unique NFT Asset", "UNA", 100);

    let marketBalance = await marketInstance.getContractBalance();
    assert.equal(marketBalance, 0);

    await marketInstance.buyNft("tokenUri", {value: ethers.utils.parseEther("1"), from: accounts[1]});

    let marketBalanceAfterBuy = await marketInstance.getContractBalance();
    assert.equal(marketBalanceAfterBuy.toString(), ethers.utils.parseEther("1"));

    let owner = await marketInstance.ownerOf(1);
    assert.equal(owner, accounts[1]);
  });

  it("should reject - not enough Ether send", async () => {
    let instance = await NFTUniqueAssetMarket.new("Unique NFT Asset", "UNA", 100);

    let result = await instance.buyNft("tokenUri", {value: ethers.utils.parseEther("0.5"), from: accounts[1]}).should.be.rejected;
    let marketBalance = await instance.getContractBalance();

    assert.equal(marketBalance, 0);
    assert.equal(result.reason, "To buy Nft you should pay 1 ETH!");
  });

  it("should buy and sell nft - sold Nft belong to contract", async () => {
    let marketInstance = await NFTUniqueAssetMarket.new("Unique NFT Asset", "UNA", 100);
    let nftContractInstance = await getNftContractInstance(marketInstance, 1);

    let marketBalance = await marketInstance.getContractBalance();
    assert.equal(marketBalance, 0);

    await marketInstance.buyNft("tokenUri", {value: ethers.utils.parseEther("1"), from: accounts[1]});

    let marketBalanceAfterBuy = await marketInstance.getContractBalance();
    assert.equal(marketBalanceAfterBuy.toString(), ethers.utils.parseEther("1"));

    let owner = await marketInstance.ownerOf(1);
    assert.equal(owner, accounts[1]);

    await nftContractInstance.approve(marketInstance.address, 1);

    await marketInstance.sellNft(1, {from: accounts[1]});

    let marketBalanceAfterSelling = await marketInstance.getContractBalance();
    assert.equal(marketBalanceAfterSelling, 0);

    let newOwner = await marketInstance.ownerOf(1);
    assert.equal(newOwner, marketInstance.address);
  });

  async function getAbi() {
    const data = await fsPromises.readFile(ABI_PATH, 'utf8');
    return JSON.parse(data)['abi'];
  }

  async function getNftContractInstance(nftMarketInstance, asAccountNumber) {
    let nftContractAddress = await nftMarketInstance.getNftContractAddress();

    let provider = new ethers.providers.JsonRpcProvider();
    // const abi = NFTUniqueAsset._json.abi; //both abi works
    const abi = await getAbi();

    let signer = provider.getSigner(asAccountNumber);
    return new ethers.Contract(nftContractAddress, abi, signer);
  }
});
