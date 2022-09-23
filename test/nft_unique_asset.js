const {expect} = require('chai');
const {ethers} = require("hardhat");

describe("NFTUniqueAsset", async () => {
  it("should create nft with name and symbol", async () => {
    let instance = await getNftUniqueAssetInstance("Unique NFT Asset", "UNA", 100);

    let name = await instance.name();
    let symbol = await instance.symbol();

    expect(name).to.equal("Unique NFT Asset");
    expect(symbol).to.equal("UNA");
  });

  it("should mint - assign tokenUri and address to given tokenId", async () => {
    let instance = await getNftUniqueAssetInstance("name", "symbol", 100);

    let tokenUri = "tokenUri";
    let tokenRecipient = "0xEea01CAc2C7861d3C656B5f30934CA353C6f8604"
    await instance.mint(tokenRecipient, tokenUri);

    let retrievedOwner = await instance.ownerOf(1);
    expect(retrievedOwner).to.equal(tokenRecipient);

    let retrievedTokenUri = await instance.tokenURI(1);
    expect(retrievedTokenUri).to.equal(tokenUri);
  });

  it("should increase tokenIdCounter each time 'mint' is called and decrease nftCurrentSupply", async () => {
    let instance = await getNftUniqueAssetInstance("name", "symbol", 100);

    let tokenUri = "tokenUri";
    let tokenRecipient = "0xEea01CAc2C7861d3C656B5f30934CA353C6f8604"

    await instance.mint(tokenRecipient, tokenUri);
    expect(await instance.getTokenIdCounter()).to.equal(1);

    await instance.mint(tokenRecipient, tokenUri);
    expect(await instance.getTokenIdCounter()).to.equal(2);

    await instance.mint(tokenRecipient, tokenUri);
    expect(await instance.getTokenIdCounter()).to.equal(3);

    let nftTotalBalance = await instance.getNftCurrentSupply();
    expect(nftTotalBalance).to.equal(97);
  });

  it("should reject awarding when nftMaxSupply has been reached", async () => {
    let instance = await getNftUniqueAssetInstance("name", "symbol", 1);

    let tokenUri = "tokenUri";
    let tokenRecipient = "0xEea01CAc2C7861d3C656B5f30934CA353C6f8604"

    await instance.mint(tokenRecipient, tokenUri);

    let mintingPromise = instance.mint(tokenRecipient, tokenUri);
    await expect(mintingPromise).to.be.revertedWith("NftMaxSupply has been reached");
  });

  async function getNftUniqueAssetInstance(name, symbol, maxSupply) {
    const NFTUniqueAsset = await ethers.getContractFactory("NFTUniqueAsset");
    return await NFTUniqueAsset.deploy(name, symbol, maxSupply);
  }
});
