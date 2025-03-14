import React from 'react';
import Layout from '@theme/Layout'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaSlack, FaLinkedin } from 'react-icons/fa';

const ContactPage = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-center mb-10">Contact Us</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Contact Info Section */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <FaEnvelope className="text-2xl" />
                                        <a href="mailto:hello@olake.io" className="hover:underline">
                                            hello@olake.io
                                        </a>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <FaPhone className="text-2xl" />
                                        <a href="tel:+917978307903" className="hover:underline">
                                            +91 7978307903 | +91 9748485583
                                        </a>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <FaMapMarkerAlt className="text-2xl mt-1" />
                                        <div>
                                            <p className="font-semibold">Headquarters</p>
                                            <p>Datazip, Inc. 16192 COASTAL HWY LEWES, DE 19958, USA</p>
                                            <p className="font-semibold mt-2">Working Address</p>
                                            <p>2nd floor, Monte carlo building, 27th Main Rd, Parangi Palaya, Sector 2, HSR Layout, Bengaluru, Karnataka 560102</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <FaSlack className="text-2xl" />
                                        <a
                                            href="https://olake.io/slack"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            Join our Slack
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Links Section */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold mb-3">Connect with Our Team on LinkedIn</h2>
                            <ul className="space-y-4">
                                <li className="flex items-center space-x-4">
                                    <FaLinkedin className="text-2xl" />
                                    <a href="https://www.linkedin.com/in/zriyansh/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        Priyansh
                                    </a>
                                </li>
                                <li className="flex items-center space-x-4">
                                    <FaLinkedin className="text-2xl" />
                                    <a href="https://www.linkedin.com/in/sandeepdevarapalli/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        Sandeep
                                    </a>
                                </li>
                                <li className="flex items-center space-x-4">
                                    <FaLinkedin className="text-2xl" />
                                    <a href="https://www.linkedin.com/in/rohan-khameshra/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        Rohan
                                    </a>
                                </li>
                                <li className="flex items-center space-x-4">
                                    <FaLinkedin className="text-2xl" />
                                    <a href="https://www.linkedin.com/in/shubham-baldava/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        Shubham
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ContactPage;

