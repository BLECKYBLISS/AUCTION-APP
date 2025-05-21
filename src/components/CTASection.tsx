
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { connectWallet, isMetaMaskInstalled } from '@/utils/web3';
import { toast } from "sonner";
import { Wallet } from "lucide-react";

const CTASection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(true);

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
    <section id="launch" className="section bg-decentra-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-decentra-primary/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-decentra-accent/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
            Ready to Join the Future of <span className="gradient-text">Decentralized Auctions?</span>
          </h2>
          
          <p className="text-lg text-foreground/80 mb-8 animate-fade-in">
            Start bidding and selling with full transparency and security on the blockchain today.
          </p>
          
          <div className="animate-fade-in flex flex-col md:flex-row items-center justify-center gap-4">
            {walletAddress ? (
              <div className="flex flex-col gap-4 items-center">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="bg-decentra-primary hover:bg-decentra-primary/90 text-white shadow-lg"
                  asChild
                >
                  <Link to="/auctions">Launch DecentraBid</Link>
                </Button>
                <p className="text-sm text-foreground/70">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 items-center">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="bg-decentra-primary hover:bg-decentra-primary/90 text-white shadow-lg"
                  disabled={isConnecting || !isWalletInstalled}
                  onClick={handleConnectWallet}
                >
                  {isConnecting ? "Connecting..." : (
                    <>
                      <Wallet /> Connect Wallet to Start
                    </>
                  )}
                </Button>
                {!isWalletInstalled && (
                  <p className="text-sm text-destructive">
                    No Ethereum wallet detected. Please install MetaMask to continue.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
