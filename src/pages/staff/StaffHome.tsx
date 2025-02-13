
import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StaffHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Менеджер заказов",
      description: "Управление заказами, отслеживание статусов и обработка новых заказов",
      icon: Package,
      path: "/staff/orders",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Менеджер чатов",
      description: "Общение с клиентами, просмотр истории сообщений и обработка запросов",
      icon: MessageSquare,
      path: "/staff/chats",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Панель управления</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Card 
            key={card.path}
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => navigate(card.path)}
          >
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className={`w-full bg-gradient-to-r ${card.gradient} hover:opacity-90 transition-opacity`}
              >
                Перейти
                <card.icon className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffHome;
