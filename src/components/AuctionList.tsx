
import { useState, useEffect } from 'react';
import { getProvider, getAuctionCount, getAuction } from '@/utils/web3';
import AuctionCard from '@/components/AuctionCard';
import { toast } from "sonner";

interface Auction {
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
}

const AuctionList = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const provider = getProvider();
        
        if (!provider) {
          throw new Error("Provider not initialized");
        }
        
        // Get auction count
        const count = await getAuctionCount(provider);
        
        // Fetch all auctions
        const auctionsPromises = [];
        for (let i = 0; i < count; i++) {
          auctionsPromises.push(getAuction(provider, i));
        }
        
        const fetchedAuctions = await Promise.all(auctionsPromises);
        setAuctions(fetchedAuctions);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching auctions:", err);
        setError(err.message || "Failed to fetch auctions");
        toast.error("Error loading auctions", {
          description: err.message || "Please check your connection and try again"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive mb-4">Failed to load auctions</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-2">No auctions found</h3>
        <p className="text-muted-foreground">Be the first to create an auction!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Active Auctions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default AuctionList;
