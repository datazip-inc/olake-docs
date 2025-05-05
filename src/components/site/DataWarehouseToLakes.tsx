import React from 'react';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';

const DataWarehouseToLakes: React.FC = () => {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="container mx-auto">
                <HeroSection />
                <StatsSection />
            </div>
        </section>
    );
};

export default DataWarehouseToLakes; 