import React from 'react';

interface WorkflowStepProps {
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
    label,
    icon,
    isActive = false,
    isFirst = false,
    isLast = false,
}) => {
    return (
        <div className="flex items-center">
            <div className={`
        flex flex-shrink-0 items-center justify-center rounded-full py-2 px-4
        ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}
        transition-colors
      `}>
                <span className="flex items-center">
                    {icon}
                    <span className="ml-2 font-medium">{label}</span>
                </span>
            </div>

            {!isLast && (
                <div className="mx-2 md:mx-4 h-px w-8 md:w-12 bg-gray-300 dark:bg-gray-700"></div>
            )}
        </div>
    );
};

interface WorkflowDiagramProps {
    steps?: Array<{
        label: string;
        icon: React.ReactNode;
        active?: boolean;
    }>
}

const WorkflowDiagram: React.FC<WorkflowDiagramProps> = ({
    steps = [
        {
            label: 'Sources',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            active: false
        },
        {
            label: 'OLake',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M12 8v8m-4-4h8"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                </svg>
            ),
            active: true
        },
        {
            label: 'Destinations',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M20 12V8h-4M4 12v4h4m4-8V4M4 8L8 4M4 16l4 4m12-4l-4 4m4-12l-4-4"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            active: false
        },
        {
            label: 'Iceberg Catalogs',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 6l-8 4-8-4m8 4v5"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            active: false
        },
        {
            label: 'Query Engines',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M3 10h18M3 14h18m-12-8h.01M3 18h.01M3 6h.01M15 18h.01M19 18h.01M11 18h.01M7 18h.01"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            active: false
        }
    ]
}) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-16">
            {steps.map((step, index) => (
                <WorkflowStep
                    key={index}
                    label={step.label}
                    icon={step.icon}
                    isActive={step.active}
                    isFirst={index === 0}
                    isLast={index === steps.length - 1}
                />
            ))}
        </div>
    );
};

export default WorkflowDiagram; 