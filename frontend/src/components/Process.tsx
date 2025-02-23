
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
    <section className="py-16 bg-[#F1F0FB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Как мы работаем
        </h2>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-center">
              {/* Карточка */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative z-10 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 w-full"
              >
                {/* Номер шага */}
                <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-lg text-lg font-medium shadow-md">
                  {step.id}
                </div>
                
                {/* Контент */}
                <div className="pt-2">
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>

              {/* Стрелки для десктопа */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute left-full transform translate-x-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  >
                    <ArrowRight 
                      className="w-8 h-8 text-blue-500" 
                      strokeWidth={2}
                    />
                  </motion.div>
                </div>
              )}

              {/* Стрелки для мобильных */}
              {index < steps.length - 1 && (
                <div className="md:hidden absolute top-full left-1/2 transform -translate-x-1/2 translate-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  >
                    <ArrowRight 
                      className="w-8 h-8 text-blue-500 transform rotate-90" 
                      strokeWidth={2}
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
