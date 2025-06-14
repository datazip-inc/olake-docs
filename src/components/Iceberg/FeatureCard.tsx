// src/components/Iceberg/FeatureCard.tsx
import React, { useState } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export interface FeatureDetail {
  title: string;
  description: string;
  overviewContent?: {
    strengths: string[];
    limitations: string[];
    bestFor: string[];
  };
  technicalSpecs?: {
    category: string;
    items: {
      label: string;
      value: string;
      status?: 'available' | 'preview' | 'planned';
    }[];
  }[];
  codeExamples?: {
    title: string;
    language: string;
    code: string;
    description?: string;
  }[];
  architectureNotes?: {
    title: string;
    content: string;
    diagram?: string;
  }[];
  externalLinks?: {
    label: string;
    url: string;
    type?: 'docs' | 'blog' | 'video' | 'github';
  }[];
}

export interface FeatureCardProps {
  title: string;
  chip?: string;
  description: string;
  icon: React.ReactNode;
  details: FeatureDetail;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  score?: number; // 0-100
}

const colorClasses = {
  blue: {
    card: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
    border: 'border-blue-200/50 dark:border-blue-800/50',
    chip: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50',
    accent: 'from-blue-600 to-indigo-600'
  },
  green: {
    card: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
    border: 'border-green-200/50 dark:border-green-800/50',
    chip: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50',
    accent: 'from-green-600 to-emerald-600'
  },
  purple: {
    card: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
    border: 'border-purple-200/50 dark:border-purple-800/50',
    chip: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    icon: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50',
    accent: 'from-purple-600 to-pink-600'
  },
  orange: {
    card: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
    border: 'border-orange-200/50 dark:border-orange-800/50',
    chip: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
    icon: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50',
    accent: 'from-orange-600 to-amber-600'
  },
  red: {
    card: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20',
    border: 'border-red-200/50 dark:border-red-800/50',
    chip: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50',
    accent: 'from-red-600 to-rose-600'
  }
};

const tabIcons = {
  overview: ChartBarIcon,
  technical: CodeBracketIcon,
  architecture: DocumentTextIcon,
  resources: SparklesIcon
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  chip,
  description,
  icon,
  details,
  color = 'blue',
  score
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = colorClasses[color];

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={`
          relative group cursor-pointer rounded-2xl border-2 ${colors.border} ${colors.card} 
          p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
          backdrop-blur-sm overflow-hidden
        `}
      >
        {/* Background gradient effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        {/* Score indicator */}
        {score !== undefined && (
          <div className="absolute top-4 right-4 w-12 h-12">
            <svg className="transform -rotate-90 w-12 h-12">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${score * 1.26} 126`}
                className={`${colors.icon.split(' ')[0]} transition-all duration-700`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
              {score}
            </span>
          </div>
        )}
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${colors.icon} shadow-sm`}>
              {icon}
            </div>
            {chip && (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors.chip} shadow-sm`}>
                {chip}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
          
          <div className="mt-4 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Explore details</span>
            <ArrowTopRightOnSquareIcon className="w-3 h-3 ml-1" />
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl transition-all">
                  {/* Header */}
                  <div className={`relative bg-gradient-to-br ${colors.accent} p-8 text-white`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div>
                          <Dialog.Title className="text-3xl font-bold mb-2">
                            {details.title}
                          </Dialog.Title>
                          <p className="text-lg text-white/90 max-w-3xl">
                            {details.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                          onClick={() => setIsOpen(false)}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <Tab.Group>
                    <Tab.List className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-2">
                      {['overview', 'technical', 'architecture', 'resources'].map((tab) => {
                        const Icon = tabIcons[tab as keyof typeof tabIcons];
                        const hasContent = 
                          (tab === 'overview' && details.overviewContent) ||
                          (tab === 'technical' && details.technicalSpecs) ||
                          (tab === 'architecture' && details.architectureNotes) ||
                          (tab === 'resources' && details.externalLinks);
                        
                        if (!hasContent) return null;
                        
                        return (
                          <Tab
                            key={tab}
                            className={({ selected }) =>
                              `flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all
                              ${selected 
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                              }`
                            }
                          >
                            <Icon className="w-4 h-4" />
                            <span className="capitalize">{tab}</span>
                          </Tab>
                        );
                      })}
                    </Tab.List>
                    
                    <Tab.Panels className="p-8">
                      {/* Overview Tab */}
                      {details.overviewContent && (
                        <Tab.Panel className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
                              <h4 className="flex items-center text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
                                <CheckCircleIcon className="w-5 h-5 mr-2" />
                                Strengths
                              </h4>
                              <ul className="space-y-2">
                                {details.overviewContent.strengths.map((item, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-green-600 dark:text-green-400 mr-2 mt-0.5">•</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6">
                              <h4 className="flex items-center text-lg font-semibold text-amber-800 dark:text-amber-300 mb-4">
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                Limitations
                              </h4>
                              <ul className="space-y-2">
                                {details.overviewContent.limitations.map((item, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-amber-600 dark:text-amber-400 mr-2 mt-0.5">•</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                              <h4 className="flex items-center text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                Best For
                              </h4>
                              <ul className="space-y-2">
                                {details.overviewContent.bestFor.map((item, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Tab.Panel>
                      )}

                      {/* Technical Specs Tab */}
                      {details.technicalSpecs && (
                        <Tab.Panel className="space-y-6">
                          {details.technicalSpecs.map((spec, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                {spec.category}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {spec.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                      {item.label}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm text-gray-900 dark:text-gray-100">
                                        {item.value}
                                      </span>
                                      {item.status && (
                                        <span className={`
                                          px-2 py-0.5 text-xs rounded-full font-medium
                                          ${item.status === 'available' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                                            : item.status === 'preview'
                                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                          }
                                        `}>
                                          {item.status}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

                          {/* Code Examples */}
                          {details.codeExamples && (
                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Code Examples
                              </h4>
                              {details.codeExamples.map((example, idx) => (
                                <div key={idx} className="bg-gray-900 rounded-2xl overflow-hidden">
                                  <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-gray-300">{example.title}</span>
                                      <span className="text-xs text-gray-500">{example.language}</span>
                                    </div>
                                    {example.description && (
                                      <p className="text-xs text-gray-400 mt-1">{example.description}</p>
                                    )}
                                  </div>
                                  <pre className="p-4 overflow-x-auto">
                                    <code className="text-sm text-gray-300">{example.code}</code>
                                  </pre>
                                </div>
                              ))}
                            </div>
                          )}
                        </Tab.Panel>
                      )}

                      {/* Architecture Tab */}
                      {details.architectureNotes && (
                        <Tab.Panel className="space-y-6">
                          {details.architectureNotes.map((note, idx) => (
                            <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                {note.title}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                {note.content}
                              </p>
                              {note.diagram && (
                                <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl p-4">
                                  <pre className="text-xs text-gray-600 dark:text-gray-400">{note.diagram}</pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </Tab.Panel>
                      )}

                      {/* Resources Tab */}
                      {details.externalLinks && (
                        <Tab.Panel className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {details.externalLinks.map((link, idx) => {
                              const typeStyles = {
                                docs: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30',
                                blog: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30',
                                video: 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30',
                                github: 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70'
                              };
                              
                              return (
                                <a
                                  key={idx}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`
                                    flex items-center justify-between p-4 rounded-xl transition-all
                                    ${typeStyles[link.type || 'docs']}
                                    group
                                  `}
                                >
                                  <div>
                                    <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                      {link.label}
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {link.type || 'Documentation'}
                                    </p>
                                  </div>
                                  <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                </a>
                              );
                            })}
                          </div>
                        </Tab.Panel>
                      )}
                    </Tab.Panels>
                  </Tab.Group>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};