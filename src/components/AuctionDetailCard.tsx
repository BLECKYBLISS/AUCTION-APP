
import { useState } from 'react';
import { placeBid, endAuction, withdrawBid, getProvider } from '@/utils/web3';
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AuctionImage from './auction-detail/AuctionImage';
import AuctionStatus from './auction-detail/AuctionStatus';
import AuctionTimeRemaining from './auction-detail/AuctionTimeRemaining';
import AuctionPriceInfo from './auction-detail/AuctionPriceInfo';
import AuctionActions from './auction-detail/AuctionActions';
import ConfirmDialog from './auction-detail/ConfirmDialog';

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

  const getDialogContent = () => {
    switch (dialogAction) {
      case 'bid':
        return {
          title: 'Confirm Bid',
          description: `You are about to bid ${bidAmount} ETH on "${auction.title}". This action cannot be undone.`
        };
      case 'end':
        return {
          title: 'End Auction',
          description: "Are you sure you want to end this auction? This action cannot be undone."
        };
      case 'withdraw':
        return {
          title: 'Withdraw Bid',
          description: "Are you sure you want to withdraw your bid? This action cannot be undone."
        };
      default:
        return { title: '', description: '' };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Image Section */}
      <div className="lg:col-span-1">
        <AuctionImage imageUrl={auction.imageUrl} title={auction.title} />
      </div>
      
      {/* Details Section */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader className="border-b pb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{auction.title}</h1>
              <AuctionStatus ended={auction.ended} isActive={isAuctionActive} />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Seller</p>
                <p className="font-medium">{auction.seller.slice(0, 6)}...{auction.seller.slice(-4)}</p>
              </div>
              <AuctionTimeRemaining 
                endTime={auction.endTime} 
                ended={auction.ended} 
                isActive={isAuctionActive} 
              />
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-muted-foreground">{auction.description}</p>
            </div>
            
            <AuctionPriceInfo 
              startingPrice={auction.startingPrice}
              highestBid={auction.highestBid}
              highestBidder={auction.highestBidder}
              isUserHighestBidder={Boolean(isUserHighestBidder)}
            />
          </CardContent>
          
          <CardFooter className="flex flex-col border-t pt-6">
            <AuctionActions 
              isActive={isAuctionActive}
              isUserSeller={Boolean(isUserSeller)}
              isUserHighestBidder={Boolean(isUserHighestBidder)}
              walletAddress={walletAddress}
              canEndAuction={canEndAuction}
              auction={auction}
              isSubmitting={isSubmitting}
              isEndingAuction={isEndingAuction}
              onBid={(amount) => {
                setBidAmount(amount);
                openConfirmDialog('bid');
              }}
              onEndAuction={() => openConfirmDialog('end')}
            />
          </CardFooter>
        </Card>
      </div>

      <ConfirmDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleDialogConfirm}
        title={dialogContent.title}
        description={dialogContent.description}
      />
    </div>
  );
};

export default AuctionDetailCard;
