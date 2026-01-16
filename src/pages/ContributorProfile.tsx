import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Instagram, Crown, MapPin, Calendar, Code } from 'lucide-react';

interface ContributorData {
  id: string;
  name: string;
  nameEn: string;
  nameKu: string;
  role: string;
  roleEn: string;
  roleKu: string;
  description: string;
  descriptionEn: string;
  descriptionKu: string;
  image: string;
  instagram?: string;
  isFounder?: boolean;
  age?: number;
  location?: string;
  locationEn?: string;
  locationKu?: string;
  skills?: string[];
}

const contributorsData: Record<string, ContributorData> = {
  'hussein-saad': {
    id: 'hussein-saad',
    name: 'حسين سعد',
    nameEn: 'Hussein Saad',
    nameKu: 'حوسێن سەعد',
    role: 'المؤسس والمطور الرئيسي',
    roleEn: 'Founder & Lead Developer',
    roleKu: 'دامەزرێنەر و گەشەپێدەری سەرەکی',
    description: 'حسين سعد هو مبرمج بعمر 21 عاماً ومؤسس منصة هاسنديل. يسعى لإنشاء منصة عربية متميزة للمحتوى والمقالات وإثراء المحتوى العربي على الإنترنت.',
    descriptionEn: 'Hussein Saad is a 21-year-old programmer and founder of Hasndel platform. He strives to create a distinguished Arabic platform for content and articles, enriching Arabic content on the internet.',
    descriptionKu: 'حوسێن سەعد پڕۆگرامەرێکی 21 ساڵەیە و دامەزرێنەری پلاتفۆرمی هاسندێلە. ئەو هەوڵ دەدات پلاتفۆرمێکی عەرەبی جیاواز بۆ ناوەرۆک و وتارەکان دروست بکات.',
    image: '/hso.png',
    instagram: 'zdzw',
    isFounder: true,
    age: 21,
    location: 'ديالى، بلدروز، العراق',
    locationEn: 'Diyala, Baladruz, Iraq',
    locationKu: 'دیالە، بەلەدروز، عێراق',
    skills: ['React', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Node.js']
  },
  'ahmed-alobaidi': {
    id: 'ahmed-alobaidi',
    name: 'أحمد العبيدي',
    nameEn: 'Ahmed Al-Obaidi',
    nameKu: 'ئەحمەد ئەلعوبەیدی',
    role: 'مطور ومساهم',
    roleEn: 'Developer & Contributor',
    roleKu: 'گەشەپێدەر و بەشداربوو',
    description: 'أحمد العبيدي هو مطور ومساهم في تطوير منصة هاسنديل، يعمل على تحسين تجربة المستخدم وإضافة ميزات جديدة للمنصة.',
    descriptionEn: 'Ahmed Al-Obaidi is a developer and contributor to Hasndel platform, working on improving user experience and adding new features.',
    descriptionKu: 'ئەحمەد ئەلعوبەیدی گەشەپێدەر و بەشداربووە لە پەرەپێدانی پلاتفۆرمی هاسندێل، کار دەکات لەسەر باشترکردنی ئەزموونی بەکارهێنەر.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    isFounder: false,
    skills: ['JavaScript', 'React', 'CSS']
  }
};

const ContributorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const contributor = id ? contributorsData[id] : null;

  if (!contributor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">المساهم غير موجود</h1>
        <Link to="/contributors" className="btn-primary">
          العودة لفريق العمل
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/contributors" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
          <ArrowRight className="w-5 h-5" />
          <span>العودة لفريق العمل</span>
        </Link>

        {/* Profile Card */}
        <div className="card p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <img
                src={contributor.image}
                alt={contributor.name}
                className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.name)}&background=171717&color=fff&size=200`;
                }}
              />
              {contributor.isFounder && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full">
                  <Crown className="w-5 h-5" />
                </div>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">{contributor.name}</h1>
            <p className="text-gray-500 text-sm mb-2">{contributor.nameEn}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {contributor.isFounder && (
                <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                  المؤسس
                </span>
              )}
              {contributor.age && (
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {contributor.age} عاماً
                </span>
              )}
            </div>

            <p className="text-gray-600 font-medium">{contributor.role}</p>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Location */}
            {contributor.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900">{contributor.location}</p>
                  <p className="text-gray-500 text-sm">{contributor.locationEn}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed mb-3">{contributor.description}</p>
              <p className="text-gray-500 text-sm leading-relaxed" dir="ltr">{contributor.descriptionEn}</p>
            </div>

            {/* Skills */}
            {contributor.skills && contributor.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  المهارات
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contributor.skills.map((skill, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social */}
            {contributor.instagram && (
              <div className="pt-4 border-t">
                <a
                  href={`https://instagram.com/${contributor.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600"
                >
                  <Instagram className="w-5 h-5" />
                  <span>@{contributor.instagram}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Platform Info */}
        <div className="card p-6 mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {contributor.isFounder 
              ? 'مؤسس منصة هاسنديل - منصة عربية للمقالات والمحتوى المتميز'
              : 'مساهم في تطوير منصة هاسنديل'
            }
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-gray-400 text-xs">
            <Calendar className="w-4 h-4" />
            <span>انضم عام 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorProfile;
