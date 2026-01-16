import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Image, X, ArrowRight } from 'lucide-react';
import { Shimmer } from '../components/Shimmer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Write: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingImageURL, setExistingImageURL] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingArticle, setFetchingArticle] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isEditing) {
      fetchArticle();
    }
  }, [currentUser, id]);

  const fetchArticle = async () => {
    setFetchingArticle(true);
    try {
      const articleDoc = await getDoc(doc(db, 'articles', id!));
      if (articleDoc.exists()) {
        const data = articleDoc.data();
        
        if (data.authorId !== currentUser?.uid) {
          navigate('/');
          return;
        }

        setTitle(data.title || '');
        setContent(data.content || '');
        setTags(data.tags || []);
        setExistingImageURL(data.imageURL || '');
        setImagePreview(data.imageURL || '');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      navigate('/');
    } finally {
      setFetchingArticle(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setExistingImageURL('');
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      let imageURL = existingImageURL;

      // Upload new image if selected
      if (imageFile) {
        const imageRef = ref(storage, `articles/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageURL = await getDownloadURL(imageRef);
      }

      const articleData = {
        title: title.trim(),
        content,
        tags,
        imageURL,
        authorId: currentUser.uid,
        updatedAt: serverTimestamp()
      };

      if (isEditing) {
        await setDoc(doc(db, 'articles', id!), articleData, { merge: true });
      } else {
        await addDoc(collection(db, 'articles'), {
          ...articleData,
          likesCount: 0,
          status: 'pending',
          createdAt: serverTimestamp()
        });
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (fetchingArticle) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between mb-8">
            <Shimmer className="h-6 w-16" />
            <Shimmer className="h-8 w-40" />
          </div>
          <Shimmer className="h-12 w-full" />
          <Shimmer className="h-64 w-full" />
          <Shimmer className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowRight className="w-5 h-5" />
            <span>رجوع</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'تعديل المقال' : 'كتابة مقال جديد'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان المقال *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field text-xl font-semibold"
              placeholder="أدخل عنوان المقال..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة المقال
            </label>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition-colors">
                <Image className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-500">اضغط لرفع صورة</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF حتى 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محتوى المقال *
            </label>
            <div className="bg-white rounded-lg border">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="اكتب محتوى مقالك هنا..."
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوسوم (حتى 5 وسوم)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-primary-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="input-field"
                placeholder="اكتب وسماً واضغط Enter..."
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? 'جارٍ الحفظ...' : (isEditing ? 'حفظ التعديلات' : 'نشر المقال')}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Write;
