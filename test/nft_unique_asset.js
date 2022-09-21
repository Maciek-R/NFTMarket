const NFTUniqueAsset = artifacts.require("NFTUniqueAsset");
require('chai').use(require('chai-as-promised')).should();

contract("NFTUniqueAsset", async accounts => {
  it("should create nft with name and symbol", async () => {
    let instance = await NFTUniqueAsset.deployed();

    let name = await instance.name();
    let symbol = await instance.symbol();

    assert.equal(name, "Unique NFT Asset");
    assert.equal(symbol, "UNA");
  });

  it("should mint - assign tokenUri and address to given tokenId", async () => {
    let instance = await NFTUniqueAsset.deployed();

    let tokenUri = "tokenUri";
    let tokenRecipient = "0xEea01CAc2C7861d3C656B5f30934CA353C6f8604"
    await instance.mint(tokenRecipient, tokenUri);

    let retrievedOwner = await instance.ownerOf(1);
    assert.equal(retrievedOwner, tokenRecipient);

    let retrievedTokenUri = await instance.tokenURI(1);
    assert.equal(retrievedTokenUri, tokenUri);
  });

  it("should increase tokenIdCounter each time 'mint' is called and decrease nftCurrentSupply", async () => {
    let instance = await NFTUniqueAsset.new("name", "symbol", 100);

    let tokenUri = "tokenUri";
    let tokenRecipient = "0xEea01CAc2C7861d3C656B5f30934CA353C6f8604"

    await instance.mint(tokenRecipient, tokenUri);
    assert.equal(await instance.getTokenIdCounter(), 1);

    await instance.mint(tokenRecipient, tokenUri);
    assert.equal(await instance.getTokenIdCounter(), 2);

    await instance.mint(tokenRecipient, tokenUri);
    assert.equal(await instance.getTokenIdCounter(), 3);

    let nftTotalBalance = await instance.getNftCurrentSupply();
    assert.equal(nftTotalBalance, 97);
  });

  it("should reject awarding when nftMaxSupply has been reached", async () => {
    let instance = await NFTUniqueAsset.new("name", "symbol", 1);

    let tokenUri = "tokenUri";
    let tokenRecipient = "0xEea01CAc2C7861d3C656B5f30934CA353C6f8604"

    await instance.mint(tokenRecipient, tokenUri);

    let result = await instance.mint(tokenRecipient, tokenUri).should.be.rejected;
    assert.equal(result.reason, "NftMaxSupply has been reached");
  });
});
