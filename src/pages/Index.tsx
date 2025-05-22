
import React, { useState } from "react";
import BlindBox from "@/components/BlindBox";
import { Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeName } from "@/utils/nameAnalysis";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [element1Options, setElement1Options] = useState<string[]>([]);
  const [element2Options, setElement2Options] = useState<string[]>([]);
  const [selectedElement1, setSelectedElement1] = useState<string>("");
  const [selectedElement2, setSelectedElement2] = useState<string>("");
  const [showBlindBox, setShowBlindBox] = useState<boolean>(false);
  
  const handleAnalyze = () => {
    if (!name.trim()) {
      toast({
        title: "请输入您的姓名或昵称",
        description: "需要分析姓名才能生成创意组合",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const { element1Options, element2Options } = analyzeName(name);
      
      setElement1Options(element1Options);
      setElement2Options(element2Options);
      
      // Auto-select first options
      if (element1Options.length > 0) {
        setSelectedElement1(element1Options[0]);
      }
      if (element2Options.length > 0) {
        setSelectedElement2(element2Options[0]);
      }
      
      setIsAnalyzing(false);
      
      toast({
        title: "分析完成",
        description: `从"${name}"中找到了${element1Options.length + element2Options.length}个可能的意象组合`,
      });
    }, 800);
  };
  
  const handleGenerateImage = () => {
    if (!selectedElement1 || !selectedElement2) {
      toast({
        title: "请选择两个意象",
        description: "需要两个意象才能生成组合",
        variant: "destructive"
      });
      return;
    }
    
    setShowBlindBox(true);
    
    // Scroll to blindbox
    setTimeout(() => {
      document.getElementById("blindbox-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  
  const resetGenerator = () => {
    setShowBlindBox(false);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-10 px-4">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blindbox-primary flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-blindbox-accent" />
          奇思妙想盲盒
          <Sparkles className="h-6 w-6 text-blindbox-accent" />
        </h1>
        <p className="text-lg text-gray-600">
          输入你的姓名或昵称，探索奇妙组合！
        </p>
      </div>
      
      {!showBlindBox ? (
        <div className="w-full max-w-md space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-blindbox-light">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">姓名或昵称</label>
              <div className="flex gap-2">
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="请输入姓名或昵称"
                  className="flex-1"
                />
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !name.trim()}
                  variant="outline"
                  className="bg-blindbox-primary text-white hover:bg-blindbox-primary/80"
                >
                  <Search className="h-4 w-4 mr-1" />
                  分析
                </Button>
              </div>
            </div>
            
            {element1Options.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">第一个意象</label>
                    <Select value={selectedElement1} onValueChange={setSelectedElement1}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择第一个意象" />
                      </SelectTrigger>
                      <SelectContent>
                        {element1Options.map((option, index) => (
                          <SelectItem key={`el1-${index}`} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">第二个意象</label>
                    <Select value={selectedElement2} onValueChange={setSelectedElement2}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择第二个意象" />
                      </SelectTrigger>
                      <SelectContent>
                        {element2Options.map((option, index) => (
                          <SelectItem key={`el2-${index}`} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateImage}
                  className="w-full bg-blindbox-accent hover:bg-blindbox-accent/80 text-white"
                >
                  <Sparkles className="mr-2 h-4 w-4" /> 
                  生成可爱盲盒
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  盲盒将根据你选择的意象生成可爱风格的创意组合
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div id="blindbox-section" className="w-full flex flex-col items-center justify-center">
          <BlindBox 
            element1={selectedElement1} 
            element2={selectedElement2} 
            onReset={resetGenerator} 
          />
        </div>
      )}
      
      {!showBlindBox && (
        <div className="mt-12 md:mt-16 text-center max-w-md">
          <h2 className="font-medium text-xl mb-2 text-blindbox-primary">如何玩？</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>1. 输入你的姓名或昵称</li>
            <li>2. 从姓名分析中选择两个意象组合</li>
            <li>3. 点击生成可爱盲盒</li>
            <li>4. 摇一摇盲盒，查看你的专属创意组合！</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Index;
