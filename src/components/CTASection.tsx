
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { connectWallet } from '@/utils/web3';
import { toast } from "sonner";

const CTASection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      const { address } = await connectWallet();
      setWalletAddress(address);
      toast.success("Wallet connected successfully!", {
        description: `Connected with address ${address.slice(0, 6)}...${address.slice(-4)}`
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet", {
        description: "Please make sure you have MetaMask installed and try again."
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
                >
                  Launch DecentraBid
                </Button>
                <p className="text-sm text-foreground/70">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="lg" 
                className="bg-decentra-primary hover:bg-decentra-primary/90 text-white shadow-lg"
                disabled={isConnecting}
                onClick={handleConnectWallet}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet to Start"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
