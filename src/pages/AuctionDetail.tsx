
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProvider, getAuction } from '@/utils/web3';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuctionDetailCard from '@/components/AuctionDetailCard';
import { toast } from "sonner";

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) {
        navigate('/auctions');
        return;
      }

      try {
        setLoading(true);
        const provider = getProvider();
        
        if (!provider) {
          throw new Error("Provider not initialized");
        }
        
        const auctionData = await getAuction(provider, parseInt(id));
        setAuction(auctionData);

        // Check for wallet address
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (walletError) {
          console.error("Error checking wallet:", walletError);
        }
        
        setError(null);
      } catch (err: any) {
        console.error("Error fetching auction:", err);
        setError(err.message || "Failed to fetch auction details");
        toast.error("Error loading auction", {
          description: err.message || "Please check your connection and try again"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuction();
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/auctions')}
              className="flex items-center text-decentra-primary hover:underline"
            >
              <span className="mr-2">←</span> Back to Auctions
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-64 bg-muted rounded mb-4"></div>
                <div className="h-4 w-48 bg-muted rounded"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-destructive mb-4">Failed to load auction</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : auction ? (
            <AuctionDetailCard 
              auction={auction} 
              walletAddress={walletAddress}
            />
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">Auction not found</h3>
              <p className="text-muted-foreground">The auction you're looking for doesn't exist or has been removed.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuctionDetail;
