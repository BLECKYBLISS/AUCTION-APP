
import React from 'react';

interface AuctionTimeRemainingProps {
  endTime: Date;
  ended: boolean;
  isActive: boolean;
}

const AuctionTimeRemaining = ({ endTime, ended, isActive }: AuctionTimeRemainingProps) => {
  const formatTimeLeft = () => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Auction ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m left`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s left`;
    if (minutes > 0) return `${minutes}m ${seconds}s left`;
    return `${seconds}s left`;
  };

  return (
    <div>
      <p className="text-muted-foreground text-sm mt-2 sm:mt-0">Time Remaining</p>
      <p className={`font-medium ${!isActive ? "text-destructive" : ""}`}>
        {ended ? "Auction has ended" : formatTimeLeft()}
      </p>
    </div>
  );
};

export default AuctionTimeRemaining;
