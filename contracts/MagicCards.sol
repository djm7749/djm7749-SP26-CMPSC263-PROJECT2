// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MagicCards is ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    uint256 public constant MAX_SUPPLY = 20;

    string public baseIPFSCID = "bafybeif6gyneb7bvpk6ivieb47lp7j4lnv5ixktbzg36w2zbxmgdhke5sy";

    constructor(address initialOwner) 
        ERC721("MagicCards", "MCARD") 
        Ownable(initialOwner) 
    {}

    function openPack() public returns (uint256) {
        require(_nextTokenId < MAX_SUPPLY, "All card packs have been opened!");
        
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, tokenId);

        // Construct link: ipfs://CID/tokenId.json
        string memory tokenURI = string(
            abi.encodePacked("ipfs://", baseIPFSCID, "/", tokenId.toString(), ".json")
        );
        
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }


    function setBaseCID(string memory newCID) public onlyOwner {
        baseIPFSCID = newCID;
    }
}