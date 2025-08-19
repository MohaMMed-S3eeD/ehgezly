import React from "react";
import Form from "./_components/Form";

const Page = () => {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4  dark:from-neutral-950 dark:to-neutral-900">
      <div dir="rtl" className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md shadow-xl">
        <div className="p-6 sm:p-8">
          <Form />
        </div>
      </div>
    </div>
  );
};

export default Page;
