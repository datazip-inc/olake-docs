// src/components/Iceberg/QueryEngineLayout.tsx
import React from 'react';
import { FeatureCard, FeatureCardProps } from './FeatureCard';
import { InteractiveTable, InteractiveTableProps } from './InteractiveTable';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  CodeBracketIcon,
  LightBulbIcon,
  BookOpenIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export interface CodeExample {
  title: string;
  description?: string;
  language: string;
  // code?: string;
}

export interface UseCase {
  title: string;
  description: string;
  scenarios: string[];
  icon?: React.ReactNode;
}

export interface QueryEngineLayoutProps {
  title: string;
  description: string;
  features: FeatureCardProps[];
  tableData: InteractiveTableProps;
  // codeExamples?: CodeExample[];
  useCases: UseCase[];
  officialDocs: string;
  gettingStarted: string;
  additionalResources?: {
    label: string;
    url: string;
    type?: 'docs' | 'tutorial' | 'video' | 'blog';
  }[];
}

const resourceTypeStyles = {
  docs: {
    bg: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
    icon: 'text-blue-600 dark:text-blue-400',
    label: 'Documentation'
  },
  tutorial: {
    bg: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30',
    icon: 'text-green-600 dark:text-green-400',
    label: 'Tutorial'
  },
  video: {
    bg: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
    icon: 'text-purple-600 dark:text-purple-400',
    label: 'Video'
  },
  blog: {
    bg: 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30',
    icon: 'text-orange-600 dark:text-orange-400',
    label: 'Blog Post'
  }
};

export const QueryEngineLayout: React.FC<QueryEngineLayoutProps> = ({
  title,
  description,
  features,
  tableData,
  // codeExamples,
  useCases,
  officialDocs,
  gettingStarted,
  additionalResources
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with gradient background */}
        <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl font-bold mb-4 animate-fade-in">
              {title}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Feature Cards Section */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <SparklesIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Key Features
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </section>

        {/* Interactive Table Section */}
        <section className="mb-20">
          <InteractiveTable {...tableData} />
        </section>

        {/* Code Examples Section */}
        {/*<section className="mb-20">
          <div className="flex items-center mb-8">
            <CodeBracketIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Code Examples
            </h2>
          </div>
           <div className="space-y-6">
            {codeExamples.map((example, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl bg-gray-900 shadow-xl">
                <div className="bg-gradient-to-r from-gray-800 to-gray-850 px-6 py-4 border-b border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {example.title}
                      </h3>
                      {example.description && (
                        <p className="text-sm text-gray-400 mt-1">
                          {example.description}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
                      {example.language}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <SyntaxHighlighter
                    language={example.language}
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '14px',
                      padding: '1.5rem'
                    }}
                    showLineNumbers={true}
                    lineNumberStyle={{
                      minWidth: '3em',
                      paddingRight: '1em',
                      color: '#4a5568',
                      userSelect: 'none'
                    }}
                  >
                    {example.code}
                  </SyntaxHighlighter>
                  <button className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div> 
        </section>*/}

        {/* Use Cases Section */}
        <section className="mb-20">
          <div className="flex items-center mb-8">
            <LightBulbIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Use Cases
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, idx) => (
              <div 
                key={idx} 
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-8">
                  <div className="flex items-start space-x-4 mb-4">
                    {useCase.icon || (
                      <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                        <LightBulbIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 ml-16">
                    {useCase.scenarios.map((scenario, sIdx) => (
                      <li key={sIdx} className="flex items-start">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-1.5 mr-3"></span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {scenario}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-10 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-8">
              <BookOpenIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Resources & Documentation
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Primary Resources */}
              <a
                href={officialDocs}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <BookOpenIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Official Documentation
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete API reference and guides
                </p>
              </a>
              
              <a
                href={gettingStarted}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                    <SparklesIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  Getting Started Guide
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quick start tutorials and examples
                </p>
              </a>

              {/* Additional Resources */}
              {additionalResources?.map((resource, idx) => {
                const style = resourceTypeStyles[resource.type || 'docs'];
                return (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative overflow-hidden rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${style.bg}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {resource.label}
                        </h4>
                        <p className={`text-xs font-medium ${style.icon}`}>
                          {style.label}
                        </p>
                      </div>
                      <ArrowTopRightOnSquareIcon className={`w-5 h-5 ${style.icon} opacity-60 group-hover:opacity-100 transition-all`} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};