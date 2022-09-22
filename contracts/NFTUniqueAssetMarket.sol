// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTUniqueAsset.sol";

contract NFTUniqueAssetMarket {

    address payable public owner;
    NFTUniqueAsset nftContract;

    constructor(string memory name, string memory symbol, uint256 maxSupply) payable {
        NFTUniqueAsset nftUniqueAssetContract = new NFTUniqueAsset(name, symbol, maxSupply);
        owner = payable(msg.sender);
        nftContract = nftUniqueAssetContract;
    }

    function buyNft(string memory tokenUri) public payable {
        require(msg.value >= 1 ether, "To buy Nft you should pay 1 ETH!");
        require(msg.sender != owner, "Owner can't buy NFT");

        nftContract.mint(msg.sender, tokenUri);
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function sellNft() public {
        require(address(this).balance >= 1, "Contract does not have enough ETH!");
        // unmint
        address payable sender = payable(msg.sender);
        sender.transfer(1);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return nftContract.ownerOf(tokenId);
    }
}
