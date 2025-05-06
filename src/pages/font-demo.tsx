import React from 'react';
import Layout from '@theme/Layout';
import SpaceGroteskDemo from '../components/SpaceGroteskDemo';

export default function FontDemoPage(): JSX.Element {
    return (
        <Layout
            title="Space Grotesk Font Demo"
            description="Demonstration of the Space Grotesk font in the OLake documentation"
        >
            <div className="container margin-vert--lg">
                <div className="row">
                    <div className="col col--12">
                        <h1 className="font-space-grotesk text-4xl font-bold text-center mb-8">
                            Space Grotesk Font Demo
                        </h1>

                        <div className="mb-8">
                            <p className="text-lg mb-4">
                                This page demonstrates the integration of the Space Grotesk font from Google Fonts.
                                The font has been added to the project and can be used in two ways:
                            </p>

                            <ul className="list-disc pl-6 mb-4">
                                <li className="mb-2">As the default font for the entire site (already configured)</li>
                                <li className="mb-2">Explicitly using Tailwind classes (shown below)</li>
                            </ul>
                        </div>

                        <SpaceGroteskDemo />

                        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h2 className="text-2xl font-space-grotesk font-bold mb-4">
                                Font Implementation Details
                            </h2>

                            <p className="mb-2">The font was added to the project using these steps:</p>

                            <ol className="list-decimal pl-6">
                                <li className="mb-2">Created a <code>fonts.css</code> file to import the font from Google Fonts</li>
                                <li className="mb-2">Updated the main CSS file to use Space Grotesk as the primary font</li>
                                <li className="mb-2">Added the font to Tailwind configuration for class-based usage</li>
                                <li className="mb-2">Created a demo component to showcase different font weights</li>
                            </ol>

                            <p className="mt-4">
                                You can use this font throughout the project by either relying on the default font family
                                or by explicitly using the <code>font-space-grotesk</code> Tailwind class.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 