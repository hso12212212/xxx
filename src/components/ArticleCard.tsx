import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Calendar, BadgeCheck } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/article/${article.id}`} className="card block overflow-hidden group">
      {/* Image */}
      <div className="aspect-[4/3] sm:aspect-video overflow-hidden bg-gray-100">
        <img
          src={article.imageURL || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
          alt={article.title}
          className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
          {article.title}
        </h3>

        {/* Author & Date */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={article.authorAvatar || `https://ui-avatars.com/api/?name=${article.authorName}`}
            alt={article.authorName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
              {article.authorName}
              {article.authorVerified && (
                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
              )}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(article.createdAt)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-3 border-t">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Heart className="w-4 h-4" />
            <span>{article.likesCount || 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MessageCircle className="w-4 h-4" />
            <span>{article.commentsCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
