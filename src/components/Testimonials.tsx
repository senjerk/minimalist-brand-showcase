import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Анна М.",
    text: "Превосходное качество вышивки и внимание к деталям. Очень довольна результатом!",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Михаил К.",
    text: "Отличный сервис и профессиональный подход. Рекомендую всем!",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Елена С.",
    text: "Заказывала персонализированную вышивку - результат превзошел все ожидания!",
    image: "/placeholder.svg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Отзывы наших клиентов
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
              </div>
              <p className="text-gray-600">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;