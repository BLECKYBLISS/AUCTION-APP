
import { ShieldCheck, Link, Globe, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="feature-card animate-fade-in">
      <div className="p-3 bg-decentra-primary/20 inline-block rounded-lg mb-4">
        <Icon className="w-6 h-6 text-decentra-accent" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "🔐 Trustless Bidding",
      description: "Smart contracts ensure bids are locked and secure. No intermediaries, no trust issues."
    },
    {
      icon: Link,
      title: "⛓️ On-Chain Logic",
      description: "All auction rules are enforced by code on the blockchain, visible and auditable by anyone."
    },
    {
      icon: Globe,
      title: "🌐 IPFS-backed Assets",
      description: "Digital assets are stored on IPFS, ensuring permanence and censorship resistance."
    },
    {
      icon: Zap,
      title: "⚡ Real-Time Updates",
      description: "See bids and auction status in real-time with our reactive interface."
    }
  ];

  return (
    <section id="features" className="section bg-decentra-dark">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">DecentraBid</span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Our platform is built on blockchain technology, providing the most secure and transparent auction experience possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
