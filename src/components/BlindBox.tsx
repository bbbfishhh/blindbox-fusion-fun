
import React, { useState, useRef } from "react";
import { Box, Gift, PackageOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createParticles, generateRandomCombination } from "@/utils/combinationUtils";
import { Combination } from "@/data/elements";
import ResultDisplay from "./ResultDisplay";
import { useToast } from "@/components/ui/use-toast";

const BlindBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [combination, setCombination] = useState<Combination | null>(null);
  const [showResult, setShowResult] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleShake = () => {
    if (isShaking || isOpen) return;
    
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
    
    // Generate random combination when shaking
    const newCombination = generateRandomCombination();
    setCombination(newCombination);
    
    toast({
      title: "摇一摇！",
      description: "里面好像有什么东西...",
      duration: 2000,
    });
  };

  const handleOpen = () => {
    if (isOpen || !combination) return;
    
    setIsOpen(true);
    
    // Create particles for opening animation
    if (boxRef.current) {
      createParticles(boxRef.current, 30);
    }
    
    // Show result after box opening animation
    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const handleReset = () => {
    setIsOpen(false);
    setShowResult(false);
    setCombination(null);
  };

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
            ) : (
              <Gift 
                size={80} 
                className="text-blindbox-primary animate-float" 
                strokeWidth={1.5} 
              />
            )}
          </div>
          
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full mt-6 w-full flex flex-col items-center gap-3">
            {!isOpen && combination && (
              <Button 
                onClick={handleOpen}
                className="bg-blindbox-accent hover:bg-blindbox-accent/80 text-white font-bold py-2 px-10 rounded-full shadow-lg"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" /> 打开盲盒
              </Button>
            )}
            
            {!combination && !isOpen && (
              <p className="text-center text-muted-foreground animate-pulse">
                点击盒子摇一摇
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="opacity-0 animate-result-appear">
          {combination && <ResultDisplay combination={combination} onReset={handleReset} />}
        </div>
      )}
    </div>
  );
};

export default BlindBox;
