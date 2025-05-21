
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Footer from '@/components/Footer';
import AuctionList from '@/components/AuctionList';
import CreateAuctionModal from '@/components/CreateAuctionModal';
import { connectWallet, isMetaMaskInstalled } from '@/utils/web3';

const Auctions = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    // Check if wallet is installed on component mount
    setIsWalletInstalled(isMetaMaskInstalled());
  }, []);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      const { address } = await connectWallet();
      setWalletAddress(address);
      toast.success("Wallet connected successfully!", {
        description: `Connected with address ${address.slice(0, 6)}...${address.slice(-4)}`
      });
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to connect wallet", {
        description: error.message || "Please make sure you have MetaMask installed and try again."
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-gradient-to-r from-decentra-dark to-blue-900 py-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-decentra-primary/10 rounded-full filter blur-3xl"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">DecentraBid Auctions</h1>
                <p className="text-lg text-foreground/80">Browse, bid on, and create transparent blockchain auctions</p>
              </div>
              <div className="mt-6 md:mt-0">
                {walletAddress ? (
                  <div className="flex flex-col items-end gap-2">
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="bg-decentra-accent hover:bg-decentra-accent/90 text-decentra-dark"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      Create New Auction
                    </Button>
                    <p className="text-sm text-foreground/70">
                      Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                ) : (
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="bg-decentra-primary hover:bg-decentra-primary/90 text-white"
                    disabled={isConnecting || !isWalletInstalled}
                    onClick={handleConnectWallet}
                  >
                    {isConnecting ? "Connecting..." : "Connect Wallet to Start"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Auction List */}
        <div className="container mx-auto px-4 py-12">
          {walletAddress ? (
            <AuctionList />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold mb-4">Connect your wallet to view auctions</h2>
              <p className="text-muted-foreground mb-6">
                You need to connect an Ethereum wallet to browse and interact with auctions
              </p>
              <Button
                variant="default"
                className="bg-decentra-primary hover:bg-decentra-primary/90 text-white"
                disabled={isConnecting || !isWalletInstalled}
                onClick={handleConnectWallet}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      <CreateAuctionModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        walletAddress={walletAddress}
      />
    </div>
  );
};

export default Auctions;
