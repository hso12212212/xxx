import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, doc, setDoc, deleteDoc, orderBy, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Article, User } from '../types';
import { Users, FileText, Check, X, BadgeCheck, Ban, Shield, Eye } from 'lucide-react';
import { DashboardShimmer } from '../components/Shimmer';

type TabType = 'pending' | 'users' | 'articles';

const Admin: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [pendingArticles, setPendingArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [currentUser, isAdmin, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const articlesRef = collection(db, 'articles');
        const q = query(articlesRef, where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const articles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Article[];
        setPendingArticles(articles);
      } else if (activeTab === 'articles') {
        const articlesRef = collection(db, 'articles');
        const q = query(articlesRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const articles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Article[];
        setAllArticles(articles);
      } else if (activeTab === 'users') {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          verifiedAt: doc.data().verifiedAt?.toDate() || null
        })) as User[];
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveArticle = async (articleId: string) => {
    setActionLoading(articleId);
    try {
      await setDoc(doc(db, 'articles', articleId), {
        status: 'approved',
        approvedAt: serverTimestamp(),
        approvedBy: currentUser?.uid
      }, { merge: true });
      setPendingArticles(prev => prev.filter(a => a.id !== articleId));
    } catch (error) {
      console.error('Error approving article:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectArticle = async (articleId: string) => {
    const reason = prompt('سبب الرفض (اختياري):');
    setActionLoading(articleId);
    try {
      await setDoc(doc(db, 'articles', articleId), {
        status: 'rejected',
        rejectedReason: reason || ''
      }, { merge: true });
      setPendingArticles(prev => prev.filter(a => a.id !== articleId));
    } catch (error) {
      console.error('Error rejecting article:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال نهائياً؟')) return;
    setActionLoading(articleId);
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      setAllArticles(prev => prev.filter(a => a.id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyUser = async (userId: string, verify: boolean) => {
    setActionLoading(userId);
    try {
      await setDoc(doc(db, 'users', userId), {
        isVerified: verify,
        verifiedAt: verify ? serverTimestamp() : null
      }, { merge: true });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isVerified: verify, verifiedAt: verify ? new Date() : undefined } : u
      ));
    } catch (error) {
      console.error('Error updating verification:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBanUser = async (userId: string, ban: boolean) => {
    if (ban) {
      const reason = prompt('سبب الحظر:');
      if (!reason) return;
      setActionLoading(userId);
      try {
        await setDoc(doc(db, 'users', userId), {
          isBanned: true,
          bannedAt: serverTimestamp(),
          bannedReason: reason
        }, { merge: true });
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isBanned: true } : u
        ));
      } catch (error) {
        console.error('Error banning user:', error);
      }
    } else {
      setActionLoading(userId);
      try {
        await setDoc(doc(db, 'users', userId), {
          isBanned: false,
          bannedAt: null,
          bannedReason: null
        }, { merge: true });
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isBanned: false } : u
        ));
      } catch (error) {
        console.error('Error unbanning user:', error);
      }
    }
    setActionLoading(null);
  };

  const handlePromoteUser = async (userId: string, role: 'user' | 'admin') => {
    if (!confirm(role === 'admin' ? 'ترقية هذا المستخدم إلى مشرف؟' : 'إزالة صلاحيات المشرف؟')) return;
    setActionLoading(userId);
    try {
      await setDoc(doc(db, 'users', userId), {
        role,
        isVerified: role === 'admin' ? true : undefined,
        verifiedAt: role === 'admin' ? serverTimestamp() : undefined
      }, { merge: true });
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role, isVerified: role === 'admin' ? true : u.isVerified } : u
      ));
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">معتمد</span>;
      case 'rejected':
        return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">مرفوض</span>;
      default:
        return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">قيد المراجعة</span>;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            لوحة الإدارة
          </h1>
          <p className="text-gray-600">إدارة المقالات والمستخدمين</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>طلبات المقالات</span>
            {pendingArticles.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingArticles.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>المستخدمون</span>
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'articles'
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>كل المقالات</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <DashboardShimmer />
        ) : (
          <>
            {/* Pending Articles */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pendingArticles.length > 0 ? (
                  pendingArticles.map((article) => (
                    <div key={article.id} className="card p-4 flex gap-4">
                      {article.imageURL && (
                        <img
                          src={article.imageURL}
                          alt={article.title}
                          className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 line-clamp-1">{article.title}</h3>
                        <p className="text-sm text-gray-500">{formatDate(article.createdAt)}</p>
                        <div className="flex gap-2 mt-2">
                          {article.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`/article/${article.id}`, '_blank')}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                          title="معاينة"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleApproveArticle(article.id)}
                          disabled={actionLoading === article.id}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                          title="قبول"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectArticle(article.id)}
                          disabled={actionLoading === article.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          title="رفض"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 card">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات</h2>
                    <p className="text-gray-600">جميع المقالات تمت مراجعتها</p>
                  </div>
                )}
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="card p-4 flex items-center gap-4">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        {user.role === 'admin' && (
                          <Shield className="w-4 h-4 text-amber-500" />
                        )}
                        {user.isVerified && user.role !== 'admin' && (
                          <BadgeCheck className="w-4 h-4 text-blue-500" />
                        )}
                        {user.isBanned && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">محظور</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">انضم {formatDate(user.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleVerifyUser(user.id, !user.isVerified)}
                            disabled={actionLoading === user.id}
                            className={`p-2 rounded-lg disabled:opacity-50 ${
                              user.isVerified 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={user.isVerified ? 'إلغاء التوثيق' : 'توثيق'}
                          >
                            <BadgeCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleBanUser(user.id, !user.isBanned)}
                            disabled={actionLoading === user.id}
                            className={`p-2 rounded-lg disabled:opacity-50 ${
                              user.isBanned 
                                ? 'text-red-600 bg-red-50' 
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={user.isBanned ? 'إلغاء الحظر' : 'حظر'}
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handlePromoteUser(user.id, 'admin')}
                            disabled={actionLoading === user.id}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            title="ترقية لمشرف"
                          >
                            <Shield className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {user.role === 'admin' && user.email !== 'hswnbrys@gmail.com' && (
                        <button
                          onClick={() => handlePromoteUser(user.id, 'user')}
                          disabled={actionLoading === user.id}
                          className="p-2 text-amber-500 bg-amber-50 rounded-lg disabled:opacity-50"
                          title="إزالة صلاحيات المشرف"
                        >
                          <Shield className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All Articles */}
            {activeTab === 'articles' && (
              <div className="space-y-4">
                {allArticles.map((article) => (
                  <div key={article.id} className="card p-4 flex gap-4">
                    {article.imageURL && (
                      <img
                        src={article.imageURL}
                        alt={article.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 line-clamp-1">{article.title}</h3>
                        {getStatusBadge(article.status)}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(article.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(`/article/${article.id}`, '_blank')}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        title="معاينة"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {article.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveArticle(article.id)}
                          disabled={actionLoading === article.id}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                          title="قبول"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        disabled={actionLoading === article.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="حذف"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
