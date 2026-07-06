export default function DmcaPage() {
  return (
    <div className="pt-24 px-4 md:px-14 min-h-screen text-white/80 max-w-4xl mx-auto pb-20">
      <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-4">DMCA Takedown Notice</h1>
      
      <div className="space-y-6 text-sm md:text-base leading-relaxed">
        <p>
          <strong>AniXFlix</strong> is a demonstration project and does not host any video files on its own servers. All video content is embedded from third-party services and APIs.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Copyright Infringement</h2>
        <p>
          We respect the intellectual property rights of others. If you believe your copyrighted work has been infringed, please direct your DMCA takedown requests to the third-party video hosts that actually store the files.
        </p>
        
        <p>
          As we do not host the files, we cannot remove them from the source servers. However, we are committed to promptly removing links to infringing content upon receiving a valid notification.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Notification Process</h2>
        <p>
          To file a notice, please provide a written communication that includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled.</li>
          <li>Information reasonably sufficient to permit us to contact the complaining party.</li>
        </ul>

        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <p className="font-bold text-white mb-2">Contact for DMCA Requests</p>
          <p>Email: legal@anixflix.com (Example Demo Email)</p>
        </div>
      </div>
    </div>
  );
}