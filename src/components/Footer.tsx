import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Hasndel</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('platformDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/write" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('writeArticle')}
                </Link>
              </li>
              <li>
                <Link to="/tags" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('tags')}
                </Link>
              </li>
              <li>
                <Link to="/contributors" className="text-gray-600 hover:text-gray-900 text-sm">
                  {t('team')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t('contactUs')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@hasndel.com" className="text-gray-600 hover:text-gray-900 text-sm">
                  contact@hasndel.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
            {t('madeWith')} <Heart className="w-4 h-4 text-red-500 fill-red-500" /> {t('inHasndel')} © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
