
const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-decentra-dark to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="gradient-text">Decentralized Auctions.</span> <br />
            <span className="text-foreground">Transparent. Trustless.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Bid on NFTs, tokens, and more with total security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <a href="#launch" className="btn-primary text-center">
              Launch App
            </a>
            <a href="#connect" className="btn-secondary text-center">
              Connect Wallet
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden lg:block absolute bottom-20 right-20 w-64 h-64 rounded-full bg-decentra-primary/20 blur-3xl"></div>
      <div className="hidden lg:block absolute top-20 right-40 w-32 h-32 rounded-full bg-decentra-accent/20 blur-2xl"></div>
    </section>
  );
};

export default HeroSection;
