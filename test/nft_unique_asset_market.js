const NFTUniqueAssetMarket = artifacts.require("NFTUniqueAssetMarket");
const { ethers } = require("ethers");

contract("NFTUniqueAssetMarket", async accounts => {
  it("should buy nft - increase contract balance and assign tokenId to caller", async () => {
    let instance = await NFTUniqueAssetMarket.new("Unique NFT Asset", "UNA", 100);


    let contractBalance = await instance.getContractBalance();
    assert.equal(contractBalance, 0);

    await instance.buyNft("tokenUri", {value: ethers.utils.parseEther("1"), from: accounts[1]});

    let contractBalanceAfter = await instance.getContractBalance();
    assert.equal(contractBalanceAfter.toString(), ethers.utils.parseEther("1"));

    let owner = await instance.ownerOf(1);
    assert.equal(owner, accounts[1]);
  });

  it("should reject - not enough Ether send", async () => {
    let instance = await NFTUniqueAssetMarket.new("Unique NFT Asset", "UNA", 100);

    let result = await instance.buyNft("tokenUri", {value: ethers.utils.parseEther("0.5"), from: accounts[1]}).should.be.rejected;
    let contractBalance = await instance.getContractBalance();
    assert.equal(contractBalance, 0);
    assert.equal(result.reason, "To buy Nft you should pay 1 ETH!");
  });
});
