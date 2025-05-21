
import React from 'react';

interface AuctionPriceInfoProps {
  startingPrice: string;
  highestBid: string;
  highestBidder: string;
  isUserHighestBidder: boolean;
}

const AuctionPriceInfo = ({ startingPrice, highestBid, highestBidder, isUserHighestBidder }: AuctionPriceInfoProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
      <div className="border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">Starting Price</p>
        <p className="text-2xl font-bold">{startingPrice} ETH</p>
      </div>
      
      <div className="border rounded-lg p-4 bg-decentra-primary/5">
        <p className="text-sm text-muted-foreground">Current Highest Bid</p>
        <p className="text-2xl font-bold">
          {highestBid !== "0" ? `${highestBid} ETH` : "No bids yet"}
        </p>
        {highestBid !== "0" && (
          <p className="text-xs text-muted-foreground mt-1">
            By {isUserHighestBidder ? "You" : `${highestBidder.slice(0, 6)}...${highestBidder.slice(-4)}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuctionPriceInfo;
