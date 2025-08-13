## هدف الدليل

خطة عامة قابلة لإعادة الاستخدام لرفع الصور من الواجهة الأمامية إلى Cloudinary بشكل احترافي، ثم تخزين رابط الصورة في قاعدة البيانات. الدليل يتضمّن طريقتين:

- رفع مباشر من العميل إلى Cloudinary بتوقيع موقّع Signed Upload (موصى به للإنتاج)
- رفع عبر السيرفر باستخدام upload_stream

ستجد أدناه المتطلبات، الإعدادات، الأكواد الجاهزة، والاعتبارات الأمنية.

---

## المتطلبات

- حساب Cloudinary مُجهّز
- متغيّرات بيئة في مشروعك:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- تثبيت الحزمة:
```bash
npm i cloudinary
```

اختياري لكن مُفيد:
- مبدئيًا حدّد مجلد للرفع مثل: `app-uploads/services`
- إنشاء Upload Preset في Cloudinary (مهم للتقييد والسياسات)

---

## ضبط Cloudinary في السيرفر

أنشئ ملف تهيئة واحد يُستدعى من طبقة السيرفر فقط.

```ts
// src/lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

---

## المسار A (موصى به): رفع مباشر موقّع Signed Upload

### 1) مسار توقيع في السيرفر

يعطي العميل توقيعًا مؤقتًا ثم يقوم العميل بالرفع مباشرة إلى Cloudinary.

```ts
// src/app/api/cloudinary/sign/route.ts (Next.js App Router)
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
	const { folder = "app-uploads/services", public_id, upload_preset } = await req.json();
	const timestamp = Math.floor(Date.now() / 1000);
	const paramsToSign: Record<string, string | number | undefined> = {
		timestamp,
		folder,
		public_id,
		...(upload_preset ? { upload_preset } : {}),
	};
	const signature = (cloudinary.utils as unknown as { api_sign_request: (params: Record<string, unknown>, secret: string) => string })
		.api_sign_request(paramsToSign as Record<string, unknown>, process.env.CLOUDINARY_API_SECRET as string);
	return Response.json({
		timestamp,
		signature,
		cloudName: process.env.CLOUDINARY_CLOUD_NAME,
		apiKey: process.env.CLOUDINARY_API_KEY,
		uploadPreset: upload_preset,
		folder,
	});
}
```

ملاحظات:
- يمكنك تمرير `upload_preset` إذا أردت استخدام إعدادات محددة من Cloudinary (تحجيم، سياسات، إلخ).
- إن لم تستخدم `upload_preset`، يكفي تمرير `folder` و`timestamp` وتوقيعهما.

### 2) مكوّن رفع في الواجهة الأمامية

جاهز لإعادة الاستخدام، يقوم بطلب التوقيع ثم يرفع بالـ XHR مع شريط تقدّم.

```tsx
// src/components/Upload/CloudinaryUploader.tsx
"use client";
import React from "react";

interface Props {
	onUploadComplete: (args: { url: string; publicId?: string }) => void;
	folder?: string;
}

const CloudinaryUploader: React.FC<Props> = ({ onUploadComplete, folder = "app-uploads/services" }) => {
	const [isUploading, setIsUploading] = React.useState(false);
	const [progress, setProgress] = React.useState(0);
	const [error, setError] = React.useState<string | null>(null);

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setError(null);
		if (!file.type.startsWith("image/")) {
			setError("Please select a valid image file");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			setError("Image is too large (max 5MB)");
			return;
		}

		setIsUploading(true);
		setProgress(0);
		try {
			const sigRes = await fetch("/api/cloudinary/sign", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ folder }),
			});
			if (!sigRes.ok) throw new Error("Failed to get signature");
			const sig = await sigRes.json();

			const form = new FormData();
			form.append("file", file);
			form.append("api_key", sig.apiKey);
			form.append("timestamp", String(sig.timestamp));
			form.append("signature", sig.signature);
			if (sig.uploadPreset) form.append("upload_preset", sig.uploadPreset);
			form.append("folder", sig.folder || folder);

			await new Promise<void>((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) {
						setProgress(Math.round((event.loaded / event.total) * 100));
					}
				};
				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						try {
							const data = JSON.parse(xhr.responseText);
							onUploadComplete({ url: data.secure_url, publicId: data.public_id });
							resolve();
						} catch (e) {
							reject(e);
						}
					} else {
						reject(new Error("Upload failed"));
					}
				};
				xhr.onerror = () => reject(new Error("Network error"));
				xhr.send(form);
			});
		} catch (e) {
			const message = e instanceof Error ? e.message : "Upload failed";
			setError(message);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium">Image</label>
			<input type="file" accept="image/*" onChange={handleChange} aria-label="Upload image" />
			{isUploading ? (
				<div className="text-xs text-muted-foreground">Uploading... {progress}%</div>
			) : null}
			{error ? <div className="text-xs text-red-500">{error}</div> : null}
		</div>
	);
};

export default CloudinaryUploader;
```

### 3) دمج الرفع داخل نموذج (Form)

- خزّن رابط الصورة في حالة محلية، وأرسله للسيرفر ضمن `FormData` عبر حقل مخفي.

```tsx
// مثال داخل صفحة إضافة عنصر
<form action={action} className="space-y-4">
	<input type="hidden" name="image" value={imageUrl} />
	<CloudinaryUploader onUploadComplete={({ url }) => setImageUrl(url)} folder="app-uploads/services" />
	{/* بقية حقول النموذج */}
	<button type="submit">Save</button>
</form>
```

### 4) حفظ الرابط في قاعدة البيانات (مثال Prisma)

نموذج Prisma مثال:

```prisma
model Service {
	id          String   @id @default(cuid())
	title       String
	description String
	image       String?  // رابط الصورة
	price       Float
	duration    Int
	providerId  String
	createdAt   DateTime @default(now())
}
```

استقبال الرابط في السيرفر (Server Action أو API) وحفظه:

```ts
// مثال مبسّط داخل أكشن إنشاء
const image = formData.get("image");
await db.service.create({
	data: {
		title,
		description,
		price,
		duration,
		image: (typeof image === "string" && image.trim() !== "") ? image : null,
	},
});
```

---

## المسار B (بديل): رفع عبر السيرفر باستخدام upload_stream

هذا المسار يجعل العميل يرسل الملف للسيرفر، والسيرفر يرفعه لـ Cloudinary. مناسب عندما تحتاج تحكّمًا كاملاً على السيرفر.

```ts
// src/app/api/cloudinary/upload/route.ts
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

function bufferToStream(buffer: Buffer) {
	const readable = new Readable();
	readable.push(buffer);
	readable.push(null);
	return readable;
}

export async function POST(req: Request) {
	const formData = await req.formData();
	const file = formData.get("file") as File;
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const result = await new Promise<any>((resolve, reject) => {
		const upload = cloudinary.uploader.upload_stream(
			{ folder: "app-uploads/services", resource_type: "image" },
			(err, res) => (err ? reject(err) : resolve(res))
		);
		bufferToStream(buffer).pipe(upload);
	});

	return Response.json(result); // secure_url, public_id
}
```

واجهة العميل ترسل `multipart/form-data` لهذا المسار، وتتلقى `secure_url` لتخزينه.

---

## حذف/تحديث الصور

احفظ `public_id` عند الحاجة للحذف أو الاستبدال:

```ts
// حذف صورة
await cloudinary.uploader.destroy(publicId);
```

---

## الأمان والأداء

- استخدم Signed Upload في الإنتاج؛ وقيود على `upload_preset` و`folder` والحجم والصيغ.
- تحقّق من نوع الملف والحجم على العميل والسيرفر.
- نفّذ Rate Limiting على نقاط النهاية.
- لا تخزن Base64 في القاعدة؛ خزّن `secure_url` ويفضّل `public_id` فقط.
- استخدم `next/image` أو تحوّلات Cloudinary للعرض (قصّ/تغيير حجم/صيغة WebP/AVIF).

---

## خطوات تشغيل سريعة

1) ضبط ENV لقيم Cloudinary
2) تثبيت الحزمة: `npm i cloudinary`
3) إضافة تهيئة `src/lib/cloudinary.ts`
4) إنشاء مسار توقيع (أو مسار رفع عبر السيرفر)
5) استخدام المكوّن `CloudinaryUploader` في الواجهة
6) إرسال `image` داخل النموذج وتخزينه في القاعدة

أوامر مفيدة:
```bash
npm run dev            # تشغيل التطوير
npm run build          # البناء للإنتاج
npx prisma generate    # توليد Prisma Client
npx prisma migrate dev --name add-image-field   # إنشاء/تطبيق هجرة (إن لزم)
```

---

## استكشاف الأخطاء الشائعة

- لا يتم إنشاء روابط؟ تأكد من صحة ENV وصلاحيات Upload Preset.
- فشل XHR؟ راقب استجابة Cloudinary والتوقيع والـ folder.
- تحذير ESLint حول `<img>`؟ استبدل بـ `next/image` لتحسين الأداء.
- على ويندوز EPERM مع Prisma؟ أوقف عمليات Node ثم:
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

---

## خلاصة

استخدم الرفع الموقّع من العميل إلى Cloudinary لتقليل حمل السيرفر وتحسين الأمان، خزّن فقط `secure_url` و`public_id`، وادمج الرفع في أي نموذج بإضافة حقل مخفي وإرسال الرابط مع حقولك المعتادة. هذا الدليل يحتوي الأكواد الجاهزة لإعادة الاستخدام في أي مشروع.


