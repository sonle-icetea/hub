// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

/**
 * @title Interface for Marketplace
 */
interface IMarketplace {
    struct EIP712Signature {
        uint256 deadline;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    struct Auction {
        // ID for the ERC721 token
        uint256 tokenId;
        // Address for the ERC721 contract
        address tokenContract;
        // The time auction End
        uint256 endTime;
        // The minimum price of the first bid
        uint256 reservePrice;
        // The address that should receive the funds once the NFT is sold.
        address tokenOwner;
        // The address of the current highest bid
        address bidder;
        // The current highest bid amount
        uint256 amount;
        // The address of the ERC-20 currency to run the auction with.
        // If set to 0x0, the auction will be run in ETH
        address auctionCurrency;
    }

    struct Offer {
        // The offer currency
        address currency;
        // The offer amount
        uint256 amount;
    }

    struct ListingToken {
        // The address of the seller
        address tokenOwner;
        // The listing currency
        address currency;
        // The listing price
        uint256 price;
    }

    event AuctionCreated(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        uint256 duration,
        uint256 reservePrice,
        address tokenOwner,
        address auctionCurrency
    );

    event AuctionApprovalUpdated(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        bool approved
    );

    event AuctionReservePriceUpdated(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        uint256 reservePrice
    );

    event AuctionBid(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        address sender,
        uint256 value,
        bool firstBid
    );

    event AuctionBidCanceled(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        address sender,
        uint256 value
    );

    event AuctionDurationExtended(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        uint256 duration
    );

    event AuctionEnded(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        address tokenOwner,
        address winner,
        uint256 amount,
        address auctionCurrency
    );

    event AuctionCanceled(
        uint256 indexed auctionId,
        uint256 indexed tokenId,
        address indexed tokenContract,
        address tokenOwner
    );

    event TokenListed(
        address indexed tokenContract, 
        uint256 indexed tokenId, 
        address tokenOwner,
        address currency, 
        uint256 price
    );

    event TokenDelisted(
        address indexed tokenContract, 
        uint256 indexed tokenId, 
        address tokenOwner
    );

    event TokenBought(
        address indexed tokenContract, 
        uint256 indexed tokenId,
        address buyer,
        address seller,
        address currency,
        uint256 price
    );

    event TokenOffered(
        address indexed tokenContract, 
        uint256 indexed tokenId,
        address buyer,
        address currency, 
        uint256 amount
    );

    event TokenOfferCanceled(
        address indexed tokenContract, 
        uint256 indexed tokenId,
        address buyer
    );

    function createAuction(
        uint256 tokenId,
        address tokenContract,
        uint256 duration,
        uint256 reservePrice,
        address auctionCurrency
    ) external returns (uint256);

    function createBid(uint256 auctionId, uint256 amount) external payable;

    function endAuction(uint256 auctionId) external;

    function cancelAuction(uint256 auctionId) external;
}
