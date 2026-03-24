"use client";

import { useState, useEffect } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  if (!url) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20-\%20Léelo\%20aquí:%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-6 border-y border-gray-200 mt-12 mb-8 bg-gray-50/50 rounded-xl px-6">
      <span className="text-sm font-sans font-bold text-gray-500 uppercase tracking-wider">
        Compartir esta noticia:
      </span>
      <div className="flex items-center gap-3">
        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-full text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 0C5.405 0 0 5.405 0 12.031c0 2.115.549 4.161 1.597 5.975L.085 24l6.196-1.621C8.038 23.36 10.013 23.93 12.031 23.93c6.626 0 12.031-5.405 12.031-12.031S18.657 0 12.031 0zm3.846 17.514c-.655.188-1.745-.373-3.613-1.423-1.871-1.047-3.085-3.064-3.177-3.193-.092-.131-2.046-2.731-2.046-5.187 0-1.78.919-2.734 1.258-3.078.291-.295.74-.374 1.134-.374.394 0 .741.01.996.01.314-.01.716-.134 1.121.848.337.822 1.121 2.766 1.222 2.973.101.206.182.494.01.758-.172.264-.265.419-.526.711-.261.291-.538.643-.787.892-.284.285-.595.6-.282 1.135.313.535 1.396 2.302 2.992 3.731 2.064 1.849 3.824 2.404 4.364 2.624.54.22 1.15.111 1.488-.236.417-.428.986-1.168 1.439-1.579.351-.318.892-.387 1.398-.198 1.64.618 3.511 1.674 3.733 1.776.221.101.458.151.58.335.122.183.122 1.053-.532 1.241z"/>
          </svg>
          WhatsApp
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-full text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-[140px] justify-center relative overflow-hidden"
        >
          {copied ? (
            <span className="animate-fade-in text-green-700">¡Copiado!</span>
          ) : (
            <>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Copiar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
