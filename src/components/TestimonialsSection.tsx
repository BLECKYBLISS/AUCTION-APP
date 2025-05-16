
import { useState } from 'react';

const TestimonialCard = ({ quote, author, role }) => {
  return (
    <div className="bg-card p-6 rounded-lg border border-border hover:border-decentra-accent transition-all hover:shadow-lg hover:shadow-decentra-accent/10 animate-fade-in">
      <div className="mb-4">
        <p className="italic text-foreground/90 relative">
          <span className="text-3xl text-decentra-accent opacity-50 absolute -top-2 -left-2">"</span>
          {quote}
          <span className="text-3xl text-decentra-accent opacity-50 absolute -bottom-5 right-0">"</span>
        </p>
      </div>
      <div className="mt-6">
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-foreground/70">{role}</p>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "DecentraBid makes auctions actually fair. I've never felt more secure bidding on digital assets.",
      author: "Alex Chen",
      role: "NFT Collector"
    },
    {
      quote: "I sold my first NFT in 2 hours — smooth UX and the real-time updates kept me engaged throughout the entire process.",
      author: "Maya Johnson",
      role: "Digital Artist"
    },
    {
      quote: "The transparency of seeing everything on-chain gives me confidence that the auction results are legitimate.",
      author: "Rahim Patel",
      role: "Crypto Investor"
    }
  ];

  return (
    <section className="section bg-card">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Join thousands who trust DecentraBid for their digital auctions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              quote={testimonial.quote} 
              author={testimonial.author} 
              role={testimonial.role} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
