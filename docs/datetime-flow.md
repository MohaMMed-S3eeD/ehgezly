## تصميم ومعالجة التاريخ والوقت (Slots)

هذه الوثيقة تشرح بالتفصيل كيف بنستقبل/نبعث التاريخ والوقت بين الواجهة (Client) والسيرفر وكيف بنخزّنها ونعرضها للمستخدم بصيغة 12 ساعة، مع تجنّب مشاكل اختلاف المناطق الزمنية وتغيّر التوقيت الصيفي.

- الهدف: المستخدم يختار وقت محلي بصيغة 12 ساعة، إحنا نخزن اللحظة الزمنية الصحيحة في قاعدة البيانات (UTC)، ولما نعرض نعرضها بصيغة 12 ساعة محليًا بدون انزلاق يوم.
- الاستراتيجية: نبعت من الواجهة `date` كـ `YYYY-MM-DD` ثابت محليًا + `startTime`/`endTime` كـ `HH:mm` + فروق التوقيت `tzOffset` و`tzOffsetStart` و`tzOffsetEnd`. على السيرفر نحوّلهم للحظة UTC ونخزن.

---

### 1) الواجهة: `src/app/providerDashboard/addSlot/[idService]/page.tsx`

الملف مسؤول عن:
- اختيار الوقت بصيغة 12 ساعة للمستخدم (عن طريق `TimeRangePicker`) لكن تخزين داخلي 24 ساعة (`HH:mm`) للاستقرار.
- إرسال التاريخ بصيغة محلية ثابتة `YYYY-MM-DD` لتجنب انزلاق اليوم عند التحويل إلى UTC.
- إرسال فروق التوقيت:
  - `tzOffset`: فرق التوقيت العام لليوم (بالدقائق) كـ fallback.
  - `tzOffsetStart` و`tzOffsetEnd`: فرق التوقيت محسوبين تحديدًا على لحظتي البداية والنهاية (لتغطية حالات تغيّر التوقيت الصيفي إن وُجد).

مقتطفات أساسية:

```tsx
// حقول خفية تُرسل مع الفورم
<input type="hidden" name="idService" value={idService} />

// نرسل التاريخ المحلي كثابت YYYY-MM-DD
<input
  type="hidden"
  name="date"
  value={
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
          date.getDate()
        ).padStart(2, "0")}`
      : ""
  }
/>

// فرق التوقيت العام لليوم
<input
  type="hidden"
  name="tzOffset"
  value={
    date
      ? String(
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            12, 0, 0, 0
          ).getTimezoneOffset()
        )
      : ""
  }
/>

// فروق التوقيت عند وقتي البداية والنهاية تحديدًا
<input type="hidden" name="tzOffsetStart" value={/* computed for start */} />
<input type="hidden" name="tzOffsetEnd" value={/* computed for end */} />

// الأوقات تُرسل بصيغة HH:mm (24 ساعة) — مُشتقة من اختيار 12 ساعة للمستخدم
<input type="hidden" name="startTime" value={startTime} />
<input type="hidden" name="endTime" value={endTime} />
```

تفكيك المنطق:
- `date`: إرسال محلي `YYYY-MM-DD` يمنع تغيّر اليوم بسبب تحويل `toISOString()` إلى UTC.
- `startTime`/`endTime`: بنخلي `TimeRangePicker` يحوّل اختيار 12 ساعة إلى `HH:mm` لتبسيط المعالجة على السيرفر.
- `tzOffset...`: نبعته بالدقائق (نفس معنى `getTimezoneOffset`) لتحويل محلي ⇒ UTC بدقة، مع دعم حالات تغيّر التوقيت (DST) عند البداية/النهاية.

---

### 2) السيرفر: `src/app/providerDashboard/_actions/Slot.action.ts`

المسؤوليات:
- التحقق من المدخلات (`zod`).
- parsing للتاريخ `YYYY-MM-DD` والوقت `HH:mm` محليًا.
- بناء اللحظات الزمنية UTC: نستخدم `Date.UTC(...) + tzOffsetMinutes * 60000` بدلًا من إنشاء `Date` محلية مباشرةً، عشان نضمن إن اللحظة اللي المستخدم قصدها محليًا تتحوّل صح إلى UTC.
- فحص التداخل (overlap) والتأكد إن نهاية الفترة بعد بدايتها.
- التخزين في قاعدة البيانات كـ `DateTime` (UTC).

مقتطفات أساسية:

```ts
// parsing التاريخ المحلي
const parseDateYMD = (dateStr: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  // تحقق من النطاقات
  return { year, month, day } as const;
};

// parsing الوقت المحلي HH:mm
const parseTime = (timeStr: string) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeStr);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  // تحقق من النطاقات
  return { hours, minutes } as const;
};

// اختيار فروق التوقيت (start/end) مع fallback لـ tzOffset العام
const tzOffsetStartMinutes = (/* ... */);
const tzOffsetEndMinutes = (/* ... */);

// بناء milliseconds UTC بإضافة offset (المحلي ⇒ UTC)
const startMsUTC = Date.UTC(
  ymd.year,
  ymd.month - 1,
  ymd.day,
  startParts.hours,
  startParts.minutes,
  0, 0,
) + tzOffsetStartMinutes * 60_000;

const endMsUTC = Date.UTC(
  ymd.year,
  ymd.month - 1,
  ymd.day,
  endParts.hours,
  endParts.minutes,
  0, 0,
) + tzOffsetEndMinutes * 60_000;

const startAt = new Date(startMsUTC);
const endAt = new Date(endMsUTC);
```

تفكيك المنطق:
- ليه `Date.UTC + offset`؟ لأن `Date.UTC` يبني قيمة زمنية UTC من دون اعتبار المنطقة، وإضافة `tzOffset` (بالدقائق) بتنقل اللحظة من التوقيت المحلي المقصود إلى UTC بدقة حتى لو فيه تغيّر DST.
- `tzOffsetStart/End`: نستخدمهم لو فيه اختلاف في الأوفست بين البداية والنهاية (في مناطق بتغيّر الأوفست أثناء اليوم)، ولو مش موجودين نرجع لـ `tzOffset` العام.
- التخزين كـ `DateTime` بيكون UTC دائمًا؛ ده القياسي مع Prisma/Postgres.

---

### 3) العرض: `src/app/providerDashboard/_components/PrevSlots.tsx`

المسؤوليات:
- جلب الـ slots للمزوّد.
- عرض التاريخ والوقت للمستخدم بصيغة 12 ساعة محليًا.

مقتطف أساسي:

```tsx
{new Date(slot.startTime).toLocaleString(undefined, {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})}
```

تفكيك المنطق:
- بنحوّل `Date` القادمة من الـ API إلى سلسلة محلية بصيغة 12 ساعة + التاريخ.
- لو عايزين نعرض الوقت فقط: نقدر نستخدم `toLocaleTimeString` بنفس الخيارات.

---

### 4) قاعدة البيانات: `prisma/schema.prisma`

التعريفات المهمة:

```prisma
model Slot {
  id        String   @id @default(cuid())
  startTime DateTime
  endTime   DateTime
  isBooked  Boolean  @default(false)
  service   Service  @relation(fields: [serviceId], references: [id])
  serviceId String
  booking   Booking?
}
```

ملاحظات:
- `DateTime` تُخزّن كـ لحظات UTC. ده يعني لو بصيت في الداتابيز مباشرة ممكن تشوف اليوم/الساعة مختلفة عن المحلي — ده طبيعي. الواجهة بتتعامل وتعرض محليًا.
- لو محتاج تشوف «اليوم المحلي» كما أدخله المستخدم داخل الداتابيز لأغراض تقارير/لوحات، ممكن نضيف حقول إضافية (مثل `localDate` و`localStartTime`/`localEndTime`) بدون ما نغيّر الاستراتيجية الأساسية لتخزين UTC.

---

### أسئلة شائعة وتفاصيل مهمة

- لماذا لا نستخدم `toISOString()` لإرسال التاريخ؟
  - لأنه يحوّل للتوقيت العالمي UTC وقد يغيّر اليوم بالنسبة للمستخدم (مثلًا +02:00 قد يتحوّل لليوم السابق في منتصف الليل).

- لماذا نرسل `tzOffsetStart` و`tzOffsetEnd`؟
  - لتغطية حالات تغيّر التوقيت الصيفي داخل نفس اليوم، حيث قد يختلف الأوفست في لحظة البداية عن النهاية.

- هل يمكن العرض دومًا بصيغة 12 ساعة؟
  - نعم، نستخدم `toLocaleString`/`toLocaleTimeString` مع `hour12: true`.

- لماذا نخزّن UTC بدل المحلي؟
  - UTC هو تمثيل وحيد لا يعتمد على المنطقة الزمنية، ما يسهّل المقارنات، الفرز، وفحوصات التداخل بشكل ثابت ودقيق.

---

### ملخص التدفق
1) الواجهة تجمع: `YYYY-MM-DD` + `HH:mm` للبداية والنهاية + `tzOffset` (+ `tzOffsetStart/End`).
2) السيرفر يحوّلهم للحظة UTC باستخدام `Date.UTC + offset`، ويتحقق من الصحة والتداخل.
3) التخزين يكون `DateTime` (UTC) في Prisma.
4) العرض للمستخدم بصيغة محلية 12 ساعة باستخدام دوال `toLocale...`.


