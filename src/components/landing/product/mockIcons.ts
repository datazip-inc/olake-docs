import type { IconType } from 'react-icons'
import {
  AiOutlineDown,
  AiOutlineEllipsis,
  AiOutlineExclamationCircle,
  AiOutlineQuestionCircle,
  AiOutlineRight,
  AiOutlineSearch
} from 'react-icons/ai'
import {
  PiArrowCounterClockwise,
  PiArrowDownBold,
  PiArrowRight,
  PiArrowSquareOut,
  PiArrowsInCardinal,
  PiArrowsMerge,
  PiCaretDown,
  PiChartDonut,
  PiCheck,
  PiCheckCircle,
  PiColumnsPlusRight,
  PiDotLight,
  PiDotsThree,
  PiFolder,
  PiGitCommit,
  PiGithubLogo,
  PiGridFour,
  PiPencilSimple,
  PiPlugs,
  PiPlus,
  PiQuestion,
  PiSidebarSimple,
  PiSliders,
  PiSlidersHorizontal,
  PiSpinner,
  PiTable,
  PiWarningCircle
} from 'react-icons/pi'

/**
 * The mock-ups' icons as react-icons, keyed by the name MockIcon takes. Each is the Phosphor (or, for
 * the Ant Design parts of the OLake UI, Ant Design) icon the design used, cropped by `viewBox` to
 * the same box as the design's export and drawn in its colour; `rotate` turns one drawn sideways.
 * Names missing here (the checkboxes) still load their exported image.
 */
export const MOCK_ICONS: Record<
  string,
  { icon: IconType; color: string; viewBox: string; rotate?: number }
> = {
  'go/dashboard-git-commit': {
    icon: PiGitCommit,
    color: '#000',
    viewBox: '0 1.07 254.31 254.31'
  },
  'go/dashboard-highlight-actions': {
    icon: PiDotsThree,
    color: '#8d8d8d',
    viewBox: '48 116 159.74 23.96'
  },
  'go/dashboard-highlight-check': {
    icon: PiCheck,
    color: '#52c41a',
    viewBox: '0.74 -0.01 252.83 252.83'
  },
  'go/dashboard-plus': {
    icon: PiPlus,
    color: '#f0f0f0',
    viewBox: '0.63 0.63 254.96 254.96'
  },
  'go/dashboard-row-actions': {
    icon: PiDotsThree,
    color: '#000',
    viewBox: '-305.19 0.1 864.68 255.71'
  },
  'go/dashboard-row-check': {
    icon: PiCheck,
    color: '#389e0d',
    viewBox: '0.33 0.67 255.02 255.02'
  },
  'go/dashboard-sidebar-help': {
    icon: PiQuestion,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '0 0 255.55 255.55'
  },
  'go/dashboard-sidebar-jobs': {
    icon: PiArrowsMerge,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '8 8 255.55 255.55',
    rotate: -90
  },
  'go/dashboard-sidebar-settings': {
    icon: PiSliders,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '-0.26 -0.02 255.71 255.71'
  },
  'go/dashboard-sidebar-sparkle': {
    icon: PiArrowsInCardinal,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '16 16 223.61 223.61'
  },
  'go/dashboard-sidebar-toggle': {
    icon: PiSidebarSimple,
    color: 'rgba(0, 0, 0, 0.45)',
    viewBox: '0 0 255.55 255.55'
  },
  'go/feature-chunking-dot': {
    icon: PiDotLight,
    color: '#d9d9d9',
    viewBox: '118 118 20.13 20.13'
  },
  'go/feature-mock-pencil': {
    icon: PiPencilSimple,
    color: '#000',
    viewBox: '0.59 0.96 253.89 253.89'
  },
  'go/feature-mock-search': {
    icon: AiOutlineSearch,
    color: 'rgba(0, 0, 0, 0.88)',
    viewBox: '60.15 60.15 898 898'
  },
  'go/feature-mock-tab-config': {
    icon: PiSlidersHorizontal,
    color: '#203fdd',
    viewBox: '0.59 -0.57 252.84 252.84'
  },
  'go/feature-mock-tab-partitioning': {
    icon: PiGridFour,
    color: '#000',
    viewBox: '1.95 1.95 248.91 248.91'
  },
  'go/feature-mock-tab-schema': {
    icon: PiColumnsPlusRight,
    color: '#000',
    viewBox: '1.67 0.86 250.7 250.7'
  },
  'go/feature-panel-pencil': {
    icon: PiPencilSimple,
    color: '#000',
    viewBox: '0.33 0.67 254.12 254.12'
  },
  'go/feature-panel-search': {
    icon: AiOutlineSearch,
    color: 'rgba(0, 0, 0, 0.88)',
    viewBox: '65.28 65.28 890.35 890.35'
  },
  'go/feature-panel-sidebar-help': {
    icon: PiQuestion,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '-0.68 0.5 255.47 255.47'
  },
  'go/feature-panel-sidebar-jobs': {
    icon: PiArrowsMerge,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '8.79 7.33 255.38 255.38',
    rotate: -90
  },
  'go/feature-panel-sidebar-settings': {
    icon: PiSliders,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '0.28 0.31 255.15 255.15'
  },
  'go/feature-panel-sidebar-sparkle': {
    icon: PiArrowsInCardinal,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '16 16 224.26 224.26'
  },
  'go/feature-panel-sidebar-toggle': {
    icon: PiSidebarSimple,
    color: 'rgba(0, 0, 0, 0.45)',
    viewBox: '0.52 0.08 255.28 255.28'
  },
  'go/feature-resumable-arrow-ccw': {
    icon: PiArrowCounterClockwise,
    color: '#389e0d',
    viewBox: '0 0 256 256'
  },
  'go/feature-resumable-check-circle': {
    icon: PiCheckCircle,
    color: '#389e0d',
    viewBox: '0 0 256 256'
  },
  'go/feature-resumable-plugs': {
    icon: PiPlugs,
    color: '#bbbbbb',
    viewBox: '0 0 256 256'
  },
  'go/feature-resumable-table': {
    icon: PiTable,
    color: '#000',
    viewBox: '0 0 256 256'
  },
  'go/feature-schema-search': {
    icon: AiOutlineSearch,
    color: 'rgba(0, 0, 0, 0.88)',
    viewBox: '63.65 63.65 893.67 893.67'
  },
  'go/feature-schema-tab-config': {
    icon: PiSlidersHorizontal,
    color: '#0a0a0a',
    viewBox: '0.64 0.08 255.03 255.03'
  },
  'go/feature-schema-tab-partitioning': {
    icon: PiGridFour,
    color: '#000',
    viewBox: '-0.23 -0.23 255.59 255.59'
  },
  'go/feature-schema-tab-schema': {
    icon: PiColumnsPlusRight,
    color: '#203fdd',
    viewBox: '0 0.75 254.11 254.11'
  },
  'fusion/dashboard-caret': {
    icon: PiCaretDown,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '0.81 1.22 253.34 253.34'
  },
  'fusion/dashboard-nav-catalogs': {
    icon: PiFolder,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '1.57 0.74 253.76 253.76'
  },
  'fusion/dashboard-nav-compute': {
    icon: PiChartDonut,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '1.66 1.66 252.67 252.67'
  },
  'fusion/dashboard-nav-help': {
    icon: PiQuestion,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '0.26 0.26 255.76 255.76'
  },
  'fusion/dashboard-nav-ingestion': {
    icon: PiArrowsMerge,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '8.8 8.34 254.9 254.9',
    rotate: -90
  },
  'fusion/dashboard-nav-optimisation': {
    icon: PiArrowsInCardinal,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '0.16 0.16 255.96 255.96'
  },
  'fusion/dashboard-nav-settings': {
    icon: PiSliders,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '0.01 0.34 255.8 255.8'
  },
  'fusion/dashboard-nav-tables': {
    icon: PiTable,
    color: 'rgba(0, 0, 0, 0.88)',
    viewBox: '1.5 0.2 254.48 254.48'
  },
  'fusion/dashboard-search': {
    icon: AiOutlineSearch,
    color: 'rgba(0, 0, 0, 0.88)',
    viewBox: '67.83 67.83 888.34 888.34'
  },
  'fusion/dashboard-sidebar-toggle': {
    icon: PiSidebarSimple,
    color: 'rgba(0, 0, 0, 0.45)',
    viewBox: '0.28 0.47 255.51 255.51'
  },
  'fusion/dashboard-status-success': {
    icon: PiCheckCircle,
    color: '#52c41a',
    viewBox: '1.66 1.66 252.67 252.67'
  },
  'fusion/feature-config-caret': {
    icon: PiCaretDown,
    color: '#000',
    viewBox: '-0.37 0.8 253.77 253.77'
  },
  'fusion/feature-config-question': {
    icon: AiOutlineQuestionCircle,
    color: 'rgba(0, 0, 0, 0.45)',
    viewBox: '64 64 892.79 892.79'
  },
  'fusion/feature-config-select': {
    icon: AiOutlineRight,
    color: 'rgba(0, 0, 0, 0.88)',
    viewBox: '67.4 64.89 891.95 891.95'
  },
  'fusion/feature-config-table': {
    icon: PiTable,
    color: 'rgba(0, 0, 0, 0.88)',
    viewBox: '-0.43 -0.86 255.97 255.97'
  },
  'fusion/feature-decay-banner': {
    icon: PiCheckCircle,
    color: '#237804',
    viewBox: '0 0 256 256'
  },
  'fusion/feature-decay-done': {
    icon: PiCheckCircle,
    color: '#52c41a',
    viewBox: '0.4 0.4 255.45 255.45'
  },
  'fusion/feature-decay-pending': {
    icon: PiCheckCircle,
    color: '#a7a7a7',
    viewBox: '0.4 0.4 255.45 255.45'
  },
  'fusion/feature-tables-actions': {
    icon: AiOutlineEllipsis,
    color: '#000',
    viewBox: '-26.35 -31.59 1083.7 1083.7'
  },
  'fusion/feature-tables-arrow': {
    icon: PiArrowRight,
    color: '#52c41a',
    viewBox: '1.52 0.59 253.91 253.91'
  },
  'fusion/feature-tables-dropdown': {
    icon: AiOutlineDown,
    color: 'rgba(0, 0, 0, 0.88)',
    viewBox: '6.3 4.61 1015 1015'
  },
  'fusion/feature-tables-failed': {
    icon: PiWarningCircle,
    color: '#f5222d',
    viewBox: '0.13 0.13 255.67 255.67'
  },
  'fusion/feature-tables-running': {
    icon: PiSpinner,
    color: '#fa8c16',
    viewBox: '0.13 0.13 255.67 255.67'
  },
  'fusion/feature-tables-success': {
    icon: PiCheckCircle,
    color: '#52c41a',
    viewBox: '0.13 0.13 255.67 255.67'
  },
  'fusion/feature-tiers-failed': {
    icon: AiOutlineExclamationCircle,
    color: '#f5222d',
    viewBox: '-33.16 -33.16 1088.52 1088.52'
  },
  'fusion/feature-tiers-running': {
    icon: PiSpinner,
    color: '#fa8c16',
    viewBox: '1.45 1.45 252.69 252.69'
  },
  'fusion/feature-tiers-success': {
    icon: PiCheckCircle,
    color: '#52c41a',
    viewBox: '1.45 1.45 252.69 252.69'
  },
  'product/faq-arrow-closed': {
    icon: PiArrowDownBold,
    color: '#939393',
    viewBox: '0 0 256 256'
  },
  'product/faq-arrow-open': {
    icon: PiArrowDownBold,
    color: '#333333',
    viewBox: '0 0 256 256'
  },
  'product/icon-github': {
    icon: PiGithubLogo,
    color: '#fcfcfb',
    viewBox: '0 0 256 256'
  },
  'product/link-arrow-square-out': {
    icon: PiArrowSquareOut,
    color: '#fff',
    viewBox: '0 0 256 256'
  },
  'product/mock-sidebar-help': {
    icon: PiQuestion,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '-0.99 0.48 254.09 254.09'
  },
  'product/mock-sidebar-jobs': {
    icon: PiArrowsMerge,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '9.68 8.51 253.75 253.75',
    rotate: -90
  },
  'product/mock-sidebar-settings': {
    icon: PiSliders,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '0.12 -0.49 255.29 255.29'
  },
  'product/mock-sidebar-sparkle': {
    icon: PiArrowsInCardinal,
    color: 'rgba(0, 0, 0, 0.65)',
    viewBox: '16 16 224.36 224.36'
  },
  'product/mock-sidebar-toggle': {
    icon: PiSidebarSimple,
    color: 'rgba(0, 0, 0, 0.45)',
    viewBox: '0.47 0.29 254.25 254.25'
  },
  'product/status-failed': {
    icon: AiOutlineExclamationCircle,
    color: '#f5222d',
    viewBox: '-32.21 -32.21 1088.43 1088.43'
  },
  'product/status-running': {
    icon: PiSpinner,
    color: '#fa8c16',
    viewBox: '1.66 1.66 252.67 252.67'
  }
}
