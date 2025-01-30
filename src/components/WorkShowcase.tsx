import { motion } from "framer-motion";

const works = [
  {
    id: 1,
    title: "Классическая вышивка",
    image: "/placeholder.svg",
    description: "Элегантный цветочный узор"
  },
  {
    id: 2,
    title: "Современный дизайн",
    image: "/placeholder.svg",
    description: "Геометрические формы"
  },
  {
    id: 3,
    title: "Персонализированная вышивка",
    image: "/placeholder.svg",
    description: "Уникальные монограммы"
  }
];

const WorkShowcase = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Наши работы
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {work.title}
                </h3>
                <p className="text-gray-600">{work.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkShowcase;