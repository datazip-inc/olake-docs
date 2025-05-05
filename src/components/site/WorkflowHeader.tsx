import React from 'react';

interface WorkflowHeaderProps {
    subtitle?: string;
    title?: React.ReactNode;
}

const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
    subtitle = 'The Fundamental',
    title = (
        <>
            Experience the most <br className="hidden sm:block md:hidden lg:block" />
            seamless <span className="text-gray-700 dark:text-gray-300">workflow</span>
        </>
    ),
}) => {
    return (
        <div className="text-center max-w-4xl mx-auto mb-16">
            <h3 className="text-blue-600 font-medium text-lg mb-4">{subtitle}</h3>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                {title}
            </h2>
        </div>
    );
};

export default WorkflowHeader; 