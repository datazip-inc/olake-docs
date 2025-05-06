import React from 'react';

const WorkflowDiagram: React.FC = () => {
    return (
        <div className="w-full overflow-hidden mb-12">
            <div className="w-full flex justify-center">
                <div className="w-full max-w-6xl mx-auto relative">
                    {/* On mobile, we scale the SVG up to zoom in and make it scrollable */}
                    <div className="w-full lg:hidden overflow-x-auto">
                        <div className="min-w-[800px]">
                            <img
                                src="/img/site/timeline.svg"
                                alt="Workflow timeline"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>

                    {/* On desktop, we show it at normal size */}
                    <div className="hidden lg:block">
                        <img
                            src="/img/site/timeline.svg"
                            alt="Workflow timeline"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowDiagram; 