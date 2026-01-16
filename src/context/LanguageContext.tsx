import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en' | 'ku';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
    ku: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { ar: 'الرئيسية', en: 'Home', ku: 'سەرەتا' },
  login: { ar: 'تسجيل الدخول', en: 'Login', ku: 'چوونەژوورەوە' },
  register: { ar: 'إنشاء حساب', en: 'Register', ku: 'تۆمارکردن' },
  logout: { ar: 'تسجيل الخروج', en: 'Logout', ku: 'چوونەدەرەوە' },
  profile: { ar: 'الملف الشخصي', en: 'Profile', ku: 'پرۆفایل' },
  myArticles: { ar: 'مقالاتي', en: 'My Articles', ku: 'وتارەکانم' },
  adminPanel: { ar: 'لوحة الإدارة', en: 'Admin Panel', ku: 'پانێڵی بەڕێوەبردن' },
  search: { ar: 'بحث', en: 'Search', ku: 'گەڕان' },
  searchPlaceholder: { ar: 'ابحث عن مقالات...', en: 'Search articles...', ku: 'گەڕان بۆ وتار...' },
  
  // Home
  welcome: { ar: 'مرحباً بك في هاسنديل', en: 'Welcome to Hasndel', ku: 'بەخێربێیت بۆ هاسندێل' },
  welcomeDesc: { ar: 'منصة عربية للمقالات والمدونات', en: 'Arabic platform for articles and blogs', ku: 'پلاتفۆرمی عەرەبی بۆ وتار و بلۆگ' },
  startWriting: { ar: 'ابدأ الكتابة', en: 'Start Writing', ku: 'دەست بکە بە نووسین' },
  latest: { ar: 'الأحدث', en: 'Latest', ku: 'نوێترین' },
  trending: { ar: 'الأكثر تفاعلاً', en: 'Trending', ku: 'باوترین' },
  noArticles: { ar: 'لا توجد مقالات حالياً', en: 'No articles yet', ku: 'هیچ وتارێک نییە' },
  beFirstToWrite: { ar: 'كن أول من يكتب مقالاً!', en: 'Be the first to write an article!', ku: 'یەکەم کەس بە بۆ نووسینی وتار!' },
  
  // Articles
  writeArticle: { ar: 'اكتب مقالاً', en: 'Write Article', ku: 'وتار بنووسە' },
  title: { ar: 'العنوان', en: 'Title', ku: 'ناونیشان' },
  content: { ar: 'المحتوى', en: 'Content', ku: 'ناوەرۆک' },
  tags: { ar: 'الوسوم', en: 'Tags', ku: 'تاگەکان' },
  publish: { ar: 'نشر', en: 'Publish', ku: 'بڵاوکردنەوە' },
  save: { ar: 'حفظ', en: 'Save', ku: 'پاشەکەوتکردن' },
  saveChanges: { ar: 'حفظ التغييرات', en: 'Save Changes', ku: 'پاشەکەوتکردنی گۆڕانکارییەکان' },
  delete: { ar: 'حذف', en: 'Delete', ku: 'سڕینەوە' },
  edit: { ar: 'تعديل', en: 'Edit', ku: 'دەستکاریکردن' },
  articleNotFound: { ar: 'المقال غير موجود', en: 'Article not found', ku: 'وتار نەدۆزرایەوە' },
  comments: { ar: 'التعليقات', en: 'Comments', ku: 'لێدوانەکان' },
  writeComment: { ar: 'اكتب تعليقاً...', en: 'Write a comment...', ku: 'لێدوانێک بنووسە...' },
  send: { ar: 'إرسال', en: 'Send', ku: 'ناردن' },
  
  // Auth
  email: { ar: 'البريد الإلكتروني', en: 'Email', ku: 'ئیمەیل' },
  password: { ar: 'كلمة المرور', en: 'Password', ku: 'وشەی نهێنی' },
  confirmPassword: { ar: 'تأكيد كلمة المرور', en: 'Confirm Password', ku: 'دووبارەکردنەوەی وشەی نهێنی' },
  name: { ar: 'الاسم', en: 'Name', ku: 'ناو' },
  fullName: { ar: 'الاسم الكامل', en: 'Full Name', ku: 'ناوی تەواو' },
  welcomeBack: { ar: 'مرحباً بعودتك', en: 'Welcome Back', ku: 'بەخێربێیتەوە' },
  loginToAccount: { ar: 'سجل دخولك للمتابعة', en: 'Login to continue', ku: 'بچۆ ژوورەوە بۆ بەردەوامبوون' },
  createAccount: { ar: 'إنشاء حساب جديد', en: 'Create Account', ku: 'دروستکردنی هەژمار' },
  joinUs: { ar: 'انضم إلينا اليوم', en: 'Join us today', ku: 'ئەمڕۆ پەیوەندیمان پێوە بکە' },
  continueWithGoogle: { ar: 'المتابعة باستخدام Google', en: 'Continue with Google', ku: 'بەردەوامبوون بە گووگڵ' },
  or: { ar: 'أو', en: 'or', ku: 'یان' },
  dontHaveAccount: { ar: 'ليس لديك حساب؟', en: "Don't have an account?", ku: 'هەژمارت نییە؟' },
  alreadyHaveAccount: { ar: 'لديك حساب بالفعل؟', en: 'Already have an account?', ku: 'پێشتر هەژمارت هەیە؟' },
  
  // Profile
  bio: { ar: 'نبذة عنك', en: 'Bio', ku: 'دەربارەی خۆت' },
  bioPlaceholder: { ar: 'اكتب نبذة قصيرة عن نفسك...', en: 'Write a short bio about yourself...', ku: 'کورتەیەک دەربارەی خۆت بنووسە...' },
  instagram: { ar: 'حساب انستغرام', en: 'Instagram', ku: 'ئینستاگرام' },
  updateProfile: { ar: 'تحديث الملف الشخصي', en: 'Update Profile', ku: 'نوێکردنەوەی پرۆفایل' },
  profileUpdated: { ar: 'تم تحديث الملف الشخصي بنجاح!', en: 'Profile updated successfully!', ku: 'پرۆفایل بە سەرکەوتوویی نوێکرایەوە!' },
  saving: { ar: 'جارٍ الحفظ...', en: 'Saving...', ku: 'پاشەکەوتکردن...' },
  changePhoto: { ar: 'اضغط على الأيقونة لتغيير الصورة', en: 'Click to change photo', ku: 'کرتە بکە بۆ گۆڕینی وێنە' },
  
  // Footer
  aboutUs: { ar: 'عن المنصة', en: 'About Us', ku: 'دەربارەی ئێمە' },
  contactUs: { ar: 'تواصل معنا', en: 'Contact Us', ku: 'پەیوەندیمان پێوە بکە' },
  quickLinks: { ar: 'روابط سريعة', en: 'Quick Links', ku: 'لینکە خێراکان' },
  team: { ar: 'فريق العمل', en: 'Team', ku: 'تیم' },
  madeWith: { ar: 'صنع بـ', en: 'Made with', ku: 'دروستکراوە بە' },
  inHasndel: { ar: 'في هاسنديل', en: 'in Hasndel', ku: 'لە هاسندێل' },
  platformDesc: { ar: 'منصة هاسنديل هي منصة عربية للمقالات والمدونات، حيث يمكنك مشاركة أفكارك وقراءة مقالات متنوعة في مختلف المجالات.', en: 'Hasndel is an Arabic platform for articles and blogs, where you can share your ideas and read various articles in different fields.', ku: 'هاسندێل پلاتفۆرمێکی عەرەبییە بۆ وتار و بلۆگ، کە دەتوانیت بیرۆکەکانت هاوبەش بکەیت و وتارە جۆراوجۆرەکان بخوێنیتەوە.' },
  
  // Contributors
  contributors: { ar: 'المساهمون', en: 'Contributors', ku: 'بەشداربووان' },
  founder: { ar: 'المؤسس', en: 'Founder', ku: 'دامەزرێنەر' },
  founderAndDev: { ar: 'المؤسس والمطور الرئيسي', en: 'Founder & Lead Developer', ku: 'دامەزرێنەر و گەشەپێدەری سەرەکی' },
  developer: { ar: 'مطور ومساهم', en: 'Developer & Contributor', ku: 'گەشەپێدەر و بەشداربوو' },
  yearsOld: { ar: 'عاماً', en: 'years old', ku: 'ساڵ' },
  foundedIn: { ar: 'سنة التأسيس', en: 'Founded', ku: 'دامەزراندن' },
  hasndilTeam: { ar: 'فريق هاسنديل', en: 'Hasndel Team', ku: 'تیمی هاسندێل' },
  teamDesc: { ar: 'تعرف على الفريق الذي يقف وراء منصة هاسنديل - منصة عربية للمقالات والمحتوى المتميز', en: 'Meet the team behind Hasndel - an Arabic platform for articles and premium content', ku: 'ئاشنابە بە تیمەکەی هاسندێل - پلاتفۆرمێکی عەرەبی بۆ وتار و ناوەرۆکی جوان' },
  aboutPlatform: { ar: 'عن منصة هاسنديل', en: 'About Hasndel', ku: 'دەربارەی هاسندێل' },
  wantToContribute: { ar: 'هل تريد المساهمة في تطوير هاسنديل؟', en: 'Want to contribute to Hasndel?', ku: 'دەتەوێت بەشداربیت لە پەرەپێدانی هاسندێل؟' },
  startWritingNow: { ar: 'ابدأ الكتابة الآن', en: 'Start Writing Now', ku: 'ئێستا دەست بکە بە نووسین' },
  backToTeam: { ar: 'العودة لفريق العمل', en: 'Back to Team', ku: 'گەڕانەوە بۆ تیم' },
  skills: { ar: 'المهارات', en: 'Skills', ku: 'توانایەکان' },
  joinedIn: { ar: 'انضم عام', en: 'Joined in', ku: 'پەیوەستبوو لە' },
  contributorNotFound: { ar: 'المساهم غير موجود', en: 'Contributor not found', ku: 'بەشداربوو نەدۆزرایەوە' },
  
  // Common
  back: { ar: 'رجوع', en: 'Back', ku: 'گەڕانەوە' },
  backToHome: { ar: 'العودة للرئيسية', en: 'Back to Home', ku: 'گەڕانەوە بۆ سەرەتا' },
  loading: { ar: 'جارٍ التحميل...', en: 'Loading...', ku: 'چاوەڕوانبە...' },
  noResults: { ar: 'لا توجد نتائج', en: 'No results', ku: 'هیچ ئەنجامێک نییە' },
  
  // Language names
  arabic: { ar: 'العربية', en: 'Arabic', ku: 'عەرەبی' },
  english: { ar: 'English', en: 'English', ku: 'English' },
  kurdish: { ar: 'کوردی', en: 'Kurdish', ku: 'کوردی' },
  
  // Dashboard
  dashboard: { ar: 'لوحة التحكم', en: 'Dashboard', ku: 'داشبۆرد' },
  publishedArticles: { ar: 'المقالات المنشورة', en: 'Published Articles', ku: 'وتارە بڵاوکراوەکان' },
  pendingArticles: { ar: 'المقالات قيد المراجعة', en: 'Pending Articles', ku: 'وتارە چاوەڕوانەکان' },
  noArticlesYet: { ar: 'لا توجد مقالات بعد', en: 'No articles yet', ku: 'هیچ وتارێک نییە تا ئێستا' },
  writeFirstArticle: { ar: 'اكتب مقالك الأول', en: 'Write your first article', ku: 'یەکەم وتارەکەت بنووسە' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  const dir = language === 'en' ? 'ltr' : 'rtl';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};
