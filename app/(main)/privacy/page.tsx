export default function PrivacyPage() {
  return (
    <div className="pt-24 px-4 md:px-14 min-h-screen text-white/80 max-w-4xl mx-auto pb-20">
      <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">Privacy Policy</h1>
      
      <div className="space-y-6 text-sm md:text-base leading-relaxed">
        <p>
          At <strong>AniXFlix</strong>, we are committed to protecting your privacy. This policy outlines our practices regarding data collection and usage on this demonstration platform.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Collection</h2>
        <p>
          We only collect essential information required for authentication and managing your custom profiles. This includes your email address (if provided during signup) and any profile names or avatars you configure.
        </p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Usage</h2>
        <p>
          Your data is used strictly to provide the core functionality of the platform, such as syncing your watchlist and history across devices. We do not sell, trade, or otherwise transfer your personal information to outside parties.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Cookies and Local Storage</h2>
        <p>
          AniXFlix utilizes secure cookies and browser Local Storage to maintain your session state, remember your active profile, and optimize performance (e.g., caching recent views). By using this site, you consent to the use of these standard web technologies.
        </p>
      </div>
    </div>
  );
}