
import { motion } from "framer-motion";

const works = [
  {
    id: 1,
    title: "КАЧЕСТВО\nИ СТИЛЬ",
    image: "/lovable-uploads/2c9d9c95-a58b-4846-9f9f-0e1d35d8f322.png",
    bgClass: "bg-gradient-to-b from-purple-300 to-purple-500",
    gridArea: "col-span-12 md:col-span-4 row-span-2",
  },
  {
    id: 2,
    title: "КАСТОМИЗАЦИЯ",
    image: "/lovable-uploads/2c9d9c95-a58b-4846-9f9f-0e1d35d8f322.png",
    bgClass: "bg-gradient-to-b from-gray-300 to-gray-600",
    gridArea: "col-span-12 md:col-span-8 row-span-1",
  },
  {
    id: 3,
    title: "OVERSIZE ИЗДЕЛИЯ\nДЛЯ МУЖЧИН И\nЖЕНЩИН",
    image: "/lovable-uploads/2c9d9c95-a58b-4846-9f9f-0e1d35d8f322.png",
    bgClass: "bg-gradient-to-b from-gray-400 to-gray-700",
    gridArea: "col-span-12 md:col-span-8 row-span-1",
  },
  {
    id: 4,
    title: "ТРЕНДОВЫЕ\nШВЫ НАРУЖУ",
    image: "/lovable-uploads/2c9d9c95-a58b-4846-9f9f-0e1d35d8f322.png",
    bgClass: "bg-gradient-to-b from-gray-300 to-gray-600",
    gridArea: "col-span-12 row-span-1",
  },
];

const WorkShowcase = () => {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-12 auto-rows-[300px] gap-4">
          {works.map((work) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: work.id * 0.1 }}
              className={`relative overflow-hidden ${work.gridArea}`}
            >
              <motion.div 
                className={`absolute inset-0 ${work.bgClass} bg-opacity-90`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10 p-8 h-full flex flex-col justify-end"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wider whitespace-pre-line leading-tight">
                  {work.title}
                </h3>
              </motion.div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkShowcase;
