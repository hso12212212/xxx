import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Camera, Loader2, ArrowRight, Instagram } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, userData, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(userData?.name || '');
  const [bio, setBio] = useState(userData?.bio || '');
  const [instagram, setInstagram] = useState(userData?.instagram || '');
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatar || '');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser]);

  React.useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setBio(userData.bio || '');
      setInstagram(userData.instagram || '');
      setAvatarPreview(userData.avatar || '');
    }
  }, [userData]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setSuccess(false);

    try {
      let avatarURL = userData?.avatar || '';

      if (avatarFile) {
        const avatarRef = ref(storage, `avatars/${currentUser.uid}/${Date.now()}_${avatarFile.name}`);
        await uploadBytes(avatarRef, avatarFile);
        avatarURL = await getDownloadURL(avatarRef);
      }

      await updateUserProfile({
        name: name.trim(),
        bio: bio.trim(),
        instagram: instagram.trim().replace('@', ''),
        avatar: avatarURL
      });

      setSuccess(true);
      setAvatarFile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">الملف الشخصي</h1>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${name}&background=171717&color=fff`}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-0 left-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">اضغط على الأيقونة لتغيير الصورة</p>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="input-field bg-gray-50 text-gray-500"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
                placeholder="اسمك الكامل"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نبذة عنك
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="input-field resize-none"
                placeholder="اكتب نبذة قصيرة عن نفسك..."
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                حساب انستغرام
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value.replace('@', ''))}
                  className="input-field pr-8"
                  placeholder="username"
                  dir="ltr"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">سيظهر رابط حسابك بجانب اسمك في المقالات</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                تم تحديث الملف الشخصي بنجاح!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جارٍ الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
