import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useLocation } from "react-router-dom";

function ShareButton(props) {
    const location = useLocation();
    const twitterShareURL =
        "https://twitter.com/share?url=https://olake.io" +
        `${location.pathname}` +
        "&text=Check out this article on " +
        `${props.title}` +
        ": " +
        "&hashtags=olake,opensource";
    const linkedinShareURL =
        "http://www.linkedin.com/shareArticle?mini=true&url=https://olake.io" +
        `${location.pathname}` +
        "&source=olake.io";
    const facebookShareURL =
        "https://www.facebook.com/sharer/sharer.php?u=https://olake.io" +
        `${location.pathname}`;
    const emailShareURL =
        "mailto:?subject=Shared Article | " +
        `${props.title}` +
        " | OLake Docs " +
        "&body=Check out this article on " +
        `${props.title}` +
        ": https://olake.io" +
        `${location.pathname}`;
    const shareIconUrl = useBaseUrl("img/icon/share-icon.svg");

    const info = [
        {
            link: twitterShareURL,
            lightIcon: useBaseUrl("img/icon/twitter-light-icon.svg"),
            darkIcon: useBaseUrl("img/icon/twitter-dark-icon.svg"),
            name: "Twitter",
        },
        {
            link: linkedinShareURL,
            lightIcon: useBaseUrl("img/icon/linkedin-light-icon.svg"),
            darkIcon: useBaseUrl("img/icon/linkedin-dark-icon.svg"),
            name: "LinkedIn",
        },
        {
            link: facebookShareURL,
            lightIcon: useBaseUrl("img/icon/facebook-light-icon.svg"),
            darkIcon: useBaseUrl("img/icon/facebook-dark-icon.svg"),
            name: "Facebook",
        },
        {
            link: emailShareURL,
            lightIcon: useBaseUrl("img/icon/email-light-icon.svg"),
            darkIcon: useBaseUrl("img/icon/email-dark-icon.svg"),
            name: "Email",
        },
    ];

    return (
        <div className="dropdown dropdown--hoverable pointer mr-4">
            <button
                className="button button--lg button--link padding-horiz--none pointer share-button hover:no-underline"
                style={{ fontWeight: 400, fontFamily: "inherit", fontSize: "inherit" }}
            >
               <img
                    className="margin-right--xs"
                    src={shareIconUrl}
                    style={{ height: "16px", verticalAlign: "-0.125em" }}
                ></img>
                Share
            </button>

            <ul className="dropdown__menu">
                {info.map((labels, idx) => (
                    <li key={idx}>
                        <a
                            className="flex dropdown__link icons display-flex"
                            href={labels.link}
                            target="_blank"
                        >
                            <img
                                className="block dark:hidden w-5 h-5 mr-2" alt="Share Icon"
                                src={labels.lightIcon}
                            ></img>
                            <img
                                className="hidden dark:block w-5 h-5 mr-2" alt="Share Icon"
                                src={labels.darkIcon}
                            ></img>
                            {labels.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ShareButton;
