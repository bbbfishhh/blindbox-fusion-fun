import React from "react";
import { Gift, PackageOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlindBoxLogic } from "@/hooks/useBlindBoxLogic";
import ResultDisplay from "./ResultDisplay";

const BlindBoxInteractive: React.FC = () => {
  const {
    isOpen,
    isShaking,
    combination,
    showResult,
    boxRef,
    handleShake,
    handleOpen,
    handleReset,
  } = useBlindBoxLogic();

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {!showResult ? (
        <div
          ref={boxRef}
          className={`blind-box relative w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border-2 border-primary flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
            isShaking ? "animate-box-shake" : ""
          } ${isOpen ? "animate-box-open" : ""} hover:scale-105`}
          onClick={!isOpen ? handleShake : undefined}
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 animate-glow opacity-50" />
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            {isOpen ? (
              <PackageOpen
                size={80}
                className="text-accent animate-float"
                strokeWidth={1.5}
              />
            ) : (
              <Gift
                size={80}
                className="text-primary animate-float"
                strokeWidth={1.5}
              />
            )}
          </div>

          {/* Magic sparkles effect */}
          {!isOpen && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Sparkles className="absolute top-4 left-4 text-accent animate-pulse" size={16} />
              <Sparkles className="absolute bottom-6 right-8 text-primary animate-pulse delay-150" size={12} />
              <Sparkles className="absolute top-8 right-6 text-secondary animate-pulse delay-300" size={14} />
            </div>
          )}

          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full mt-6 w-full flex flex-col items-center gap-3">
            {!isOpen && combination && (
              <Button
                onClick={handleOpen}
                className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/80 hover:to-accent text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                打开盲盒
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

export default BlindBoxInteractive;