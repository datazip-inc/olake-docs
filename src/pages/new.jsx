import React from "react";
import WorkflowSection from "../components/WorkflowSection";
import IcebergSection from "../components/IcebergSection";
import BenchmarksSection from "../components/BenchmarksSection";

export default function NewPage() {
  return (
    <div className="relative min-h-screen bg-white flex flex-col justify-between overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        {/* Left Content */}
        <div className="z-10 max-w-xl">
          {/* ICEBERG Badge */}
          <div className="inline-flex items-center mb-6">
            <span className="bg-blue-100 text-blue-700 font-semibold px-4 py-1 rounded-full text-sm flex items-center">
              Now Supporting
              <span className="ml-2 bg-white px-2 py-0.5 rounded text-blue-700 font-bold border border-blue-200">ICEBERG</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight">
            Fastest way to replicate your data from
            <br />
            <span className="font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 mt-2 flex items-center">
              Data
              <span className="mx-2 px-4 py-1 rounded-full bg-blue-100 text-blue-700 inline-flex items-center font-bold">
                Warehouse
                <span className="mx-2 text-blue-600 text-3xl">→</span>
                Data Lakes
              </span>
            </span>
          </h1>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <a
              href="mailto:contact@olake.io"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Talk to us
            </a>
            <a
              href="https://github.com/olakeio/olake"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-5 py-3 rounded-lg border border-gray-200 transition"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.922.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Live on Github. Contribute
            </a>
          </div>
        </div>

        {/* Right-side UI Mockup Placeholder */}
        <div className="hidden md:block flex-1 ml-8 relative">
          <div className="absolute right-0 top-0 w-[420px] h-[480px] bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-3xl shadow-2xl opacity-80 blur-lg" />
          <div className="absolute right-0 top-0 w-[420px] h-[480px] border-2 border-blue-200 rounded-3xl" />
        </div>
      </div>

      {/* OLake Advantage Section */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Get the OLake Advantage</h2>
          <a
            href="#"
            className="text-blue-600 hover:underline text-sm font-medium ml-2"
          >
            View all Performance Benchmarks
            <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 border-t border-b border-gray-200 py-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">3X</div>
            <div className="text-lg text-gray-500 mt-2">Faster</div>
          </div>
          <div className="hidden md:block h-12 border-l border-gray-200" />
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">70%</div>
            <div className="text-lg text-gray-500 mt-2">Savings</div>
          </div>
          <div className="hidden md:block h-12 border-l border-gray-200" />
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">3x</div>
            <div className="text-lg text-gray-500 mt-2">Less CPU</div>
          </div>
        </div>
      </div>

      <WorkflowSection />
      <IcebergSection />
      <BenchmarksSection />
    </div>
  );
}
