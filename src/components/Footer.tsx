
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card py-12 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-primary mr-3"></div>
              <span className="text-xl font-bold gradient-text">DecentraBid</span>
            </div>
            <p className="text-foreground/70 mb-6 max-w-md">
              The premier decentralized auction platform for digital assets.
              Secure, transparent, and built for the Web3 future.
            </p>
            {/* Social links */}
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/70 hover:text-decentra-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-decentra-accent transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-decentra-accent transition-colors">Features</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-decentra-accent transition-colors">How it Works</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-decentra-accent transition-colors">Launch App</a></li>
            </ul>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-decentra-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-decentra-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-foreground/60 text-sm">
          <p>© 2025 DecentraBid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
