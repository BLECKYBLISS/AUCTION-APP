
import React from 'react';

interface AuctionStatusProps {
  ended: boolean;
  isActive: boolean;
}

const AuctionStatus = ({ ended, isActive }: AuctionStatusProps) => {
  return (
    <div className="px-4 py-2 bg-decentra-accent/20 text-decentra-accent font-medium rounded-full">
      {ended ? "Auction Ended" : isActive ? "Active" : "Closed"}
    </div>
  );
};

export default AuctionStatus;
