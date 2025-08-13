# 🚀 Ehgezly

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![NextAuth](https://img.shields.io/badge/NextAuth-5.0-brightgreen?style=for-the-badge&logo=auth0&logoColor=white)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Zod](https://img.shields.io/badge/Zod-FF6B35?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)

**منصة حجز خدمات متكاملة** - احجز خدمتك بسهولة من أي مكان

## ✨ المزايا الرئيسية

🎯 **نظام حجوزات** - PROVIDER ينشئ خدمات ومواعيد، CUSTOMER يحجز  
🔐 **مصادقة آمنة** - GitHub, Google, Credentials مع NextAuth v5  
📱 **واجهة عصرية** - Tailwind CSS + Radix UI متجاوبة  
☁️ **رفع صور** - Cloudinary مع توقيع آمن  
⚡ **أداء عالي** - Next.js 15 + React 19 + TypeScript

## 🛠️ التقنيات

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Prisma ORM, PostgreSQL, NextAuth v5, bcryptjs
- **UI:** Radix UI, Lucide Icons, Sonner, GSAP, react-day-picker
- **Validation:** Zod schemas للتحقق من البيانات
- **Themes:** next-themes للنمط الداكن/الفاتح
- **Cloud:** Cloudinary للصور

## 🚀 البدء السريع

```bash
# 1. Clone المشروع
git clone <repo-url>
cd ehgezly

# 2. تثبيت الاعتمادات
npm install

# 3. إعداد قاعدة البيانات
npx prisma migrate dev
npx prisma generate

# 4. تشغيل المشروع
npm run dev
```

### ⚙️ متغيرات البيئة
```env
# قاعدة البيانات
DATABASE_URL="postgresql://user:pass@localhost:5432/ehgezly"
DIRECT_URL="postgresql://user:pass@localhost:5432/ehgezly"

# NextAuth
AUTH_SECRET="your-secret-key-here"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"
GOOGLE_ID="your-google-id"
GOOGLE_SECRET="your-google-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 📂 بنية المشروع

```
src/
├── app/
│   ├── (auth)/              # login, register
│   ├── api/                 # NextAuth, Cloudinary
│   ├── services/            # عرض الخدمات والحجز
│   ├── bookings/            # حجوزات العميل
│   ├── providerDashboard/   # لوحة المزود + إدارة الخدمات
│   └── profile/             # الملف الشخصي
├── components/
│   ├── ui/                  # Button, Input, Dialog...
│   └── Upload/              # CloudinaryUploader
├── lib/                     # prisma, cloudinary, utils
└── auth.ts                  # NextAuth config
```

## 🗃️ قاعدة البيانات

```bash
# إدارة البيانات محلياً
npx prisma studio
```

**النماذج:**
- `User` → أدوار: PROVIDER, CUSTOMER 
- `Service` → خدمات المزودين مع صور
- `Slot` → المواعيد المتاحة
- `Booking` → حالات: PENDING, CONFIRMED, CANCELLED

## 🔐 المصادقة

✅ **NextAuth v5** - GitHub, Google, Credentials  
✅ **حماية المسارات** - Middleware حسب الدور  
✅ **جلسات JWT** - آمنة وسريعة

**المسارات:**
- `/` - الرئيسية
- `/services` - عرض الخدمات  
- `/bookings` - حجوزات العميل
- `/providerDashboard` - لوحة المزود
- `/profile` - الملف الشخصي

## ☁️ Cloudinary

```tsx
<CloudinaryUploader 
  onUploadComplete={({ url }) => setImage(url)} 
/>
```

## 🚀 النشر

**Vercel (موصى به):**
1. ربط المستودع
2. إضافة متغيرات البيئة
3. ربط قاعدة PostgreSQL
4. Deploy!

## 📚 التوثيق

- [📅 تدفق التواريخ](docs/datetime-flow.md)
- [📸 رفع الصور](docs/cloudinary-image-upload.md)

---

<div align="center">

**🛠️ تم بناؤه بـ Next.js 15 & TypeScript**

</div>
