import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  doc, getDoc, collection, query, where, orderBy, getDocs, addDoc, deleteDoc, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Article as ArticleType, Comment } from '../types';
import { ArticlePageShimmer } from '../components/Shimmer';
import { Heart, MessageCircle, Calendar, ArrowRight, Send, Trash2, BadgeCheck, Instagram } from 'lucide-react';

const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
      fetchComments();
      if (currentUser) {
        checkIfLiked();
      }
    }
  }, [id, currentUser]);

  const fetchArticle = async () => {
    try {
      const articleDoc = await getDoc(doc(db, 'articles', id!));
      if (articleDoc.exists()) {
        const data = articleDoc.data();
        
        // Fetch author data
        let authorName = 'كاتب مجهول';
        let authorAvatar = '';
        let authorVerified = false;
        let authorInstagram = '';
        
        if (data.authorId) {
          const authorDoc = await getDoc(doc(db, 'users', data.authorId));
          if (authorDoc.exists()) {
            const authorData = authorDoc.data();
            authorName = authorData.name;
            authorAvatar = authorData.avatar;
            authorVerified = authorData.isVerified || authorData.role === 'admin';
            authorInstagram = authorData.instagram || '';
          }
        }

        setArticle({
          id: articleDoc.id,
          ...data,
          authorName,
          authorAvatar,
          authorVerified,
          authorInstagram,
          createdAt: data.createdAt?.toDate() || new Date()
        } as ArticleType);
        setLikesCount(data.likesCount || 0);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(commentsRef, where('articleId', '==', id), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const commentsData: Comment[] = [];
      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        
        // Fetch user data
        let userName = 'مستخدم';
        let userAvatar = '';
        
        if (data.userId) {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userName = userData.name;
            userAvatar = userData.avatar;
          }
        }

        commentsData.push({
          id: docSnapshot.id,
          ...data,
          userName,
          userAvatar,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Comment);
      }
      
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkIfLiked = async () => {
    try {
      const likesRef = collection(db, 'likes');
      const q = query(likesRef, where('articleId', '==', id), where('userId', '==', currentUser!.uid));
      const snapshot = await getDocs(q);
      setLiked(!snapshot.empty);
    } catch (error) {
      console.error('Error checking like:', error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const likesRef = collection(db, 'likes');
      const q = query(likesRef, where('articleId', '==', id), where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Add like
        await addDoc(likesRef, {
          articleId: id,
          userId: currentUser.uid,
          createdAt: serverTimestamp()
        });
        setLiked(true);
        setLikesCount(prev => prev + 1);
        
        // Update article likes count
        const articleRef = doc(db, 'articles', id!);
        const articleDoc = await getDoc(articleRef);
        if (articleDoc.exists()) {
          const { setDoc } = await import('firebase/firestore');
          await setDoc(articleRef, { likesCount: (articleDoc.data().likesCount || 0) + 1 }, { merge: true });
        }
      } else {
        // Remove like
        await deleteDoc(snapshot.docs[0].ref);
        setLiked(false);
        setLikesCount(prev => prev - 1);
        
        // Update article likes count
        const articleRef = doc(db, 'articles', id!);
        const articleDoc = await getDoc(articleRef);
        if (articleDoc.exists()) {
          const { setDoc } = await import('firebase/firestore');
          await setDoc(articleRef, { likesCount: Math.max((articleDoc.data().likesCount || 0) - 1, 0) }, { merge: true });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        articleId: id,
        userId: currentUser.uid,
        comment: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
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
    return <ArticlePageShimmer />;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">المقال غير موجود</h1>
        <Link to="/" className="btn-primary">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowRight className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </Link>

        {/* Article Header */}
        <article>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags?.map((tag, index) => (
              <Link
                key={index}
                to={`/search?tag=${encodeURIComponent(tag)}`}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          {/* Author & Date */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src={article.authorAvatar || `https://ui-avatars.com/api/?name=${article.authorName}`}
              alt={article.authorName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900 flex items-center gap-1">
                {article.authorName}
                {article.authorVerified && (
                  <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500" />
                )}
                {article.authorInstagram && (
                  <a 
                    href={`https://instagram.com/${article.authorInstagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(article.createdAt)}
              </p>
            </div>
          </div>

          {/* Image */}
          {article.imageURL && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={article.imageURL}
                alt={article.title}
                className="w-full h-auto max-h-[400px] sm:max-h-[500px] object-contain bg-gray-50"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="article-content mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Actions */}
          <div className="flex items-center gap-6 py-6 border-t border-b mb-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-red-500' : ''}`} />
              <span className="font-medium">{likesCount}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-500">
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{comments.length}</span>
            </div>
          </div>

          {/* Comments Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              التعليقات ({comments.length})
            </h2>

            {/* Add Comment Form */}
            {currentUser ? (
              <form onSubmit={handleAddComment} className="mb-8">
                <div className="flex gap-4">
                  <img
                    src={userData?.avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="اكتب تعليقك..."
                      className="input-field resize-none"
                      rows={3}
                    />
                    <button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="btn-primary mt-2 flex items-center gap-2"
                    >
                      <>
                          <Send className="w-4 h-4" />
                          {submitting ? 'جارٍ الإرسال...' : 'إرسال'}
                        </>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
                <p className="text-gray-600 mb-4">قم بتسجيل الدخول للتعليق</p>
                <Link to="/login" className="btn-primary inline-block">
                  تسجيل الدخول
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <img
                    src={comment.userAvatar || `https://ui-avatars.com/api/?name=${comment.userName}`}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{comment.userName}</p>
                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                      </div>
                      {currentUser?.uid === comment.userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  لا توجد تعليقات بعد. كن أول من يعلق!
                </p>
              )}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default Article;
