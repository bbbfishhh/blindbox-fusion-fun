
import React, { useState, useRef, useEffect } from "react";
import { Box, Gift, PackageOpen, Sparkles, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createParticles } from "@/utils/combinationUtils";
import ResultDisplay from "./ResultDisplay";
import { useToast } from "@/components/ui/use-toast";
import { generateImagePrompt } from "@/utils/nameAnalysis";

interface BlindBoxProps {
  element1?: string;
  element2?: string;
  style?: string;
  onReset?: () => void;
}

const BlindBox: React.FC<BlindBoxProps> = ({ 
  element1 = "", 
  element2 = "", 
  style = "realistic", 
  onReset 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate a mock image URL based on the elements and style
  // In a real implementation, this would call an AI image generation API
  const generateMockImage = (): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const imagePrompt = generateImagePrompt(element1, element2, style);
        console.log("Image generation prompt:", imagePrompt);
        
        // For demo purposes, use a placeholder image
        // In a real implementation, this would be the URL returned by the AI image generation API
        resolve("https://source.unsplash.com/random/400x400/?creative," + element1 + "," + element2);
      }, 2000);
    });
  };

  const handleShake = () => {
    if (isShaking || isOpen) return;
    
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
    
    toast({
      title: "摇一摇！",
      description: "里面好像有什么东西...",
      duration: 2000,
    });
  };

  const handleOpen = async () => {
    if (isOpen || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Generate image
      const imageUrl = await generateMockImage();
      setGeneratedImage(imageUrl);
      
      // Open the box
      setIsOpen(true);
      
      // Create particles for opening animation
      if (boxRef.current) {
        createParticles(boxRef.current, 30);
      }
      
      // Show result after box opening animation
      setTimeout(() => {
        setShowResult(true);
      }, 500);
    } catch (error) {
      toast({
        title: "生成图像失败",
        description: "请稍后再试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsOpen(false);
    setShowResult(false);
    setGeneratedImage(null);
    if (onReset) onReset();
  };

  const combinationName = element1 && element2 ? `${element1}${element2}` : "奇思妙想";
  const combinationDesc = element1 && element2 ? `${element1}与${element2}的奇妙组合` : "两个元素的神奇融合";

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {!showResult ? (
        <div 
          ref={boxRef} 
          className={`blind-box relative w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-blindbox-primary/10 backdrop-blur-sm border-2 border-blindbox-primary flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg ${
            isShaking ? "animate-box-shake" : ""
          } ${isOpen ? "animate-box-open" : ""}`}
          onClick={!isOpen ? handleShake : undefined}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {isOpen ? (
              <PackageOpen 
                size={80} 
                className="text-blindbox-accent animate-float" 
                strokeWidth={1.5} 
              />
            ) : isLoading ? (
              <RefreshCcw 
                size={80} 
                className="text-blindbox-primary animate-spin" 
                strokeWidth={1.5} 
              />
            ) : (
              <Gift 
                size={80} 
                className="text-blindbox-primary animate-float" 
                strokeWidth={1.5} 
              />
            )}
          </div>
          
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full mt-6 w-full flex flex-col items-center gap-3">
            {!isOpen && !isLoading && (
              <Button 
                onClick={handleOpen}
                className="bg-blindbox-accent hover:bg-blindbox-accent/80 text-white font-bold py-2 px-10 rounded-full shadow-lg"
                size="lg"
                disabled={isLoading}
              >
                <Sparkles className="mr-2 h-4 w-4" /> 打开盲盒
              </Button>
            )}
            
            {isLoading && (
              <p className="text-center text-muted-foreground animate-pulse">
                生成中...
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="opacity-0 animate-result-appear">
          <ResultDisplay 
            combination={{
              id: `${element1}-${element2}`,
              name: combinationName,
              description: combinationDesc,
              element1: { 
                id: "1", 
                name: element1, 
                description: `${element1}元素`, 
                emoji: "✨" 
              },
              element2: { 
                id: "2", 
                name: element2, 
                description: `${element2}元素`, 
                emoji: "🎨" 
              },
              emoji: "✨🎨",
            }} 
            imageUrl={generatedImage || ""}
            style={style}
            onReset={handleReset} 
          />
        </div>
      )}
    </div>
  );
};

export default BlindBox;
