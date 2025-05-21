
import { useState } from 'react';
import { createAuction, getProvider } from '@/utils/web3';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
}

const CreateAuctionModal = ({ isOpen, onClose, walletAddress }: CreateAuctionModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("24");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAuction = async () => {
    // Form validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    
    if (!startingPrice || isNaN(Number(startingPrice)) || Number(startingPrice) <= 0) {
      toast.error("Please enter a valid starting price");
      return;
    }
    
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      toast.error("Please enter a valid duration in hours");
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      
      const provider = getProvider();
      if (!provider) throw new Error("Provider not initialized");
      
      const signer = provider.getSigner();
      
      await createAuction(
        signer,
        title,
        description,
        imageUrl,
        startingPrice,
        Number(duration)
      );
      
      toast.success("Auction created successfully", {
        description: "Your auction has been created and is now live"
      });
      
      // Reset form and close modal
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creating auction:", error);
      toast.error("Failed to create auction", {
        description: error.message || "An error occurred while creating your auction"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setStartingPrice("");
    setDuration("24");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Auction</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new auction on the blockchain
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              placeholder="Enter auction title"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Describe what you're auctioning"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="col-span-3"
              placeholder="Enter URL to item image (optional)"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startingPrice" className="text-right">
              Starting Price
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="startingPrice"
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                placeholder="0.1"
                step="0.01"
                min="0"
              />
              <span>ETH</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                step="1"
              />
              <span>Hours</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateAuction} 
            className="bg-decentra-primary hover:bg-decentra-primary/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Auction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAuctionModal;
