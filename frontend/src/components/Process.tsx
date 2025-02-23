
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Выбор дизайна",
    description: "Выберите готовый дизайн или создайте индивидуальный",
    icon: "🎨"
  },
  {
    id: 2,
    title: "Согласование",
    description: "Обсудим детали вышивки и особенности материала",
    icon: "💬"
  },
  {
    id: 3,
    title: "Производство",
    description: "Создаем вашу вышивку с вниманием к каждой детали",
    icon: "🧵"
  },
  {
    id: 4,
    title: "Доставка",
    description: "Бережно упаковываем и отправляем ваш заказ",
    icon: "📦"
  }
];

const Process = () => {
  return (
    <section className="py-24 bg-[#F1F0FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          Как мы работаем
        </h2>
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative z-10 bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute -top-4 left-4 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-semibold">
                  {step.id}
                </div>
                <div className="text-4xl mb-4 mt-2">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
              
              {/* Стрелки между элементами */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 z-0">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    <ArrowRight 
                      className="w-12 h-12 text-blue-500" 
                      strokeWidth={1.5}
                    />
                  </motion.div>
                </div>
              )}

              {/* Вертикальные стрелки для мобильной версии */}
              {index < steps.length - 1 && (
                <div className="md:hidden absolute left-1/2 -bottom-8 transform -translate-x-1/2 rotate-90">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    <ArrowRight 
                      className="w-8 h-8 text-blue-500" 
                      strokeWidth={1.5}
                    />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
