import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Crown, Users, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Contributor {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  instagram?: string;
  isFounder?: boolean;
  age?: number;
}

const contributors: Contributor[] = [
  {
    id: 'hussein-saad',
    name: 'حسين سعد',
    role: 'المؤسس والمطور الرئيسي',
    description: 'حسين سعد هو مبرمج بعمر 21 عاماً من ديالى بلدروز العراق، مؤسس منصة هاسنديل.',
    image: '/hso.png',
    instagram: 'zdzw',
    isFounder: true,
    age: 21
  },
  {
    id: 'ahmed-alobaidi',
    name: 'أحمد العبيدي',
    role: 'مطور ومساهم',
    description: 'أحمد العبيدي هو مطور ومساهم في منصة هاسنديل، يعمل على تحسين تجربة المستخدم.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    isFounder: false
  }
];

const Contributors: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
          <ArrowRight className="w-5 h-5" />
          <span>{t('backToHome')}</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-4xl">H</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('hasndilTeam')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('teamDesc')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="card p-4 text-center">
            <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{contributors.length}</p>
            <p className="text-sm text-gray-500">{t('contributors')}</p>
          </div>
          <div className="card p-4 text-center">
            <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">2026</p>
            <p className="text-sm text-gray-500">{t('foundedIn')}</p>
          </div>
        </div>

        {/* Contributors List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t('contributors')}
          </h2>

          {contributors.map((contributor, index) => (
            <div 
              key={index} 
              className={`card p-6 ${contributor.isFounder ? 'border-2 border-amber-200 bg-amber-50/30' : ''}`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={contributor.image}
                    alt={contributor.name}
                    className="w-28 h-28 rounded-2xl object-cover shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.name)}&background=171717&color=fff&size=200`;
                    }}
                  />
                  {contributor.isFounder && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1.5 rounded-full">
                      <Crown className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-right">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 mb-2">
                    <Link to={`/contributor/${contributor.id}`} className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
                      {contributor.name}
                    </Link>
                    {contributor.isFounder && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        {t('founder')}
                      </span>
                    )}
                    {contributor.age && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {contributor.age} {t('yearsOld')}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium mb-2">{contributor.role}</p>
                  <p className="text-gray-500 text-sm mb-4">{contributor.description}</p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center sm:justify-start gap-3">
                    {contributor.instagram && (
                      <a
                        href={`https://instagram.com/${contributor.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-pink-500 hover:text-pink-600 text-sm"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>@{contributor.instagram}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* About Platform */}
        <div className="card p-8 mt-12 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('aboutPlatform')}</h2>
          <p className="text-gray-600 leading-relaxed">
            هاسنديل هي منصة عربية للمقالات والمدونات، تهدف إلى توفير مساحة للكتّاب والمبدعين العرب 
            لمشاركة أفكارهم ومقالاتهم مع جمهور واسع. تم تأسيسها عام 2026 بواسطة حسين سعد من ديالى بلدروز العراق 
            بهدف إثراء المحتوى العربي على الإنترنت وتوفير تجربة قراءة وكتابة متميزة.
          </p>
        </div>

        {/* Join Us */}
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">{t('wantToContribute')}</p>
          <Link to="/write" className="btn-primary inline-flex items-center gap-2">
            {t('startWritingNow')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contributors;
