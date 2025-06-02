import React from 'react';

const WorkflowDiagram: React.FC = () => {
    return (
        <div className="w-full container overflow-hidden mb-12">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-6xl mx-auto relative">
                    {/* On mobile, we scale the image down to fit the screen */}
                    <div className="w-full lg:hidden">
                        <img
                            src="/img/site/timeline.svg"
                            alt="Workflow timeline"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    {/* On desktop, we show it at normal size */}
                    <div className="hidden lg:block">
                        <img
                            src="/img/site/timeline.svg"
                            alt="Workflow timeline"
                            className="block mx-auto w-[80%] h-auto"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WorkflowDiagram; 