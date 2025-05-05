import React from 'react';
import Layout from '@theme/Layout'


import DataWarehouseToLakes from '../components/site/DataWarehouseToLakes';
import WorkflowSection from '../components/site/WorkflowSection';
import IcebergHero from '../components/site/IcebergHero';
import BenchmarkSection from '../components/site/BenchmarkSection';
import FeatureShowcase from '../components/site/FeatureShowcase';
import SetupStepsSection from '../components/site/SetupStepsSection';
import RegistrationSection from '../components/site/RegistrationSection';
import BlogShowcase from '../components/site/BlogShowcase';

export default function New3Page(): React.ReactElement {
    return (
        <Layout
            title='OLake'
            description='Fastest Database to Data Lakehouse data replication tool, open sourced'
        >
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <DataWarehouseToLakes />
                <WorkflowSection />
                <SetupStepsSection />
                <FeatureShowcase />
                <IcebergHero />
                <BenchmarkSection />
                <BlogShowcase />
                <RegistrationSection />
            </div>
        </Layout>
    );
}
