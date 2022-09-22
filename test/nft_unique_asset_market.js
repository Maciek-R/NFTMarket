const NFTUniqueAssetMarket = artifacts.require("NFTUniqueAssetMarket");
const { ethers } = require("ethers");

contract("NFTUniqueAssetMarket", async accounts => {
  it("should 1", async () => {
    let instance = await NFTUniqueAssetMarket.new("Unique NFT Asset", "UNA", 100);


    let contractBalance = await instance.getContractBalance();
    assert.equal(contractBalance, 0);

    await instance.buyNft("tokenUri", {value: ethers.utils.parseEther("1"), from: accounts[1]});

    let contractBalanceAfter = await instance.getContractBalance();
    assert.equal(contractBalanceAfter.toString(), ethers.utils.parseEther("1"));

    let owner = await instance.ownerOf(1);
    assert.equal(owner, accounts[1]);
  });
});
