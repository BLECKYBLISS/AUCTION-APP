
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { placeBid, getProvider } from '@/utils/web3';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";

interface AuctionProps {
  auction: {
    id: number;
    seller: string;
    title: string;
    description: string;
    imageUrl: string;
    startingPrice: string;
    highestBid: string;
    highestBidder: string;
    endTime: Date;
    ended: boolean;
  };
}

const AuctionCard = ({ auction }: AuctionProps) => {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeLeft = () => {
    const now = new Date();
    const diff = auction.endTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Auction ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours left`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes left`;
    return `${minutes} minutes left`;
  };

  const handleBid = async () => {
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      toast.error("Invalid bid amount", { description: "Please enter a valid bid amount" });
      return;
    }

    // Check if bid is higher than current highest bid or starting price
    const minBid = auction.highestBid !== "0" 
      ? parseFloat(auction.highestBid) 
      : parseFloat(auction.startingPrice);
      
    if (parseFloat(bidAmount) <= minBid) {
      toast.error("Bid too low", { 
        description: `Your bid must be higher than ${minBid} ETH` 
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const provider = getProvider();
      if (!provider) throw new Error("Provider not initialized");
      
      const signer = provider.getSigner();
      await placeBid(signer, auction.id, bidAmount);
      
      toast.success("Bid placed successfully", {
        description: `You bid ${bidAmount} ETH on "${auction.title}"`
      });
      
      setBidAmount("");
    } catch (error: any) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid", {
        description: error.message || "An error occurred while placing your bid"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAuctionActive = new Date() < auction.endTime && !auction.ended;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {auction.imageUrl ? (
          <img 
            src={auction.imageUrl} 
            alt={auction.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-decentra-dark/20">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{auction.title}</CardTitle>
        <CardDescription>
          <span>{timeLeft()}</span>
          <div className="mt-1 text-xs">
            Seller: {auction.seller.slice(0, 6)}...{auction.seller.slice(-4)}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="line-clamp-2 text-sm text-muted-foreground">{auction.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Starting price</p>
            <p className="font-semibold">{auction.startingPrice} ETH</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current bid</p>
            <p className="font-semibold">
              {auction.highestBid !== "0" ? `${auction.highestBid} ETH` : "No bids yet"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Link to={`/auction/${auction.id}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full"
          >
            View Details
          </Button>
        </Link>

        {isAuctionActive ? (
          <div className="w-full space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Min bid: ${parseFloat(auction.highestBid || auction.startingPrice) + 0.01} ETH`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                disabled={isSubmitting}
                className="flex-1"
                step="0.01"
              />
              <Button
                onClick={handleBid}
                disabled={isSubmitting}
                className="bg-decentra-primary hover:bg-decentra-primary/90 text-white"
              >
                {isSubmitting ? "Placing bid..." : "Place Bid"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full text-center text-muted-foreground">
            {auction.ended ? "Auction has ended" : "Auction is closed"}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuctionCard;
