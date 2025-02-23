import { motion } from "framer-motion";
import { useState } from "react";

interface WorkItem {
  id: number;
  title: string;
  defaultImage: string;
  hoverImage: string;
  bgClass: string;
  gridArea: string;
}

const works: WorkItem[] = [
  {
    id: 1,
    title: "ВЫСОКОКАЧЕСТВЕННАЯ\nВЫШИВКА",
    defaultImage: "https://static.tildacdn.com/tild6264-3235-4037-b934-653837643761/DSC09590_1.png",
    hoverImage: "https://static.tildacdn.com/tild6661-3139-4636-b132-346261343430/DSC09506.jpg",
    bgClass: "bg-gradient-to-b from-purple-300 to-purple-500",
    gridArea: "col-span-12 md:col-span-4 row-span-2",
  },
  {
    id: 2,
    title: "ВЫШИВКА\nПО ИНДИВИДУАЛЬНОМУ\nДИЗАЙНУ",
    defaultImage: "https://static.tildacdn.com/tild6364-3465-4632-b235-393033653337/bembi02124-min.jpg",
    hoverImage: "https://static.tildacdn.com/tild3236-3230-4134-b730-333431356436/bembi02111_1-min.jpg",
    bgClass: "bg-gradient-to-b from-gray-300 to-gray-600",
    gridArea: "col-span-12 md:col-span-8 row-span-1",
  },
  {
    id: 3,
    title: "БРЕНДИРОВАНИЕ\nОДЕЖДЫ",
    defaultImage: "https://static.tildacdn.com/tild3938-3236-4863-b130-373466336364/DSC09383.jpg",
    hoverImage: "https://static.tildacdn.com/tild3031-6166-4463-b032-363533646239/DSC09373.png",
    bgClass: "bg-gradient-to-b from-gray-400 to-gray-700",
    gridArea: "col-span-12 md:col-span-8 row-span-1",
  }
];

const WorkShowcase = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
              className={`relative overflow-hidden ${work.gridArea} cursor-pointer`}
              onMouseEnter={() => setHoveredId(work.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <motion.div 
                className={`absolute inset-0 ${work.bgClass} bg-opacity-90`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Default Image */}
              <motion.img
                src={work.defaultImage}
                alt={work.title}
                className={`absolute inset-0 w-full h-full object-cover ${
                  work.id === 2 ? 'object-[center_70%]' : 
                  work.id === 3 ? 'object-[center_40%]' : 
                  'object-center'
                }`}
                initial={{ opacity: 1 }}
                animate={{ opacity: hoveredId === work.id ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Hover Image */}
              <motion.img
                src={work.hoverImage}
                alt={work.title}
                className={`absolute inset-0 w-full h-full object-cover ${
                  work.id === 2 ? 'object-[center_83%]' : 
                  work.id === 3 ? 'object-[center_45%]' : 
                  'object-center'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredId === work.id ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10 p-8 h-full flex flex-col justify-end"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wider whitespace-pre-line leading-tight drop-shadow-lg">
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
