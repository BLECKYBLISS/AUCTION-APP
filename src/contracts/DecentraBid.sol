
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title DecentraBid
 * @dev Implements an auction system where users can create, bid on, and finalize auctions
 */
contract DecentraBid {
    // Struct to represent an auction
    struct Auction {
        uint256 id;
        address payable seller;
        string title;
        string description;
        string imageUrl;
        uint256 startingPrice;
        uint256 highestBid;
        address payable highestBidder;
        uint256 endTime;
        bool ended;
        bool exists;
    }

    // State variables
    uint256 public auctionCounter;
    mapping(uint256 => Auction) public auctions;
    mapping(address => mapping(uint256 => uint256)) public pendingReturns; // Tracks refundable bids

    // Events for frontend updates
    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed seller,
        string title,
        uint256 startingPrice,
        uint256 endTime
    );
    
    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );
    
    event AuctionEnded(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 amount
    );

    /**
     * @dev Creates a new auction
     * @param _title Title of the item being auctioned
     * @param _description Description of the item
     * @param _imageUrl URL to the image of the item (IPFS recommended)
     * @param _startingPrice Minimum bid amount in wei
     * @param _durationHours Duration of auction in hours
     */
    function createAuction(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        uint256 _startingPrice,
        uint256 _durationHours
    ) public {
        require(_startingPrice > 0, "Starting price must be greater than zero");
        require(_durationHours > 0, "Duration must be greater than zero");
        
        uint256 auctionId = auctionCounter++;
        
        auctions[auctionId] = Auction({
            id: auctionId,
            seller: payable(msg.sender),
            title: _title,
            description: _description,
            imageUrl: _imageUrl,
            startingPrice: _startingPrice,
            highestBid: 0,
            highestBidder: payable(address(0)),
            endTime: block.timestamp + (_durationHours * 1 hours),
            ended: false,
            exists: true
        });
        
        emit AuctionCreated(auctionId, msg.sender, _title, _startingPrice, block.timestamp + (_durationHours * 1 hours));
    }

    /**
     * @dev Place a bid on an auction
     * @param _auctionId ID of the auction to bid on
     */
    function placeBid(uint256 _auctionId) public payable {
        Auction storage auction = auctions[_auctionId];
        
        require(auction.exists, "Auction does not exist");
        require(!auction.ended, "Auction already ended");
        require(block.timestamp < auction.endTime, "Auction already ended");
        require(msg.sender != auction.seller, "Seller cannot bid on own auction");
        
        uint256 bidAmount = msg.value;
        
        if (auction.highestBid == 0) {
            // First bid must be at least the starting price
            require(bidAmount >= auction.startingPrice, "Bid must be at least the starting price");
        } else {
            // Subsequent bids must be higher than the current highest bid
            require(bidAmount > auction.highestBid, "Bid must be higher than current highest bid");
            
            // Refund the previous highest bidder
            pendingReturns[auction.highestBidder][_auctionId] += auction.highestBid;
        }
        
        // Update highest bid info
        auction.highestBid = bidAmount;
        auction.highestBidder = payable(msg.sender);
        
        emit BidPlaced(_auctionId, msg.sender, bidAmount);
    }

    /**
     * @dev End an auction and send highest bid to seller
     * @param _auctionId ID of the auction to end
     */
    function endAuction(uint256 _auctionId) public {
        Auction storage auction = auctions[_auctionId];
        
        require(auction.exists, "Auction does not exist");
        require(!auction.ended, "Auction already ended");
        require(
            msg.sender == auction.seller || block.timestamp >= auction.endTime, 
            "Only seller can end auction before end time"
        );
        
        auction.ended = true;
        
        if (auction.highestBidder != address(0)) {
            // Transfer funds to seller if there was at least one bid
            auction.seller.transfer(auction.highestBid);
            emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
        } else {
            emit AuctionEnded(_auctionId, address(0), 0);
        }
    }

    /**
     * @dev Allow users to withdraw their refunded bids
     * @param _auctionId ID of the auction to withdraw from
     */
    function withdrawBid(uint256 _auctionId) public {
        uint256 amount = pendingReturns[msg.sender][_auctionId];
        
        require(amount > 0, "No funds to withdraw");
        
        // Zero the pending refund before sending to prevent re-entrancy attacks
        pendingReturns[msg.sender][_auctionId] = 0;
        
        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Get auction details
     * @param _auctionId ID of the auction
     */
    function getAuction(uint256 _auctionId) public view returns (
        uint256 id,
        address seller,
        string memory title,
        string memory description,
        string memory imageUrl,
        uint256 startingPrice,
        uint256 highestBid,
        address highestBidder,
        uint256 endTime,
        bool ended
    ) {
        require(auctions[_auctionId].exists, "Auction does not exist");
        
        Auction memory auction = auctions[_auctionId];
        
        return (
            auction.id,
            auction.seller,
            auction.title,
            auction.description,
            auction.imageUrl,
            auction.startingPrice,
            auction.highestBid,
            auction.highestBidder,
            auction.endTime,
            auction.ended
        );
    }

    /**
     * @dev Get total number of auctions created
     */
    function getAuctionCount() public view returns (uint256) {
        return auctionCounter;
    }

    /**
     * @dev Check if a user has a pending refund for an auction
     * @param _user Address of the user
     * @param _auctionId ID of the auction
     */
    function getPendingReturn(address _user, uint256 _auctionId) public view returns (uint256) {
        return pendingReturns[_user][_auctionId];
    }
}
