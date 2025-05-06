import React from 'react';

export default function SpaceGroteskDemo(): JSX.Element {
    return (
        <div className="p-6 rounded-lg shadow-md max-w-3xl mx-auto my-8">
            <h2 className="text-3xl font-bold mb-4 font-space-grotesk">Space Grotesk Font Demo</h2>

            <div className="grid gap-4">
                <div className="p-4 border rounded">
                    <h3 className="text-xl mb-2 font-space-grotesk font-light">Space Grotesk Light (300)</h3>
                    <p className="font-space-grotesk font-light">
                        This text is displayed using Space Grotesk with font weight 300 (Light).
                    </p>
                </div>

                <div className="p-4 border rounded">
                    <h3 className="text-xl mb-2 font-space-grotesk font-normal">Space Grotesk Regular (400)</h3>
                    <p className="font-space-grotesk font-normal">
                        This text is displayed using Space Grotesk with font weight 400 (Regular).
                    </p>
                </div>

                <div className="p-4 border rounded">
                    <h3 className="text-xl mb-2 font-space-grotesk font-medium">Space Grotesk Medium (500)</h3>
                    <p className="font-space-grotesk font-medium">
                        This text is displayed using Space Grotesk with font weight 500 (Medium).
                    </p>
                </div>

                <div className="p-4 border rounded">
                    <h3 className="text-xl mb-2 font-space-grotesk font-semibold">Space Grotesk SemiBold (600)</h3>
                    <p className="font-space-grotesk font-semibold">
                        This text is displayed using Space Grotesk with font weight 600 (SemiBold).
                    </p>
                </div>

                <div className="p-4 border rounded">
                    <h3 className="text-xl mb-2 font-space-grotesk font-bold">Space Grotesk Bold (700)</h3>
                    <p className="font-space-grotesk font-bold">
                        This text is displayed using Space Grotesk with font weight 700 (Bold).
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <p className="text-sm text-gray-600">
                    Note: The entire site is now using Space Grotesk as its primary font via the default font family configuration.
                    The above examples demonstrate explicit usage with Tailwind classes.
                </p>
            </div>
        </div>
    );
} 