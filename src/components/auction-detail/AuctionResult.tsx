
import React from 'react';

interface AuctionResultProps {
  highestBid: string;
  highestBidder: string;
  isUserHighestBidder: boolean;
}

const AuctionResult = ({ highestBid, highestBidder, isUserHighestBidder }: AuctionResultProps) => {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="font-medium mb-2">Auction Result</h3>
      {highestBid !== "0" ? (
        <p>
          This auction was won by{" "}
          <span className="font-medium">
            {isUserHighestBidder ? "you" : `${highestBidder.slice(0, 6)}...${highestBidder.slice(-4)}`}
          </span>{" "}
          for <span className="font-medium">{highestBid} ETH</span>.
        </p>
      ) : (
        <p>This auction ended with no bids.</p>
      )}
    </div>
  );
};

export default AuctionResult;
