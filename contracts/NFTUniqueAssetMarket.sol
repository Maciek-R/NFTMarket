// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTUniqueAsset.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTUniqueAssetMarket is IERC721Receiver {

    NFTUniqueAsset nftContract;

    event NftBought();
    event NftSold();

    constructor(string memory name, string memory symbol, uint256 maxSupply) payable {
        NFTUniqueAsset nftUniqueAssetContract = new NFTUniqueAsset(name, symbol, maxSupply);
        nftContract = nftUniqueAssetContract;
    }

    function buyNft(string memory tokenUri) public payable {
        require(msg.value >= 1 ether, "To buy Nft you should pay 1 ETH!");

        nftContract.mint(msg.sender, tokenUri);
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }


    function sellNft(uint256 tokenId) public {
        require(address(this).balance >= 1 ether, "Contract does not have enough ETH!");

        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);
        address payable sender = payable(msg.sender);
        sender.transfer(1 ether);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return nftContract.ownerOf(tokenId);
    }

    function getNftContractAddress() public view returns (address) {
        return address(nftContract);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
