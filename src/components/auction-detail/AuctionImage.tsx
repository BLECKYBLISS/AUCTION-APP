
import React from 'react';

interface AuctionImageProps {
  imageUrl: string;
  title: string;
}

const AuctionImage = ({ imageUrl, title }: AuctionImageProps) => {
  return (
    <div className="bg-muted rounded-lg overflow-hidden h-[400px]">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-decentra-dark/20">
          <span className="text-muted-foreground">No image available</span>
        </div>
      )}
    </div>
  );
};

export default AuctionImage;
