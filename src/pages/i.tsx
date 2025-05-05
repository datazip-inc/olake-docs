// src/pages/new-page.tsx
import React from 'react';
import Layout from '@theme/Layout'; // Docusaurus layout component

export default function NewPage(): React.ReactElement {

    return (
        <Layout
            // Title and description for SEO and browser tab
            title="OLake"
            description="OLake."
        >
            {/* Main container for the page content */}
            <main className="w-full container mx-auto px-8 sm:px-12 md:px-16 lg:px-24 py-10">
                {/* Render each SVG section directly */}

                {/* Section 1 */}
                <img
                    src='/img/site/1.svg' // Use correct index
                    alt="SVG Section 1"
                    className="w-full h-auto block"
                />

                {/* Section 2 */}
                <img
                    src='/img/site/2.svg'
                    alt="SVG Section 2"
                    className="w-full h-auto block"
                />

                {/* Section 3 */}
                <img
                    src='/img/site/3.svg'
                    alt="SVG Section 3"
                    className="w-full h-auto block"
                />

                {/* Section 4 */}
                <img
                    src='/img/site/4.svg'
                    alt="SVG Section 4"
                    className="w-full h-auto block"
                />

                {/* Section 5 */}
                <img
                    src='/img/site/5.svg'
                    alt="SVG Section 5"
                    className="w-full h-auto block"
                />

                {/* Section 6 */}
                <img
                    src='/img/site/6.svg'
                    alt="SVG Section 6"
                    className="w-full h-auto block"
                />

                {/* Section 7 */}
                <img
                    src='/img/site/7.svg'
                    alt="SVG Section 7"
                    className="w-full h-auto block"
                />

                {/* Section 8 */}
                <img
                    src='/img/site/8.svg'
                    alt="SVG Section 8"
                    className="w-full h-auto block"
                />

                {/* Section 9 */}
                <img
                    src='/img/site/9.svg'
                    alt="SVG Section 9"
                    className="w-full h-auto block"
                />

            </main>
        </Layout>
    );
}
