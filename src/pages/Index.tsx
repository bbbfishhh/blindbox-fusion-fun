
import React from "react";
import BlindBox from "@/components/BlindBox";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blindbox-primary flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-blindbox-accent" />
          奇思妙想盲盒
          <Sparkles className="h-6 w-6 text-blindbox-accent" />
        </h1>
        <p className="text-lg text-gray-600">
          摇一摇，打开盒子，探索奇妙组合！
        </p>
      </div>
      
      <BlindBox />
      
      <div className="mt-12 md:mt-16 text-center max-w-md">
        <h2 className="font-medium text-xl mb-2 text-blindbox-primary">如何玩？</h2>
        <ul className="text-gray-600 space-y-2 text-sm">
          <li>1. 点击盲盒来摇一摇</li>
          <li>2. 点击"打开盲盒"按钮</li>
          <li>3. 欣赏你创造的奇思妙想组合！</li>
        </ul>
        <p className="mt-4 text-xs text-gray-500">每个盲盒都包含两个随机元素的组合</p>
      </div>
    </div>
  );
};

export default Index;
