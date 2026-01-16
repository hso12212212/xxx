# Hasndel – هاسنديل [UPDATED]

منصة عربية احترافية للمقالات والمدونات مشابهة لـ Medium

## المميزات

- 🏠 **صفحة رئيسية** تعرض أحدث المقالات والأكثر شعبية
- 📝 **كتابة المقالات** باستخدام محرر نصوص غني
- 🔐 **نظام تسجيل** دخول/تسجيل حساب (Email + Google)
- 👤 **الملف الشخصي** مع إمكانية تعديل المعلومات والصورة
- 💬 **التعليقات** على المقالات
- ❤️ **الإعجابات** بالمقالات
- 🏷️ **الوسوم** للبحث والتصنيف
- 🔍 **البحث** في المقالات
- 📱 **تصميم متجاوب** يعمل على جميع الأجهزة

## التقنيات المستخدمة

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Firebase
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage

## قاعدة البيانات (Firestore Collections)

- **users** → (name, email, avatar, bio, createdAt)
- **articles** → (title, imageURL, content, tags, authorId, createdAt, likesCount)
- **comments** → (articleId, userId, comment, createdAt)
- **likes** → (articleId, userId)

## التثبيت والتشغيل

1. تثبيت الحزم:
```bash
npm install
```

2. تشغيل المشروع:
```bash
npm run dev
```

3. فتح المتصفح على:
```
http://localhost:5173
```

## إعداد Firebase

قبل تشغيل المشروع، تأكد من:

1. تفعيل **Authentication** في Firebase Console:
   - Email/Password
   - Google Sign-in

2. تفعيل **Firestore Database**

3. تفعيل **Firebase Storage**

4. إضافة قواعد الأمان المناسبة في Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Articles collection
    match /articles/{articleId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.authorId;
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Likes collection
    match /likes/{likeId} {
      allow read: if true;
      allow create, delete: if request.auth != null;
    }
  }
}
```

5. قواعد Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## البناء للإنتاج

```bash
npm run build
```

## الترخيص

MIT License
