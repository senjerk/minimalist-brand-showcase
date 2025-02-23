import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Анна М.",
    text: "✨✨✨ Заказывала вышивку логотипа на корпоративных футболках для нашей команды. Качество просто невероятное!!! 🎉🎉🎉 Все строчки идеально ровные, цвета точно как в макете, я в полном восторге!!! После 5 стирок выглядит как новая! 👕💖💝 Отдельное огромное спасибо менеджеру за терпение и помощь с подбором ниток!!!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
  },
  {
    id: 2,
    name: "Михаил К.", 
    text: "Требовалось изготовить именную вышивку на джинсовой куртке в качестве подарка. Исполнители уложились в сжатые сроки - всего 2 дня. Качество работы полностью соответствует заявленному: строчка плотная, исполнение аккуратное, рисунок четкий. Результатом доволен, при необходимости обращусь повторно.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=19"
  },
  {
    id: 3,
    name: "Елена С.",
    text: "💝 Заказала вышивку имени дочки на её рюкзаке. Мастера были очень внимательны и помогли с выбором шрифта и расположением. Результат очень порадовал - вышивка аккуратная и красивая! Дочь с удовольствием носит свой именной рюкзак 🎒",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=6"
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
              className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg w-full overflow-hidden"
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