
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 bg-decentra-dark/80 backdrop-blur-md border-b border-border shadow-sm z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-primary animate-pulse-glow mr-3"></div>
              <span className="text-xl font-bold gradient-text">DecentraBid</span>
            </a>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-decentra-accent transition-colors">Features</a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-decentra-accent transition-colors">How it works</a>
            <a href="#launch" className="btn-primary">Launch App</a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-foreground hover:text-decentra-accent"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-4 bg-decentra-dark/95 backdrop-blur-md">
            <a 
              href="#features" 
              className="text-foreground/80 hover:text-decentra-accent transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-foreground/80 hover:text-decentra-accent transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How it works
            </a>
            <a 
              href="#launch" 
              className="btn-primary text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Launch App
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
