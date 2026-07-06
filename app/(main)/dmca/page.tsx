export default function DmcaPage() {
  return (
    <div className="pt-24 px-4 md:px-14 min-h-screen text-white/80 max-w-4xl mx-auto pb-20">
      <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">DMCA Takedown Notice</h1>
      
      <div className="space-y-6 text-sm md:text-base leading-relaxed">
        <p>
          <strong>AniXFlix</strong> is a demonstration project and acts purely as an automated search engine and indexer. We do <strong>NOT</strong> host, upload, or manage any video files, media, or content on our own servers.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Safe Harbor & No File Hosting</h2>
        <p>
          AniXFlix operates similarly to search engines like Google or Bing. All video content found via AniXFlix is embedded from third-party services and APIs. We have absolutely no control over the content hosted on these third-party servers. Any legal concerns regarding the media itself must be taken up with the actual file hosts and providers.
        </p>
        
        <p>
          Because we do not host any files, we cannot remove media from the source servers. However, we are fully committed to complying with the Digital Millennium Copyright Act (DMCA) and will promptly remove links/indexes to infringing content upon receiving a valid and complete notification.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Notification Process</h2>
        <p>
          To file a notice, please provide a written communication that includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-white/70">
          <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the material that is claimed to be infringing (including the exact URLs on our site) and that is to be removed.</li>
          <li>Information reasonably sufficient to permit us to contact the complaining party (email address).</li>
          <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
        </ul>

        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="font-bold text-white mb-2">Contact for DMCA Requests</p>
          <p className="text-white/60 text-sm mb-4">
            If you wish to submit a takedown request for an indexed link, please reach out via our GitHub repository.
          </p>
          <a href="https://github.com/anixdex" target="_blank" rel="noreferrer" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Contact on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}