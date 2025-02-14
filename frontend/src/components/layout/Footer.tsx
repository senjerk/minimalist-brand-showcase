import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">О компании</h3>
            <p className="text-muted-foreground">
              Мы специализируемся на создании уникальных вышивок, воплощая ваши идеи в жизнь с помощью современных технологий и традиционного мастерства.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/constructor" className="text-muted-foreground hover:text-primary transition-colors">
                  Конструктор
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  О нас
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">+7 (999) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">info@example.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">г. Москва, ул. Примерная, д. 1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} Lovable. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;