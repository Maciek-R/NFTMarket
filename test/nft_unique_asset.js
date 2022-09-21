const NFTUniqueAsset = artifacts.require("NFTUniqueAsset");

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
});
