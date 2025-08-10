
export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-16 md:py-24 min-h-[80vh]">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Hi Mo&apos;Saeed
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          Welcome to our services platform
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
          Get Started
        </button>
        <button className="px-8 py-3 border border-border rounded-lg hover:bg-accent transition-colors">
          Learn More
        </button>
      </div>
    </section>
  );
}
