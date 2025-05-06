import React from 'react';

interface SVGItem {
    image: string;
    width: number;
    height: number;
}

const InfoBoxes: React.FC = () => {
    // Define each SVG with its exact pixel dimensions
    const svgItems: SVGItem[] = [
        {
            image: '120+.svg',
            width: 400,
            height: 400
        },
        {
            image: 'managed-lakehouse.svg',
            width: 400,
            height: 400
        },
        {
            image: 'destinations.svg',
            width: 450,
            height: 450
        },
        {
            image: 'query-engine.svg',
            width: 400,
            height: 400
        }
    ];

    return (
        <div className="w-full overflow-hidden">
            <div className="w-full flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center">
                {svgItems.map((item, index) => (
                    <div
                        key={index}
                        className="w-full lg:w-auto flex-shrink-0 lg:flex-1 flex justify-center p-0 m-0"
                    >
                        <img
                            src={`/img/site/${item.image}`}
                            alt={`Workflow image ${index + 1}`}
                            className="w-full h-auto object-contain"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '400px'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfoBoxes; 