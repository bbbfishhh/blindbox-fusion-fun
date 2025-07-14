import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateRandomCombination, createParticles } from "@/lib/combinationUtils";
import { Combination } from "@/data/elements";

interface UseBlindBoxLogicResult {
  isOpen: boolean;
  isShaking: boolean;
  combination: Combination | null;
  showResult: boolean;
  boxRef: React.RefObject<HTMLDivElement>;
  handleShake: () => void;
  handleOpen: () => void;
  handleReset: () => void;
}

export const useBlindBoxLogic = (): UseBlindBoxLogicResult => {
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

    if (boxRef.current) {
      createParticles(boxRef.current, 30);
    }

    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const handleReset = () => {
    setIsOpen(false);
    setShowResult(false);
    setCombination(null);
  };

  return {
    isOpen,
    isShaking,
    combination,
    showResult,
    boxRef,
    handleShake,
    handleOpen,
    handleReset,
  };
};