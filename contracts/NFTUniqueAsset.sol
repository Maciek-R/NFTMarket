// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTUniqueAsset is ERC721, Ownable {

   using Strings for uint256;

   using Counters for Counters.Counter;
   Counters.Counter private tokenIdCounter;
   mapping (uint256 => string) private _tokenURIs;
   string private _baseURIextended;

   uint256 private nftMaxSupply;
   uint256 private nftCurrentSupply;
   uint public contractCreatedTimestamp;

   constructor(string memory name, string memory symbol, uint256 maxSupply) ERC721(name, symbol) {
      nftMaxSupply = maxSupply;
      nftCurrentSupply = nftMaxSupply;
      contractCreatedTimestamp = block.timestamp;
   }

   function setBaseURI(string memory baseURI_) external onlyOwner() {
      _baseURIextended = baseURI_;
   }

   function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
      require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
      _tokenURIs[tokenId] = _tokenURI;
   }

   function _baseURI() internal view virtual override returns (string memory) {
      return _baseURIextended;
   }

   function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
      require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

      string memory _tokenURI = _tokenURIs[tokenId];
      string memory base = _baseURI();

      // If there is no base URI, return the token URI.
      if (bytes(base).length == 0) {
         return _tokenURI;
      }
      // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
      if (bytes(_tokenURI).length > 0) {
         return string(abi.encodePacked(base, _tokenURI));
      }
      // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
      return string(abi.encodePacked(base, tokenId.toString()));
   }

   function mint(address to, string memory tokenUri) onlyOwner() public returns (uint256){
      require(nftCurrentSupply > 0, "NftMaxSupply has been reached");
      //TODO 5 days for minting;
      nftCurrentSupply -= 1;
      tokenIdCounter.increment();
      uint256 tokenId = tokenIdCounter.current();
      _mint(to, tokenId);
      _setTokenURI(tokenId, tokenUri);
      return tokenId;
   }

   function getTokenIdCounter() public view returns (uint256) {
      return tokenIdCounter.current();
   }

   function getNftCurrentSupply() public view returns (uint256) {
      return nftCurrentSupply;
   }
}
