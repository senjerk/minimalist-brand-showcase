
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="prose prose-lg mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-8">О компании ВышивАРТ</h1>
        
        <div className="space-y-6">
          <p>
            ВышивАРТ - это инновационная компания, специализирующаяся на создании уникальных вышивок.
            Наша миссия - сделать процесс создания вышивки простым и доступным, позволяя клиентам
            воплощать свои творческие идеи в жизнь.
          </p>

          <h2 className="text-2xl font-semibold mt-8">Наши преимущества</h2>
          
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <strong>Современные технологии:</strong> Используем передовое оборудование для вышивки
            </li>
            <li>
              <strong>Качественные материалы:</strong> Работаем только с лучшими тканями и нитями
            </li>
            <li>
              <strong>Индивидуальный подход:</strong> Каждый проект уникален и создается с учетом ваших пожеланий
            </li>
            <li>
              <strong>Профессионализм:</strong> Команда опытных мастеров с многолетним стажем
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Наши услуги</h2>
          
          <p>
            ВышивАРТ предлагает широкий спектр услуг по вышивке:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Машинная вышивка на одежде</li>
            <li>Создание логотипов</li>
            <li>Персонализация изделий</li>
            <li>Разработка дизайна вышивки</li>
            <li>Вышивка на заказ</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
