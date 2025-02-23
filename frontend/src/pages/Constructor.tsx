
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus, Type, Construction } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Constructor = () => {
  const [text, setText] = useState("");
  const [showNotification, setShowNotification] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <AnimatePresence>
        {showNotification && (
          <>
            {/* Размытый фон */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-md bg-background/50 z-50"
              onClick={() => setShowNotification(false)}
            />
            
            {/* Уведомление */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-background/95 border rounded-xl p-6 max-w-lg w-full shadow-lg">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Construction className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    Конструктор в разработке
                  </h2>
                  <p className="text-muted-foreground">
                    Мы усердно работаем над созданием удобного конструктора вышивки. 
                    Скоро вы сможете создавать свои уникальные дизайны прямо здесь!
                  </p>
                  <div className="pt-4">
                    <Button 
                      onClick={() => setShowNotification(false)}
                      variant="outline"
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      Понятно
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold mb-8">Конструктор вышивки</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Preview Area */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative">
              {/* Placeholder for design preview */}
              <div className="text-gray-400 text-center">
                <p>Область предпросмотра</p>
                {text && (
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black">
                    {text}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Добавить элементы</h3>
              
              {/* Text Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Текст</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Введите текст"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Button variant="outline" size="icon">
                    <Type className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Изображение</label>
                <Button variant="outline" className="w-full">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Загрузить изображение
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Constructor;
