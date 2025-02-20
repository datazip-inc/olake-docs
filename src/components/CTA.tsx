import React from "react";
import AwesomeButton from "./AwesomeButton"; // Adjust the import path as needed
import { FaEnvelope, FaPhone } from "react-icons/fa";

export interface CTAComponentProps {
  /** The main title or call-to-action message */
  title?: React.ReactNode;
  /** The text for the mail button */
  mailButtonText?: string;
  /** The text for the call button */
  callButtonText?: string;
  /** The email address for the mail button */
  mail?: string;
  /** The phone number for the call button */
  phone?: string;
  /** Additional container class names */
  containerClassName?: string;
}

const CTAComponent: React.FC<CTAComponentProps> = ({
  title = "Have any questions? Get in touch!",
  mailButtonText = "Mail Us",
  callButtonText = "Call Us",
  mail = "hello@olake.io",
  phone = "+917978307903",
  containerClassName = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 rounded-lg space-y-6 ${containerClassName}`}
    >
      <h2 className="text-2xl md:text-3xl text-center font-normal text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        <AwesomeButton
          variant="primary"
          size="medium"
          icon={<FaEnvelope />}
          iconPosition="left"
          href={`mailto:${mail}`}
        >
          {mailButtonText}
        </AwesomeButton>
        <AwesomeButton
          variant="secondary"
          size="medium"
          icon={<FaPhone />}
          iconPosition="left"
          href={`tel:${phone}`}
        >
          {callButtonText}
        </AwesomeButton>
      </div>
    </div>
  );
};

export default CTAComponent;
