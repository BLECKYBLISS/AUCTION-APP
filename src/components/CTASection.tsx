
const CTASection = () => {
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
          
          <div className="animate-fade-in">
            <a href="#" className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-decentra-primary/30">
              Launch DecentraBid
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
