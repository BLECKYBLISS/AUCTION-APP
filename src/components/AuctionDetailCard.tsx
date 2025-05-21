
import { useState } from 'react';
import { ethers } from 'ethers';
import { placeBid, endAuction, withdrawBid, getProvider } from '@/utils/web3';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuctionDetailCardProps {
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
  walletAddress: string | null;
}

const AuctionDetailCard = ({ auction, walletAddress }: AuctionDetailCardProps) => {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEndingAuction, setIsEndingAuction] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'bid' | 'end' | 'withdraw'>('bid');

  const now = new Date();
  const isAuctionActive = now < auction.endTime && !auction.ended;
  const isUserSeller = walletAddress && walletAddress.toLowerCase() === auction.seller.toLowerCase();
  const isUserHighestBidder = walletAddress && walletAddress.toLowerCase() === auction.highestBidder.toLowerCase();
  const canEndAuction = isUserSeller || now >= auction.endTime;
  
  const formatTimeLeft = () => {
    const now = new Date();
    const diff = auction.endTime.getTime() - now.getTime();
    
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

  const handleDialogConfirm = async () => {
    if (dialogAction === 'bid') {
      await handleBid();
    } else if (dialogAction === 'end') {
      await handleEndAuction();
    } else if (dialogAction === 'withdraw') {
      await handleWithdrawBid();
    }
    setShowConfirmDialog(false);
  };

  const openConfirmDialog = (action: 'bid' | 'end' | 'withdraw') => {
    setDialogAction(action);
    setShowConfirmDialog(true);
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
      
      // Refresh the page to show updated auction info
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid", {
        description: error.message || "An error occurred while placing your bid"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndAuction = async () => {
    try {
      setIsEndingAuction(true);
      
      const provider = getProvider();
      if (!provider) throw new Error("Provider not initialized");
      
      const signer = provider.getSigner();
      await endAuction(signer, auction.id);
      
      toast.success("Auction ended successfully", {
        description: auction.highestBid !== "0" 
          ? `The auction was won by ${auction.highestBidder.slice(0, 6)}...${auction.highestBidder.slice(-4)} for ${auction.highestBid} ETH` 
          : "The auction ended with no bids"
      });
      
      // Refresh the page to show updated auction info
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error ending auction:", error);
      toast.error("Failed to end auction", {
        description: error.message || "An error occurred while ending the auction"
      });
    } finally {
      setIsEndingAuction(false);
    }
  };

  const handleWithdrawBid = async () => {
    try {
      setIsWithdrawing(true);
      
      const provider = getProvider();
      if (!provider) throw new Error("Provider not initialized");
      
      const signer = provider.getSigner();
      await withdrawBid(signer, auction.id);
      
      toast.success("Bid withdrawn successfully", {
        description: "Your bid has been successfully withdrawn"
      });
      
      // Refresh the page to show updated auction info
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error withdrawing bid:", error);
      toast.error("Failed to withdraw bid", {
        description: error.message || "An error occurred while withdrawing your bid"
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Image Section */}
      <div className="lg:col-span-1">
        <div className="bg-muted rounded-lg overflow-hidden h-[400px]">
          {auction.imageUrl ? (
            <img 
              src={auction.imageUrl} 
              alt={auction.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-decentra-dark/20">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Details Section */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader className="border-b pb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{auction.title}</h1>
              <div className="px-4 py-2 bg-decentra-accent/20 text-decentra-accent font-medium rounded-full">
                {auction.ended ? "Auction Ended" : isAuctionActive ? "Active" : "Closed"}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Seller</p>
                <p className="font-medium">{auction.seller.slice(0, 6)}...{auction.seller.slice(-4)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mt-2 sm:mt-0">Time Remaining</p>
                <p className={`font-medium ${!isAuctionActive ? "text-destructive" : ""}`}>
                  {auction.ended ? "Auction has ended" : formatTimeLeft()}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-muted-foreground">{auction.description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Starting Price</p>
                <p className="text-2xl font-bold">{auction.startingPrice} ETH</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-decentra-primary/5">
                <p className="text-sm text-muted-foreground">Current Highest Bid</p>
                <p className="text-2xl font-bold">
                  {auction.highestBid !== "0" ? `${auction.highestBid} ETH` : "No bids yet"}
                </p>
                {auction.highestBid !== "0" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    By {isUserHighestBidder ? "You" : `${auction.highestBidder.slice(0, 6)}...${auction.highestBidder.slice(-4)}`}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col border-t pt-6">
            {/* Different actions based on auction state and user role */}
            {isAuctionActive ? (
              !isUserSeller ? (
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                      onClick={() => openConfirmDialog('bid')}
                      disabled={isSubmitting}
                      className="bg-decentra-primary hover:bg-decentra-primary/90 text-white w-full sm:w-auto"
                    >
                      {isSubmitting ? "Placing bid..." : "Place Bid"}
                    </Button>
                  </div>
                  
                  {isUserHighestBidder && (
                    <div className="text-sm text-decentra-accent mb-4">
                      You are currently the highest bidder!
                    </div>
                  )}
                  
                  {isUserSeller && (
                    <Button
                      variant="outline"
                      onClick={() => openConfirmDialog('end')}
                      disabled={isEndingAuction}
                      className="mt-4"
                    >
                      {isEndingAuction ? "Ending Auction..." : "End Auction Early"}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <p className="mb-4 text-muted-foreground">You are the seller of this auction.</p>
                  <Button
                    variant="outline"
                    onClick={() => openConfirmDialog('end')}
                    disabled={isEndingAuction}
                  >
                    {isEndingAuction ? "Ending Auction..." : "End Auction Early"}
                  </Button>
                </div>
              )
            ) : (
              <div className="w-full">
                {auction.ended ? (
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Auction Result</h3>
                    {auction.highestBid !== "0" ? (
                      <p>
                        This auction was won by{" "}
                        <span className="font-medium">
                          {isUserHighestBidder ? "you" : `${auction.highestBidder.slice(0, 6)}...${auction.highestBidder.slice(-4)}`}
                        </span>{" "}
                        for <span className="font-medium">{auction.highestBid} ETH</span>.
                      </p>
                    ) : (
                      <p>This auction ended with no bids.</p>
                    )}
                  </div>
                ) : (
                  <>
                    {walletAddress ? (
                      <Button
                        onClick={() => openConfirmDialog('end')}
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
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'bid' ? 'Confirm Bid' : 
               dialogAction === 'end' ? 'End Auction' : 'Withdraw Bid'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'bid' && `You are about to bid ${bidAmount} ETH on "${auction.title}". This action cannot be undone.`}
              {dialogAction === 'end' && "Are you sure you want to end this auction? This action cannot be undone."}
              {dialogAction === 'withdraw' && "Are you sure you want to withdraw your bid? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm} className="bg-decentra-primary hover:bg-decentra-primary/90 text-white">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuctionDetailCard;
