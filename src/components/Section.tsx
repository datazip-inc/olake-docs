import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    className?: string;
    id?: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ className = "", id, children, ...props }) => (
    <section id={id} className={className} {...props}>
        {children}
    </section>
);

export default Section; 