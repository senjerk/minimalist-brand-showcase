import { motion } from "framer-motion";

const Catalog = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-24"
    >
      <h1 className="text-4xl font-bold text-center mb-8">Каталог дизайнов</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Здесь будет контент каталога */}
        <p className="text-gray-600 text-center col-span-full">
          Каталог находится в разработке
        </p>
      </div>
    </motion.div>
  );
};

export default Catalog;