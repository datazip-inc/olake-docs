import React from 'react';
import WorkflowHeader from './WorkflowHeader';
import WorkflowDiagram from './WorkflowDiagram';
import InfoBoxes from './InfoBoxes';

const WorkflowSection: React.FC = () => {
    return (
        <section className="py-16 md:py-24 bg-white dark:bg-white">
            <div className="">
                <WorkflowHeader />
                <WorkflowDiagram />
                <InfoBoxes />
            </div>
        </section>
    );
};

export default WorkflowSection; 