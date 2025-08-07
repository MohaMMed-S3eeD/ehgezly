"use client";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1>Hi Mo&apos;Saeed</h1>

      <div className="flex gap-4 mt-6">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          تسجيل الدخول
        </Link>
        <Link
          href="/register"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
        >
          إنشاء حساب
        </Link>
      </div>
    </section>
  );
}
