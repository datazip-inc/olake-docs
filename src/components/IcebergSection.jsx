import React from "react";

export default function IcebergSection() {
  return (
    <section className="relative py-20 flex flex-col items-center bg-transparent">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 w-full h-full flex justify-center items-start z-0">
        <div className="w-full max-w-6xl h-[420px] bg-gradient-to-br from-blue-200 via-blue-400 to-blue-700 rounded-[48px] mx-auto shadow-2xl overflow-hidden" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.95}}></div>
      </div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl px-4">
        {/* Badge */}
        <div className="mt-16 mb-6">
          <span className="inline-flex items-center bg-white/90 text-blue-700 font-semibold px-4 py-2 rounded-full text-sm shadow">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
            Exclusively for Apache Iceberg
          </span>
        </div>
        {/* Heading */}
        <h2 className="text-white text-4xl md:text-5xl font-bold text-center mb-16 drop-shadow-lg">
          Built on Iceberg.<br />Born for Scale.
        </h2>
        {/* Cards */}
        <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {/* Card 1 */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-xl flex flex-col items-start min-w-[260px] max-w-sm">
            <div className="w-full flex items-center mb-4">
              <div className="bg-gray-100 rounded-lg p-2 mr-3">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="2" /><path d="M8 12h8" /></svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Schema</span>
              <span className="mx-2 text-gray-400">→</span>
              <span className="text-sm font-semibold text-gray-700">Schema</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-2">Schema evolution</div>
            <div className="text-sm text-gray-500">Schema evolution allows you to modify your database schema without losing existing data. It enables seamless updates, such as adding new...</div>
          </div>
          {/* Card 2 */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-xl flex flex-col items-start min-w-[260px] max-w-sm">
            <div className="w-full flex items-center mb-4">
              <div className="bg-gray-100 rounded-lg p-2 mr-3">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2" /><text x="8" y="16" fontSize="6" fill="currentColor">id</text></svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Schema</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 rounded px-2 py-0.5">INT</span>
              <span className="mx-1 text-xs font-medium text-blue-600 bg-blue-50 rounded px-2 py-0.5">FLOAT</span>
              <span className="mx-1 text-xs font-medium text-blue-600 bg-blue-50 rounded px-2 py-0.5">DATE</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-2">Schema datatype changes</div>
            <div className="text-sm text-gray-500">Schema evolution allows you to modify your database schema without losing existing data. It enables seamless updates, such as adding new...</div>
          </div>
          {/* Card 3 */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-xl flex flex-col items-start min-w-[260px] max-w-sm">
            <div className="w-full flex items-center mb-4">
              <div className="bg-gray-100 rounded-lg p-2 mr-3">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="8" width="12" height="8" rx="2" /><path d="M12 8v8" /><circle cx="12" cy="12" r="2" /></svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Database</span>
              <span className="mx-2 text-gray-400">→</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 rounded px-2 py-0.5">Partition I</span>
              <span className="mx-1 text-xs font-medium text-blue-600 bg-blue-50 rounded px-2 py-0.5">Partition II</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-2">Partitioning and partition evolution</div>
            <div className="text-sm text-gray-500">Schema evolution allows you to modify your database schema without losing existing data. It enables seamless updates, such as adding new...</div>
          </div>
        </div>
      </div>
    </section>
  );
} 