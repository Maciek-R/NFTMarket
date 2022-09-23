const {expect} = require('chai');
const {ethers} = require("hardhat");
const {time} = require("@nomicfoundation/hardhat-network-helpers");
const {abi} = require('../artifacts/contracts/NFTUniqueAsset.sol/NFTUniqueAsset.json');

describe("NFTUniqueAssetMarket", async () => {
  it("should buy nft - increase contract balance and assign tokenId to caller", async () => {
    let marketInstance = await getNftUniqueAssetMarketInstance("Unique NFT Asset", "UNA", 100);
    const [_, signer1] = await ethers.getSigners();

    let marketBalance = await marketInstance.getContractBalance();
    expect(marketBalance).to.equal(0);

    await marketInstance.connect(signer1).buyNft("tokenUri", {value: ethers.utils.parseEther("1")});

    let marketBalanceAfterBuy = await marketInstance.getContractBalance();
    expect(marketBalanceAfterBuy.toString()).to.equal(ethers.utils.parseEther("1"));

    let ownerOfToken = await marketInstance.ownerOf(1);
    expect(ownerOfToken).to.equal(signer1.address);
  });

  it("should reject - not enough Ether send", async () => {
    let marketInstance = await getNftUniqueAssetMarketInstance("Unique NFT Asset", "UNA", 100);
    const [_, signer1] = await ethers.getSigners();

    let buyPromise = marketInstance.connect(signer1).buyNft("tokenUri", {value: ethers.utils.parseEther("0.5")});
    await expect(buyPromise).to.be.revertedWith("Not enough funds!");

    let marketBalance = await marketInstance.getContractBalance();
    expect(marketBalance).to.equal(0);
  });

  it("should buy and sell nft - sold Nft belong to contract", async () => {
    let marketInstance = await getNftUniqueAssetMarketInstance("Unique NFT Asset", "UNA", 100);
    let nftContractInstance = await getNftContractInstance(marketInstance);
    const [_, signer1] = await ethers.getSigners();

    let marketBalance = await marketInstance.getContractBalance();
    expect(marketBalance).to.equal(0);

    let buyResult = await marketInstance.connect(signer1).buyNft("tokenUri", {value: ethers.utils.parseEther("1")});
    await expect(buyResult).to.emit(marketInstance, "NftBought").withArgs(signer1.address, 1);

    let marketBalanceAfterBuy = await marketInstance.getContractBalance();
    expect(marketBalanceAfterBuy.toString()).to.equal(ethers.utils.parseEther("1"));

    let owner = await marketInstance.ownerOf(1);
    expect(owner).to.equal(signer1.address);

    await nftContractInstance.connect(signer1).approve(marketInstance.address, 1);

    let soldResult = await marketInstance.connect(signer1).sellNft(1);
    await expect(soldResult).to.emit(marketInstance, "NftSold").withArgs(signer1.address, 1);

    let marketBalanceAfterSelling = await marketInstance.getContractBalance();
    expect(marketBalanceAfterSelling).to.equal(0);

    let newOwner = await marketInstance.ownerOf(1);
    expect(newOwner).to.equal(marketInstance.address);
  });

  it("should buy nft for 2 eth after some time", async () => {
    let marketInstance = await getNftUniqueAssetMarketInstance("Unique NFT Asset", "UNA", 100);
    const [_, signer1] = await ethers.getSigners();

    await time.increase(time.duration.days(5));

    let buyPromise = marketInstance.connect(signer1).buyNft("tokenUri", {value: ethers.utils.parseEther("1")});
    await expect(buyPromise).to.be.revertedWith("Not enough funds!");

    await marketInstance.connect(signer1).buyNft("tokenUri", {value: ethers.utils.parseEther("2")})

    let marketBalanceAfterBuy = await marketInstance.getContractBalance();
    expect(marketBalanceAfterBuy.toString()).to.equal(ethers.utils.parseEther("2"));

    let owner = await marketInstance.ownerOf(1);
    expect(owner).to.equal(signer1.address);
  });


  it("should buy 2 tokens for 1 eth and after time sell 1 for 2 eth", async () => {
    let marketInstance = await getNftUniqueAssetMarketInstance("Unique NFT Asset", "UNA", 100);
    let nftContractInstance = await getNftContractInstance(marketInstance);
    const [_, signer1] = await ethers.getSigners();

    let marketBalance = await marketInstance.getContractBalance();
    expect(marketBalance).to.equal(0);

    await marketInstance.connect(signer1).buyNft("tokenUri1", {value: ethers.utils.parseEther("1")});
    await marketInstance.connect(signer1).buyNft("tokenUri2", {value: ethers.utils.parseEther("1")});

    let marketBalanceAfterBuy = await marketInstance.getContractBalance();
    expect(marketBalanceAfterBuy.toString()).to.equal(ethers.utils.parseEther("2"));

    let ownerOfToken1 = await marketInstance.ownerOf(1);
    let ownerOfToken2 = await marketInstance.ownerOf(2);
    expect(ownerOfToken1).to.equal(signer1.address);
    expect(ownerOfToken2).to.equal(signer1.address);

    await nftContractInstance.connect(signer1).approve(marketInstance.address, 1);
    await nftContractInstance.connect(signer1).approve(marketInstance.address, 2);

    await time.increase(time.duration.days(5));

    await marketInstance.connect(signer1).sellNft(1);

    let marketBalanceAfterSelling = await marketInstance.getContractBalance();
    expect(marketBalanceAfterSelling).to.equal(0);

    let newOwnerOfToken1 = await marketInstance.ownerOf(1);
    let newOwnerOfToken2 = await marketInstance.ownerOf(2);
    expect(newOwnerOfToken1).to.equal(marketInstance.address);
    expect(newOwnerOfToken2).to.equal(signer1.address);
  });

  async function getNftContractInstance(nftMarketInstance) {
    let nftContractAddress = await nftMarketInstance.getNftContractAddress();

    let provider = new ethers.providers.JsonRpcProvider();

    let signer = provider.getSigner(0);
    return new ethers.Contract(nftContractAddress, abi, signer);
  }

    async function getNftUniqueAssetMarketInstance(name, symbol, maxSupply) {
        const NFTUniqueAssetMarket = await ethers.getContractFactory("NFTUniqueAssetMarket");
        return await NFTUniqueAssetMarket.deploy(name, symbol, maxSupply);
    }
});
