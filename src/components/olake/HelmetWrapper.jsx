import React from "react";
import { Helmet } from "react-helmet";

const HelmetWrapper = ({ title, description, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  );
};

export default HelmetWrapper;
