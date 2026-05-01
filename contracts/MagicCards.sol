// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * MagicCards NFT Contract
 * This contract handles the minting and metadata storage for the MagicCards TCG.
 * It allows users to "open packs" to receive unique digital trading cards.
 */
contract MagicCards is ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    uint256 public constant MAX_SUPPLY = 20;

    // The IPFS Content Identifier for the folder containing card JSON metadata
    string public baseIPFSCID = "bafybeif6gyneb7bvpk6ivieb47lp7j4lnv5ixktbzg36w2zbxmgdhke5sy";

    /**
     * Initializes the contract with a name and a symbol.
     * initialOwner The wallet address that will have administrative rights.
     */
    constructor(address initialOwner) 
        ERC721("MagicCards", "MCARD") 
        Ownable(initialOwner) 
    {}

    /**
     * Mints a new trading card NFT to the caller. 
     * Constructs the IPFS metadata link automatically based on the current Token ID.
     * return the ID of the newly minted card.
     */
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

    /**
     * Returns the total number of cards currently minted.
     * Returns The current count of cards in circulation.
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * Allows the contract owner to update the IPFS folder location.
     * Use this if card artwork or metadata needs to be moved or updated.
     */
    function setBaseCID(string memory newCID) public onlyOwner {
        baseIPFSCID = newCID;
    }
}