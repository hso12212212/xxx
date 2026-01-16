import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Article } from '../types';
import { PenSquare, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { DashboardShimmer } from '../components/Shimmer';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchArticles();
  }, [currentUser]);

  const fetchArticles = async () => {
    try {
      const articlesRef = collection(db, 'articles');
      const q = query(
        articlesRef,
        where('authorId', '==', currentUser!.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const articlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Article[];

      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;

    setDeleting(articleId);
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      setArticles(prev => prev.filter(a => a.id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="shimmer h-8 w-32 rounded" />
            <div className="shimmer h-10 w-32 rounded-full" />
          </div>
          <DashboardShimmer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مقالاتي</h1>
            <p className="text-gray-600">إدارة مقالاتك المنشورة</p>
          </div>
          <Link to="/write" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            مقال جديد
          </Link>
        </div>

        {/* Articles List */}
        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <div
                key={article.id}
                className="card p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                {article.imageURL && (
                  <div className="sm:w-40 h-28 flex-shrink-0">
                    <img
                      src={article.imageURL}
                      alt={article.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/article/${article.id}`}
                    className="text-lg font-bold text-gray-900 hover:text-gray-600 line-clamp-1"
                  >
                    {article.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(article.createdAt)}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {article.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>❤️ {article.likesCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/article/${article.id}`}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="عرض"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/write/${article.id}`}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={deleting === article.id}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 className={`w-5 h-5 ${deleting === article.id ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 card">
            <PenSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">لا توجد مقالات بعد</h2>
            <p className="text-gray-600 mb-6">ابدأ بكتابة مقالك الأول وشاركه مع العالم</p>
            <Link to="/write" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              كتابة مقال جديد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
