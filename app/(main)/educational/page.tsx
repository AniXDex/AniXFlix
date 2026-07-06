export default function EducationalPage() {
  return (
    <div className="pt-24 px-4 md:px-14 min-h-screen text-white/80 max-w-4xl mx-auto pb-20">
      <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">Educational Purpose Notice</h1>
      
      <div className="space-y-6 text-sm md:text-base leading-relaxed">
        <p>
          This website, <strong>AniXFlix</strong>, is a strictly educational and demonstrational project. It was created to showcase modern web development techniques, responsive UI/UX design, and API integrations using Next.js.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Non-Commercial Status</h2>
        <p>
          This project is not a commercial product. We do not charge subscriptions, run advertisements for profit, or generate any revenue from this platform. It serves solely as a portfolio piece for software engineering.
        </p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data & Content</h2>
        <p>
          All movie and television metadata (titles, descriptions, posters, and backdrops) is retrieved dynamically from free, public APIs (such as TMDB) under their respective API terms of service. Video streaming functionality is simulated using third-party embed URLs that we do not control or host.
        </p>
      </div>
    </div>
  );
}