
import React from 'react';
import { Button } from "@/components/ui/button";
import AuctionBidForm from './AuctionBidForm';
import AuctionResult from './AuctionResult';

interface AuctionActionsProps {
  isActive: boolean;
  isUserSeller: boolean;
  isUserHighestBidder: boolean;
  walletAddress: string | null;
  canEndAuction: boolean;
  auction: {
    ended: boolean;
    highestBid: string;
    highestBidder: string;
    title: string;
    startingPrice: string;
  };
  isSubmitting: boolean;
  isEndingAuction: boolean;
  onBid: (amount: string) => void;
  onEndAuction: () => void;
}

const AuctionActions = ({ 
  isActive, 
  isUserSeller, 
  isUserHighestBidder,
  walletAddress,
  canEndAuction,
  auction, 
  isSubmitting,
  isEndingAuction,
  onBid,
  onEndAuction
}: AuctionActionsProps) => {
  
  const minBidAmount = auction.highestBid !== "0" 
    ? parseFloat(auction.highestBid) + 0.01
    : parseFloat(auction.startingPrice) + 0.01;

  if (isActive) {
    if (!isUserSeller) {
      return (
        <div className="w-full">
          <AuctionBidForm 
            isSubmitting={isSubmitting}
            onBid={onBid}
            minBidAmount={minBidAmount}
          />
          
          {isUserHighestBidder && (
            <div className="text-sm text-decentra-accent mb-4">
              You are currently the highest bidder!
            </div>
          )}
          
          {isUserSeller && (
            <Button
              variant="outline"
              onClick={onEndAuction}
              disabled={isEndingAuction}
              className="mt-4"
            >
              {isEndingAuction ? "Ending Auction..." : "End Auction Early"}
            </Button>
          )}
        </div>
      );
    } else {
      return (
        <div className="w-full">
          <p className="mb-4 text-muted-foreground">You are the seller of this auction.</p>
          <Button
            variant="outline"
            onClick={onEndAuction}
            disabled={isEndingAuction}
          >
            {isEndingAuction ? "Ending Auction..." : "End Auction Early"}
          </Button>
        </div>
      );
    }
  } else {
    return (
      <div className="w-full">
        {auction.ended ? (
          <AuctionResult
            highestBid={auction.highestBid}
            highestBidder={auction.highestBidder}
            isUserHighestBidder={isUserHighestBidder}
          />
        ) : (
          <>
            {walletAddress ? (
              <Button
                onClick={onEndAuction}
                disabled={!canEndAuction || isEndingAuction}
                className="bg-decentra-primary hover:bg-decentra-primary/90 text-white"
              >
                {isEndingAuction ? "Processing..." : "End Auction"}
              </Button>
            ) : (
              <p className="text-center text-muted-foreground">
                Connect your wallet to interact with this auction.
              </p>
            )}
          </>
        )}
      </div>
    );
  }
};

export default AuctionActions;
