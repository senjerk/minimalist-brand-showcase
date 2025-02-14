import { motion } from "framer-motion";

const WorkShowcase = () => {
  const works = [
    {
      id: 1,
      title: "Классическая вышивка",
      image: "https://placehold.co/400x300",
      description: "Традиционные узоры в современном исполнении"
    },
    {
      id: 2,
      title: "Современный дизайн",
      image: "https://placehold.co/400x300",
      description: "Инновационные решения для вашего гардероба"
    },
    {
      id: 3,
      title: "Персональные проекты",
      image: "https://placehold.co/400x300",
      description: "Уникальные дизайны по вашим пожеланиям"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Наши работы</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {works.map((work) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
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