import React from "react";

export default function WorkflowSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="text-blue-600 font-semibold text-sm mb-2">The Fundamental</div>
          <h2 className="text-4xl md:text-5xl font-light text-gray-900">
            Experience the most <br className="md:hidden" />
            <span className="font-normal">seamless <span className="font-bold">workflow</span></span>
          </h2>
        </div>
        {/* Stepper */}
        <div className="flex justify-center items-center gap-2 mb-12">
          <div className="flex items-center">
            <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
              Sources
            </div>
            <div className="w-8 h-1 bg-gray-200 mx-1 rounded" />
          </div>
          <div className="flex items-center">
            <div className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full font-medium text-sm shadow">
              OLake
            </div>
            <div className="w-8 h-1 bg-gray-200 mx-1 rounded" />
          </div>
          <div className="flex items-center">
            <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
              Destinations
            </div>
            <div className="w-8 h-1 bg-gray-200 mx-1 rounded" />
          </div>
          <div className="flex items-center">
            <div className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm">
              Iceberg Catalogs
            </div>
            <div className="w-8 h-1 bg-gray-200 mx-1 rounded" />
          </div>
          <div className="flex items-center">
            <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
              Query Engines
            </div>
          </div>
        </div>
        {/* Cards Row */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          {/* Sources Card */}
          <div className="flex-1 bg-blue-50 rounded-3xl p-6 flex flex-col items-center shadow-sm min-w-[220px]">
            <div className="text-xs text-gray-500 mb-2">120+ Fast & Secure Connectors</div>
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              <div className="absolute left-0 top-0 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow">
                {/* Main icon (MongoDB placeholder) */}
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
              </div>
              {/* Other icons (Postgres, MySQL) */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /></svg>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /></svg>
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-1">Sources</div>
            <div className="text-xs text-gray-500 text-center">Access databases, files, web pages, or even real-time data streams</div>
          </div>
          {/* OLake Card */}
          <div className="flex-1 bg-gradient-to-b from-blue-100 to-blue-200 rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm min-w-[180px]">
            <div className="text-2xl font-bold text-blue-700 mb-2">OLake</div>
            <div className="text-sm text-gray-600">Managed Lakehouse</div>
          </div>
          {/* Destinations Card */}
          <div className="flex-1 bg-blue-50 rounded-3xl p-6 flex flex-col items-center shadow-sm min-w-[220px]">
            <div className="text-lg font-semibold text-gray-800 mb-4">Destinations</div>
            <div className="flex flex-col gap-3 items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
                <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
              </div>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
                <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" /></svg>
              </div>
            </div>
          </div>
          {/* Iceberg Catalogs Card */}
          <div className="flex-1 bg-blue-50 rounded-3xl p-6 flex flex-col items-center shadow-sm min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
              <span className="text-lg font-semibold text-gray-800">Iceberg Catalogs</span>
            </div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <div className="bg-white rounded-lg px-4 py-2 text-gray-700 font-medium shadow text-center">AWS Glue</div>
              <div className="bg-white rounded-lg px-4 py-2 text-gray-700 font-medium shadow text-center">Hive</div>
              <div className="bg-white rounded-lg px-4 py-2 text-gray-700 font-medium shadow text-center">Rest Catalog</div>
              <div className="bg-white rounded-lg px-4 py-2 text-gray-700 font-medium shadow text-center">JDBC</div>
            </div>
          </div>
          {/* Query Engines Card */}
          <div className="flex-1 bg-blue-50 rounded-3xl p-6 flex flex-col items-center shadow-sm min-w-[220px]">
            <div className="text-lg font-semibold text-gray-800 mb-4">Query Engines</div>
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-white rounded-lg px-3 py-2 flex flex-col items-center shadow">
                <svg className="w-6 h-6 text-orange-500 mb-1" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                <span className="text-xs font-medium text-gray-700">Spark</span>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 flex flex-col items-center shadow">
                <svg className="w-6 h-6 text-purple-400 mb-1" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                <span className="text-xs font-medium text-gray-700">AWS Athena</span>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 flex flex-col items-center shadow">
                <svg className="w-6 h-6 text-pink-400 mb-1" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                <span className="text-xs font-medium text-gray-700">Trino</span>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 flex flex-col items-center shadow">
                <svg className="w-6 h-6 text-yellow-500 mb-1" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                <span className="text-xs font-medium text-gray-700">Duck DB</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">And many more</div>
          </div>
        </div>
      </div>
    </section>
  );
} 