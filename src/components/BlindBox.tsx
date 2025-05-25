
import React, { useState, useRef } from "react";
import { Box, Gift, PackageOpen, Sparkles, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createParticles } from "@/utils/combinationUtils";
import ResultDisplay from "./ResultDisplay";
import { useToast } from "@/components/ui/use-toast";
import { generateImage, type SymbolSelection } from "@/services/api";

interface BlindBoxProps {
  symbol1?: string;
  symbol2?: string;
  onReset?: () => void;
}

const BlindBox: React.FC<BlindBoxProps> = ({ 
  symbol1 = "", 
  symbol2 = "", 
  onReset 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    toast({
      title: "正在生成你的专属创意",
      description: "请稍等片刻，图片生成需要一些时间...",
      duration: 5000,
    });
    
    try {
      // Call the image generation API
      const symbolSelection: SymbolSelection = {
        symbol1,
        symbol2
      };
      
      const response = await generateImage(symbolSelection);
      
      if (response.status === "success" && response.image_url) {
        setGeneratedImage(response.image_url);
        
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
        
        toast({
          title: "创意生成成功！",
          description: "你的专属可爱组合已经准备好了",
          duration: 3000,
        });
      } else {
        throw new Error("Image generation failed");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "生成图像失败",
        description: "请检查网络连接或稍后再试",
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

  const combinationName = symbol1 && symbol2 ? `${symbol1}${symbol2}` : "奇思妙想";
  const combinationDesc = symbol1 && symbol2 ? `${symbol1}与${symbol2}的奇妙组合` : "两个元素的神奇融合";

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
              <div className="text-center">
                <p className="text-muted-foreground animate-pulse mb-1">
                  创意生成中...
                </p>
                <p className="text-xs text-muted-foreground">
                  图片生成需要一些时间，请耐心等待
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="opacity-0 animate-result-appear">
          <ResultDisplay 
            combination={{
              id: `${symbol1}-${symbol2}`,
              name: combinationName,
              description: combinationDesc,
              element1: { 
                id: "1", 
                name: symbol1, 
                description: `${symbol1}元素`, 
                emoji: "✨" 
              },
              element2: { 
                id: "2", 
                name: symbol2, 
                description: `${symbol2}元素`, 
                emoji: "🎨" 
              },
              emoji: "✨🎨",
            }} 
            imageUrl={generatedImage || ""}
            onReset={handleReset} 
          />
        </div>
      )}
    </div>
  );
};

export default BlindBox;
