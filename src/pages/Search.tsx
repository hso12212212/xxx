import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, query, getDocs, doc, getDoc, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import { Search as SearchIcon, Tag } from 'lucide-react';
import { ArticleCardShimmer } from '../components/Shimmer';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const tagQuery = searchParams.get('tag') || '';
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    fetchArticles();
    fetchAllTags();
  }, [searchQuery, tagQuery]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const articlesRef = collection(db, 'articles');
      let q;

      if (tagQuery) {
        q = query(articlesRef, where('tags', 'array-contains', tagQuery), orderBy('createdAt', 'desc'));
      } else {
        q = query(articlesRef, orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(q);
      let articlesData: Article[] = [];

      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        
        // Fetch author data
        let authorName = 'كاتب مجهول';
        let authorAvatar = '';
        
        if (data.authorId) {
          const authorDoc = await getDoc(doc(db, 'users', data.authorId));
          if (authorDoc.exists()) {
            const authorData = authorDoc.data();
            authorName = authorData.name;
            authorAvatar = authorData.avatar;
          }
        }

        articlesData.push({
          id: docSnapshot.id,
          ...data,
          authorName,
          authorAvatar,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Article);
      }

      // Filter by search query if exists
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        articlesData = articlesData.filter(article =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.content.toLowerCase().includes(lowerQuery) ||
          article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      }

      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTags = async () => {
    try {
      const articlesRef = collection(db, 'articles');
      const snapshot = await getDocs(articlesRef);
      
      const tagsSet = new Set<string>();
      snapshot.docs.forEach(doc => {
        const tags = doc.data().tags || [];
        tags.forEach((tag: string) => tagsSet.add(tag));
      });
      
      setAllTags(Array.from(tagsSet));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(localSearch.trim())}`;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {tagQuery ? `مقالات بوسم: ${tagQuery}` : searchQuery ? `نتائج البحث عن: ${searchQuery}` : 'البحث في المقالات'}
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="ابحث عن مقالات..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none bg-gray-50"
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <ArticleCardShimmer key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج</h2>
                <p className="text-gray-600">
                  {searchQuery || tagQuery
                    ? 'جرب البحث بكلمات أخرى أو تصفح الوسوم'
                    : 'ابدأ البحث عن المقالات'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Tags */}
          <div className="lg:w-72">
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                الوسوم الشائعة
              </h2>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/search?tag=${encodeURIComponent(tag)}`}
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      tagQuery === tag
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </Link>
                ))}
                {allTags.length === 0 && (
                  <p className="text-gray-500 text-sm">لا توجد وسوم بعد</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
