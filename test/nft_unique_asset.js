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

    let tokenId = 123;
    let tokenUri = "tokenUri";
    let tokenRecipient = "0xEea01CAc2C7861d3C656B5f30934CA353C6f8604"
    await instance.mint(tokenRecipient, tokenId, tokenUri);

    let retrievedOwner = await instance.ownerOf(tokenId);
    assert.equal(retrievedOwner, tokenRecipient);

    let retrievedTokenUri = await instance.tokenURI(tokenId);
    assert.equal(retrievedTokenUri, tokenUri);
  });

  it("should increase tokenIdCounter each time 'awardItem' is called and decrease nftTotalBalance", async () => {
    let instance = await NFTUniqueAsset.deployed();

    let tokenUri = "tokenUri";
    let tokenRecipient = "0xEea01CAc2C7861d3C656B5f30934CA353C6f8604"

    await instance.awardItem(tokenRecipient, tokenUri);
    assert.equal(await instance.getTokenIdCounter(), 1);

    await instance.awardItem(tokenRecipient, tokenUri);
    assert.equal(await instance.getTokenIdCounter(), 2);

    await instance.awardItem(tokenRecipient, tokenUri);
    assert.equal(await instance.getTokenIdCounter(), 3);

    let nftTotalBalance = await instance.getNftTotalBalance();
    assert.equal(nftTotalBalance, 97);
  });

  it("should reject awarding when ntfTotalBalance has been depleted", async () => {
    let instance = await NFTUniqueAsset.new("name", "symbol", 1, 1);

    let tokenUri = "tokenUri";
    let tokenRecipient = "0xEea01CAc2C7861d3C656B5f30934CA353C6f8604"

    await instance.awardItem(tokenRecipient, tokenUri);

    let result = await instance.awardItem(tokenRecipient, tokenUri).should.be.rejected;
    assert.equal(result.reason, "nftTotalBalance has been depleted");
  });
});
