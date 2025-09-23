import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="border-b bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-end">
          <LanguageSelector />
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">{t('notFoundCode')}</h1>
          <p className="mb-4 text-xl text-gray-600">{t('notFoundMessage')}</p>
          <Link to="/" className="text-blue-500 underline hover:text-blue-700">
            {t('returnHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
