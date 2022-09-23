const NFTUniqueAssetMarket = artifacts.require("NFTUniqueAssetMarket");
const { ethers } = require("ethers");
const NFTUniqueAsset = artifacts.require("NFTUniqueAsset");
const { time } = require('@openzeppelin/test-helpers');

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
    assert.equal(result.reason, "Not enough funds!");
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

  it("should buy nft for 2 eth after some time", async () => {
    let marketInstance = await NFTUniqueAssetMarket.new("Unique NFT Asset", "UNA", 100);

    await time.increase(time.duration.days(6));

    let result = await marketInstance.buyNft("tokenUri", {value: ethers.utils.parseEther("1"), from: accounts[1]}).should.be.rejected;
    assert.equal(result.reason, "Not enough funds!");

    await marketInstance.buyNft("tokenUri", {value: ethers.utils.parseEther("2"), from: accounts[1]})

    let marketBalanceAfterBuy = await marketInstance.getContractBalance();
    assert.equal(marketBalanceAfterBuy.toString(), ethers.utils.parseEther("2"));

    let owner = await marketInstance.ownerOf(1);
    assert.equal(owner, accounts[1]);
  });


  it("should buy 2 tokens for 1 eth and after time sell 1 for 2 eth", async () => {
    let marketInstance = await NFTUniqueAssetMarket.new("Unique NFT Asset", "UNA", 100);
    let nftContractInstance = await getNftContractInstance(marketInstance, 1);

    let marketBalance = await marketInstance.getContractBalance();
    assert.equal(marketBalance, 0);

    await marketInstance.buyNft("tokenUri1", {value: ethers.utils.parseEther("1"), from: accounts[1]});
    await marketInstance.buyNft("tokenUri2", {value: ethers.utils.parseEther("1"), from: accounts[1]});

    let marketBalanceAfterBuy = await marketInstance.getContractBalance();
    assert.equal(marketBalanceAfterBuy.toString(), ethers.utils.parseEther("2"));

    let ownerOfToken1 = await marketInstance.ownerOf(1);
    let ownerOfToken2 = await marketInstance.ownerOf(2);
    assert.equal(ownerOfToken1, accounts[1]);
    assert.equal(ownerOfToken2, accounts[1]);

    await nftContractInstance.approve(marketInstance.address, 1);
    await nftContractInstance.approve(marketInstance.address, 2);

    await time.increase(time.duration.days(6));

    await marketInstance.sellNft(1, {from: accounts[1]});

    let marketBalanceAfterSelling = await marketInstance.getContractBalance();
    assert.equal(marketBalanceAfterSelling, 0);

    let newOwnerOfToken1 = await marketInstance.ownerOf(1);
    let newOwnerOfToken2 = await marketInstance.ownerOf(2);
    assert.equal(newOwnerOfToken1, marketInstance.address);
    assert.equal(newOwnerOfToken2, accounts[1]);
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
