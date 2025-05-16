
import { ethers } from "ethers";
import DecentraBidABI from "../contracts/DecentraBid.json";

// Contract deployment address - this will be provided after deployment
// For local development, you can use a placeholder
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

// Define window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Initialize ethers provider and contract
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const getContract = (providerOrSigner: ethers.providers.Web3Provider | ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, DecentraBidABI, providerOrSigner);
};

// Connect wallet
export const connectWallet = async () => {
  try {
    const provider = getProvider();
    if (!provider) throw new Error("No Ethereum browser extension detected");
    
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return { address, signer };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

// Contract interactions
export const createAuction = async (
  signer: ethers.Signer,
  title: string, 
  description: string, 
  imageUrl: string, 
  startingPrice: string, 
  durationHours: number
) => {
  try {
    const contract = getContract(signer);
    const priceInWei = ethers.utils.parseEther(startingPrice);
    
    const tx = await contract.createAuction(
      title,
      description,
      imageUrl,
      priceInWei,
      durationHours
    );
    
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error creating auction:", error);
    throw error;
  }
};

export const placeBid = async (
  signer: ethers.Signer,
  auctionId: number,
  bidAmount: string
) => {
  try {
    const contract = getContract(signer);
    const bidInWei = ethers.utils.parseEther(bidAmount);
    
    const tx = await contract.placeBid(auctionId, {
      value: bidInWei
    });
    
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error placing bid:", error);
    throw error;
  }
};

export const endAuction = async (
  signer: ethers.Signer,
  auctionId: number
) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.endAuction(auctionId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error ending auction:", error);
    throw error;
  }
};

export const withdrawBid = async (
  signer: ethers.Signer,
  auctionId: number
) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.withdrawBid(auctionId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error withdrawing bid:", error);
    throw error;
  }
};

export const getAuction = async (
  provider: ethers.providers.Web3Provider,
  auctionId: number
) => {
  try {
    const contract = getContract(provider);
    const auctionData = await contract.getAuction(auctionId);
    
    return {
      id: auctionData.id.toNumber(),
      seller: auctionData.seller,
      title: auctionData.title,
      description: auctionData.description,
      imageUrl: auctionData.imageUrl,
      startingPrice: ethers.utils.formatEther(auctionData.startingPrice),
      highestBid: ethers.utils.formatEther(auctionData.highestBid),
      highestBidder: auctionData.highestBidder,
      endTime: new Date(auctionData.endTime.toNumber() * 1000),
      ended: auctionData.ended
    };
  } catch (error) {
    console.error("Error getting auction:", error);
    throw error;
  }
};

export const getAuctionCount = async (provider: ethers.providers.Web3Provider) => {
  try {
    const contract = getContract(provider);
    const count = await contract.getAuctionCount();
    return count.toNumber();
  } catch (error) {
    console.error("Error getting auction count:", error);
    throw error;
  }
};
