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
        <h1 className="text-4xl font-bold text-center mb-8">О Lovable</h1>
        
        <div className="space-y-6">
          <p>
            Lovable - это инновационный AI редактор для создания веб-приложений, который делает разработку доступной и эффективной.
            Наша миссия - упростить процесс создания веб-приложений, позволяя разработчикам и дизайнерам фокусироваться на творчестве,
            а не на рутинных задачах.
          </p>

          <h2 className="text-2xl font-semibold mt-8">Наши преимущества</h2>
          
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <strong>Интуитивный интерфейс:</strong> Общайтесь с AI на естественном языке и получайте готовый код.
            </li>
            <li>
              <strong>Современные технологии:</strong> Используйте последние версии React, Vite, Tailwind CSS и TypeScript.
            </li>
            <li>
              <strong>Быстрый старт:</strong> Начните разработку без сложных настроек и конфигураций.
            </li>
            <li>
              <strong>Расширяемость:</strong> Легко добавляйте новые функции и интегрируйте с другими сервисами.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Техническая база</h2>
          
          <p>
            Lovable построен на мощном стеке технологий, включающем:
          </p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>React для создания пользовательских интерфейсов</li>
            <li>Vite для быстрой разработки</li>
            <li>Tailwind CSS для стилизации</li>
            <li>TypeScript для типобезопасности</li>
            <li>Shadcn UI для готовых компонентов</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default About;