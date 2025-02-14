import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Выбор дизайна",
    description: "Выберите готовый дизайн или создайте свой в конструкторе",
    icon: "🎨"
  },
  {
    id: 2,
    title: "Обсуждение деталей",
    description: "Согласуем все детали и особенности вашего заказа",
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
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Как мы работаем
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: step.id * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;