import React from "react";

export interface SectionItem {
  title: string;
  description: string;
  image?: string;
}

export interface AlternatingRowsProps {
  items: SectionItem[];
}

const AlternatingRows: React.FC<AlternatingRowsProps> = ({ items }) => {
  return (
    <div className="space-y-12 gap-[20px]">
      {items.map((item, index) => {
        // For desktop: use flex-row for even items, and flex-row-reverse for odd items.
        const rowOrder = index % 2 === 1 ? "md:flex-row-reverse" : "";
        return (
          <div
            key={index}
            className={`flex flex-col md:flex-row ${rowOrder} items-center`}
          >
            {/* Text block: occupies 40% width on desktop, full width on mobile */}
            <div className="w-full md:w-2/5 p-4">
              <h2 className="md:text-[40px] font-light">{item.title}</h2>
              <p className="mt-2 text-[14px] text-[#7a7a7a]">{item.description}</p>
            </div>
            {/* Image block: occupies 60% width on desktop, full width on mobile */}
            <div className="w-full md:w-3/5 p-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto object-cover"
                loading="lazy" decoding="async"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlternatingRows;
