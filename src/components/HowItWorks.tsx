
import { Wallet, PlusCircle, ArrowRightLeft, Trophy } from 'lucide-react';

const StepCard = ({ number, icon: Icon, title, description }) => {
  return (
    <div className="relative flex items-start gap-4 animate-fade-in">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-decentra-primary flex items-center justify-center text-white font-bold">
          {number}
        </div>
      </div>
      
      <div className="flex-grow">
        <div className="p-3 bg-decentra-primary/10 inline-block rounded-lg mb-3">
          <Icon className="w-6 h-6 text-decentra-accent" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-foreground/70">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Wallet,
      title: "Connect your wallet",
      description: "Link your Ethereum wallet with just a few clicks to start participating in auctions."
    },
    {
      number: 2,
      icon: PlusCircle,
      title: "Create or join an auction",
      description: "Browse existing auctions or create your own with customizable parameters."
    },
    {
      number: 3,
      icon: ArrowRightLeft,
      title: "Place bids with ETH",
      description: "Bid on items with full transparency. All transactions are visible on the blockchain."
    },
    {
      number: 4,
      icon: Trophy,
      title: "Win or reclaim funds",
      description: "When the auction ends, winners receive their items and others automatically get refunded."
    }
  ];

  return (
    <section id="how-it-works" className="section bg-gradient-to-b from-decentra-dark to-card">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="gradient-text">DecentraBid</span> Works
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Start bidding in minutes with our simple, secure process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 gap-12">
            {steps.map((step, index) => (
              <StepCard 
                key={index} 
                number={step.number} 
                icon={step.icon} 
                title={step.title} 
                description={step.description} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
