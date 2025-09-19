// src/components/Iceberg/index.ts

// Main layout components
export { QueryEngineLayout } from './QueryEngineLayout';
export type { QueryEngineLayoutProps, CodeExample, UseCase } from './QueryEngineLayout';

// Feature card with modal
export { FeatureCard } from './FeatureCard';
export type { FeatureCardProps, FeatureDetail } from './FeatureCard';

// Interactive table
export { InteractiveTable } from './InteractiveTable';
export type { InteractiveTableProps, TableColumn, TableRow } from './InteractiveTable';

// Status indicators
export { StatusIndicator } from './StatusIndicator';
export type { StatusLevel } from './StatusIndicator';


// Existing components (if any)
export { default as IcebergQueryEngines } from './IcebergQueryEngines';
export { default as FilterControls } from './FilterControls';
export { default as ViewTabs } from './ViewTabs';
export { default as TableView } from './TableView';
export { default as CardView } from './CardView';
export { default as FeatureView } from './FeatureView';
export { default as SupportIcon } from './SupportIcon';
export { default as CategoryBadge } from './CategoryBadge';