
import { motion } from "framer-motion";

const works = [
  {
    id: 1,
    title: "КАЧЕСТВО И СТИЛЬ",
    image: "/lovable-uploads/260d40a7-351d-4bd0-9646-5e9f1b997cc6.png",
    aspectRatio: "aspect-[4/5]",
    span: "col-span-1 md:col-span-1",
  },
  {
    id: 2,
    title: "КАСТОМИЗАЦИЯ",
    image: "/lovable-uploads/260d40a7-351d-4bd0-9646-5e9f1b997cc6.png",
    aspectRatio: "aspect-[4/3]",
    span: "col-span-1 md:col-span-1",
  },
  {
    id: 3,
    title: "OVERSIZE ИЗДЕЛИЯ\nДЛЯ МУЖЧИН И\nЖЕНЩИН",
    image: "/lovable-uploads/260d40a7-351d-4bd0-9646-5e9f1b997cc6.png",
    aspectRatio: "aspect-[3/4]",
    span: "col-span-1 md:col-span-1",
  },
  {
    id: 4,
    title: "ТРЕНДОВЫЕ ШВЫ НАРУЖУ",
    image: "/lovable-uploads/260d40a7-351d-4bd0-9646-5e9f1b997cc6.png",
    aspectRatio: "aspect-[16/9]",
    span: "col-span-1 md:col-span-3",
  },
];

const WorkShowcase = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {works.map((work) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: work.id * 0.1 }}
              className={`relative group overflow-hidden rounded-2xl ${work.span} ${work.aspectRatio}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
              
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 z-20 p-6 flex items-end">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: work.id * 0.2 }}
                  className="text-white text-xl md:text-2xl font-bold tracking-wider whitespace-pre-line"
                >
                  {work.title}
                </motion.h3>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkShowcase;
