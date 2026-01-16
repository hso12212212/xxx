import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from '../context/LanguageContext';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { ArticleCardShimmer } from '../components/Shimmer';
import { TrendingUp, Clock, PenLine } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'latest' | 'trending'>('latest');

  useEffect(() => {
    fetchArticles();
  }, [activeTab]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const articlesRef = collection(db, 'articles');
      const q = query(
        articlesRef,
        where('status', '==', 'approved'),
        orderBy(activeTab === 'trending' ? 'likesCount' : 'createdAt', 'desc'),
        limit(12)
      );
      
      const snapshot = await getDocs(q);
      const articlesData: Article[] = [];

      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        
        // Fetch author data
        let authorName = 'كاتب مجهول';
        let authorAvatar = '';
        let authorVerified = false;
        
        if (data.authorId) {
          const authorDoc = await getDoc(doc(db, 'users', data.authorId));
          if (authorDoc.exists()) {
            const authorData = authorDoc.data();
            authorName = authorData.name;
            authorAvatar = authorData.avatar;
            authorVerified = authorData.isVerified || authorData.role === 'admin';
          }
        }

        articlesData.push({
          id: docSnapshot.id,
          ...data,
          authorName,
          authorAvatar,
          authorVerified,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Article);
      }

      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            {t('welcome')}
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            {t('welcomeDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/write" className="btn-primary inline-flex items-center justify-center gap-2">
              <PenLine className="w-5 h-5" />
              {t('startWritingNow')}
            </Link>
            <a href="#articles" className="btn-secondary">
              {t('latest')}
            </a>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex items-center gap-6 mb-8 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-colors ${
              activeTab === 'latest'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="font-medium">{t('latest')}</span>
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-colors ${
              activeTab === 'trending'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">{t('trending')}</span>
          </button>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ArticleCardShimmer key={i} />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">{t('noArticles')}</p>
            <Link to="/write" className="btn-primary inline-block">
              {t('beFirstToWrite')}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
