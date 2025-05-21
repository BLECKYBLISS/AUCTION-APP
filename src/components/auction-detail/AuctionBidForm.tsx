
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuctionBidFormProps {
  isSubmitting: boolean;
  onBid: (amount: string) => void;
  minBidAmount: number;
}

const AuctionBidForm = ({ isSubmitting, onBid, minBidAmount }: AuctionBidFormProps) => {
  const [bidAmount, setBidAmount] = useState<string>("");

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Input
        type="number"
        placeholder={`Min bid: ${minBidAmount} ETH`}
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        disabled={isSubmitting}
        className="flex-1"
        step="0.01"
      />
      <Button
        onClick={() => onBid(bidAmount)}
        disabled={isSubmitting}
        className="bg-decentra-primary hover:bg-decentra-primary/90 text-white w-full sm:w-auto"
      >
        {isSubmitting ? "Placing bid..." : "Place Bid"}
      </Button>
    </div>
  );
};

export default AuctionBidForm;
