import React, { useState } from 'react';
import { BadgeCheck, X, Shield } from 'lucide-react';

interface VerifiedBadgeProps {
  isVerified: boolean;
  isAdmin?: boolean;
  verifiedAt?: Date;
  userName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ 
  isVerified, 
  isAdmin = false, 
  verifiedAt,
  userName = '',
  size = 'md' 
}) => {
  const [showModal, setShowModal] = useState(false);

  if (!isVerified && !isAdmin) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
        className="inline-flex items-center"
        title={isAdmin ? 'مدير الموقع' : 'حساب موثق'}
      >
        {isAdmin ? (
          <Shield className={`${sizeClasses[size]} text-amber-500 fill-amber-500`} />
        ) : (
          <BadgeCheck className={`${sizeClasses[size]} text-blue-500 fill-blue-500`} />
        )}
      </button>

      {/* Verification Info Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              {isAdmin ? (
                <>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">مدير الموقع</h3>
                  <p className="text-gray-600 mb-4">
                    هذا الحساب تابع لإدارة منصة هاسنديل ويمتلك صلاحيات إدارية كاملة.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">حساب موثق</h3>
                  <p className="text-gray-600 mb-4">
                    تم التحقق من هوية هذا الحساب بواسطة إدارة هاسنديل.
                  </p>
                </>
              )}

              {userName && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-500">اسم الحساب</p>
                  <p className="font-medium text-gray-900">{userName}</p>
                </div>
              )}

              {verifiedAt && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">تاريخ التوثيق</p>
                  <p className="font-medium text-gray-900">{formatDate(verifiedAt)}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-400">
                  {isAdmin 
                    ? 'مديرو الموقع لديهم صلاحية إدارة المحتوى والمستخدمين'
                    : 'الحسابات الموثقة هي حسابات تم التحقق من هويتها'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifiedBadge;
