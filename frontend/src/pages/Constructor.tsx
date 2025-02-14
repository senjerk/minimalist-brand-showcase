import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus, Type } from "lucide-react";

const Constructor = () => {
  const [text, setText] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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