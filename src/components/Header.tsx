import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-semibold text-brand-accent">
          BRAND
        </Link>
        <nav className="space-x-8">
          <Link to="/" className="text-brand-dark hover:text-brand-accent transition-colors">
            Home
          </Link>
          <Link to="/catalog" className="text-brand-dark hover:text-brand-accent transition-colors">
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;