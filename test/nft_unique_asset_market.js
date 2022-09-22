const NFTUniqueAsset = artifacts.require("NFTUniqueAsset");
const NFTUniqueAssetMarket = artifacts.require("NFTUniqueAssetMarket");
const { ethers } = require("ethers");

contract("NFTUniqueAssetMarket", async accounts => {
  it("should 1", async () => {
    let ins = await NFTUniqueAsset.new("name", "symbol", 1);
    let instance = await NFTUniqueAssetMarket.new(ins.address)

    let contractBalance = await instance.getContractBalance();
    assert.equal(contractBalance, 0);

    let result = await instance.buyNft("tokenUri", {value: ethers.utils.parseEther("1"), from: accounts[1]});

    let contractBalanceAfter = await instance.getContractBalance();
    assert.equal(contractBalanceAfter.toString(), ethers.utils.parseEther("1"));
    assert.equal(result.toString(), true);

    let counter = await ins.getTokenIdCounter();
    console.log(counter);
    assert.equal(counter, 1);
    let owner = await ins.ownerOf(1);

    console.log(owner);
    assert.equal(owner, accounts[1]);
  });
});
