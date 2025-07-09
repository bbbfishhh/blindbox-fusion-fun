import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, Sparkles, ArrowRight, Crown, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BlindBox {
  id: number;
  symbol1: string;
  symbol2: string;
  imageUrl?: string;
  explanation?: string;
}

const BlindBoxReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { inputName, blindBoxes } = location.state || {};
  
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);

  // 固定意象库
  const predefinedSymbols = {
    "山海经神兽": ["青龙", "白虎", "朱雀", "玄武", "凤凰", "麒麟", "貔貅", "九尾狐"],
    "现代动漫": ["机甲", "魔法少女", "时空穿越", "异世界", "超能力", "校园", "治愈系", "热血"],
    "自然元素": ["火焰", "冰雪", "雷电", "森林", "海洋", "山峰", "星空", "彩虹"],
    "情感色彩": ["温暖", "梦幻", "神秘", "活力", "宁静", "浪漫", "勇敢", "智慧"]
  };

  // 从姓名解析的意象
  const nameSymbols = blindBoxes ? blindBoxes.flatMap((box: BlindBox) => [box.symbol1, box.symbol2]) : [];

  const getRarityLevel = (id: number) => {
    const rarities = ["稀有", "珍贵", "传说"];
    return rarities[id - 1] || "稀有";
  };

  const getRarityIcon = (id: number) => {
    const icons = [Crown, Star, Zap];
    const Icon = icons[id - 1] || Star;
    return Icon;
  };

  const getRarityColor = (id: number) => {
    const colors = ["text-yellow-500", "text-purple-500", "text-red-500"];
    return colors[id - 1] || "text-yellow-500";
  };

  const handleSymbolToggle = (symbol: string) => {
    setSelectedSymbols(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else if (prev.length < 2) {
        return [...prev, symbol];
      } else {
        // 替换第一个选中的
        return [prev[1], symbol];
      }
    });
  };

  const handleGenerateNewBox = () => {
    if (selectedSymbols.length !== 2) return;
    
    navigate("/final-generation", {
      state: {
        inputName,
        selectedSymbols,
        originalBlindBoxes: blindBoxes
      }
    });
  };

  if (!blindBoxes) {
    navigate("/name-input");
    return null;
  }

  return (
    <div className="min-h-screen w-full py-8 px-4 bg-gradient-to-br from-blindbox-light to-blindbox-pink/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blindbox-primary mb-4">
            📊 "{inputName}" 的盲盒分析报告
          </h1>
          <p className="text-lg text-gray-600">
            每个盲盒都有独特的稀有度和情感价值，现在可以选择新的组合进行再创作
          </p>
        </div>

        {/* 盲盒报告展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {blindBoxes.map((box: BlindBox) => {
            const RarityIcon = getRarityIcon(box.id);
            const rarityColor = getRarityColor(box.id);
            const rarity = getRarityLevel(box.id);
            
            return (
              <Card key={box.id} className="bg-white/90 border-2 border-blindbox-light shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <RarityIcon className={`w-5 h-5 ${rarityColor}`} />
                    <Badge variant="outline" className={`${rarityColor} border-current`}>
                      {rarity}级
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-blindbox-primary">
                    {box.symbol1} + {box.symbol2}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="w-full h-32 rounded-lg overflow-hidden">
                    <img 
                      src={box.imageUrl} 
                      alt={`${box.symbol1} + ${box.symbol2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{box.explanation}</p>
                    
                    <div className="bg-blindbox-light/30 p-3 rounded-lg">
                      <h4 className="font-semibold text-blindbox-primary mb-2">情感价值分析</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-gray-600">
                          {box.id === 1 && "充满希望与包容的温暖组合"}
                          {box.id === 2 && "浪漫与美好的梦幻联结"}
                          {box.id === 3 && "坚定意志与光明未来的象征"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 意象选择区域 */}
        <Card className="bg-white/90 border-2 border-blindbox-primary/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blindbox-primary flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              选择两个意象进行再创作
            </CardTitle>
            <p className="text-gray-600">
              从下方选择任意两个意象标签，创造全新的盲盒组合
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 合并所有意象选择 */}
            {Object.entries(predefinedSymbols).map(([category, symbols]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-blindbox-primary mb-3">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {symbols.map((symbol) => (
                    <Button
                      key={symbol}
                      variant={selectedSymbols.includes(symbol) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSymbolToggle(symbol)}
                      className={selectedSymbols.includes(symbol) 
                        ? "bg-blindbox-accent hover:bg-blindbox-accent/80" 
                        : "border-blindbox-light hover:border-blindbox-accent"
                      }
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            
            {/* 姓名解析意象 */}
            {nameSymbols.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-blindbox-primary mb-3">
                  来自 "{inputName}" 的原始意象
                </h3>
                <div className="flex flex-wrap gap-2">
                  {nameSymbols.map((symbol: string, index: number) => (
                    <Button
                      key={`${symbol}-${index}`}
                      variant={selectedSymbols.includes(symbol) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSymbolToggle(symbol)}
                      className={selectedSymbols.includes(symbol) 
                        ? "bg-blindbox-accent hover:bg-blindbox-accent/80" 
                        : "border-blindbox-light hover:border-blindbox-accent"
                      }
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* 选择状态显示 */}
            <div className="mt-8 p-4 bg-blindbox-light/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blindbox-primary">
                    已选择: {selectedSymbols.length}/2
                  </span>
                  {selectedSymbols.length > 0 && (
                    <div className="flex gap-2">
                      {selectedSymbols.map((symbol, index) => (
                        <Badge key={index} className="bg-blindbox-accent text-white">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleGenerateNewBox}
                  disabled={selectedSymbols.length !== 2}
                  className="bg-gradient-to-r from-blindbox-primary to-blindbox-secondary hover:from-blindbox-secondary hover:to-blindbox-primary disabled:opacity-50"
                >
                  生成新盲盒
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlindBoxReport;