import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import XLogo from '@site/static/img/logo/x.svg';

interface LinkItem {
    label: string;
    href: string;
}

interface SocialLinkItem {
    icon: 'linkedin' | 'youtube' | 'slack' | 'instagram' | 'twitter';
    href: string;
    ariaLabel: string;
}

const Footer: React.FC = () => {
    const { colorMode } = useColorMode();
    const isDarkTheme = colorMode === 'dark';

    const companyLinks: LinkItem[] = [
        { label: 'About us', href: '/about-us' },
        { label: 'Contact us', href: '/contact' },
        { label: 'Branding', href: '/branding' },
        { label: 'Terms of Use', href: '/terms-of-use' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
    ];

    const resourceLinks: LinkItem[] = [
        { label: 'Blogs', href: '/blog' },
        { label: 'Docs', href: '/docs' },
        { label: 'Search', href: '/search' },
        // { label: 'Slack Archive', href: '/slack-archive' },
    ];

    const topReadLinks: LinkItem[] = [
        { label: 'Issues with Debezium', href: '/blog/issues-debezium-kafka' },
        { label: 'OLake Architecture', href: '/blog/olake-architecture' },
    ];

    const socialLinks: SocialLinkItem[] = [
        { icon: 'linkedin', href: 'https://www.linkedin.com/company/datazipio/', ariaLabel: 'Linkedin logo' },
        { icon: 'youtube', href: 'https://www.youtube.com/@olakeio', ariaLabel: 'Youtube logo' },
        { icon: 'slack', href: 'https://olake.io/slack', ariaLabel: 'Slack logo' },
        { icon: 'instagram', href: 'https://instagram.com/olake_io', ariaLabel: 'Instagram logo' },
        { icon: 'twitter', href: 'https://x.com/_olake', ariaLabel: 'Twitter' },
    ];

    const getSocialIconSrc = (icon: SocialLinkItem['icon']): string => {
        switch (icon) {
            case 'linkedin':
                return '/img/footer/linkedin.svg';
            case 'youtube':
                return '/img/footer/youtube.svg';
            case 'slack':
                return '/img/footer/slack.svg';
            case 'instagram':
                return '/img/footer/instagram.svg';
            case 'twitter':
                return '/img/footer/x.svg';
            default:
                return '';
        }
    };

    return (
        <footer className="py-12 bg-gradient-to-br from-[#F5F4FE] to-[#E3E1FF] dark:bg-gray-900 dark:from-gray-900 dark:to-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                    {/* Logo and Social Links Section */}
                    <div className="col-span-1 md:col-span-3">
                        <div className="mb-6">
                            <Link to="/" className="text-xl  text-blue-600 dark:text-blue-400">OLake</Link>
                            <h2 className="text-5xl font-extralight mt-6 mb-6 text-gray-800 dark:text-white">
                                Fastest<br />
                                Data<br />
                                Replication
                            </h2>
                        </div>

                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.icon}
                                    href={social.href}
                                    aria-label={social.ariaLabel}
                                    className="w-10 h-10 flex items-center justify-center rounded-md bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.icon === 'twitter' ? (
                                        <XLogo
                                            className="w-5 h-5 text-[#0F1419] dark:text-white"
                                            aria-hidden
                                        />
                                    ) : (
                                        <img
                                            src={getSocialIconSrc(social.icon)}
                                            alt={social.ariaLabel}
                                            className="w-5 h-5"
                                            loading="lazy" decoding="async"
                                        />
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links Section */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">COMPANY</h3>
                        <ul className="space-y-3 list-none p-0">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="hover:text-blue-500 transition-colors text-gray-600 dark:text-gray-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links Section */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">RESOURCES</h3>
                        <ul className="space-y-3 list-none p-0">
                            {resourceLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="hover:text-blue-500 transition-colors text-gray-600 dark:text-gray-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Top Reads Links Section */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">TOP READS</h3>
                        <ul className="space-y-3 list-none p-0">
                            {topReadLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="hover:text-blue-500 transition-colors text-gray-600 dark:text-gray-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Copyright © {new Date().getFullYear()} Datazip. All rights reserved.
                        <br />
                        Datazip, Inc. 16192 COASTAL HWY LEWES, DE 19958, USA
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 