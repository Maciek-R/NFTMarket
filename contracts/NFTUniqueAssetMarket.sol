// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTUniqueAssetMarket {

    address payable public owner;
    address public nftContract;

    constructor(address nftUniqueAssetContract) payable {
        owner = payable(msg.sender);
        nftContract = nftUniqueAssetContract;
    }

    function buyNft(string memory tokenUri) public payable returns (bool) {
        require(msg.value > 1, string(abi.encodePacked("To buy Nft you should pay 1 ETH! You paid: ", msg.value)));
        require(msg.sender != owner, "Owner can't buy NFT");

        (bool success, bytes memory data) = nftContract.call{value: msg.value}(abi.encodeWithSignature("mint(address, string memory)", msg.sender, tokenUri));
        return success;
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
}
