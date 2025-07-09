import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const NameInput = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "请输入姓名",
        description: "请输入您的姓名或任何关键词来生成专属盲盒",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 调用后端API生成意象组合
      // const symbols = await generateSymbols(name);
      
      // 暂时使用模拟数据
      setTimeout(() => {
        navigate("/blind-box-reveal", { 
          state: { 
            inputName: name,
            // symbols: symbols // 后续从API获取
          }
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "生成失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-br from-blindbox-light to-blindbox-pink/20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <User className="h-8 w-8 text-blindbox-accent animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-blindbox-primary">
            创造专属姓名盲盒
          </h1>
          <Sparkles className="h-8 w-8 text-blindbox-accent animate-pulse" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          输入您的姓名、昵称或任何关键词，让我们为您生成独一无二的创意组合
        </p>
      </div>

      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-2 border-blindbox-primary/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blindbox-primary">
            输入您的姓名
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="请输入您的姓名..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg py-3 border-blindbox-light focus:border-blindbox-accent"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !name.trim()}
              className="w-full bg-gradient-to-r from-blindbox-primary to-blindbox-secondary hover:from-blindbox-secondary hover:to-blindbox-primary text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  生成中...
                </div>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  生成独属于我的姓名盲盒
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-500 mt-6 text-center max-w-md">
        我们将根据您的姓名进行创意分析，生成三个充满惊喜的专属盲盒
      </p>
    </div>
  );
};

export default NameInput;