import ReactGA from "react-ga4";
export const handleGaCustomEvent = (category, action) => {
  ReactGA.event({
    category,
    action,
  });
};

export const formatError = (error) => {
  return error?.split(":").at(-1).trim();
};

export const outerLink = (link,target="_blank") => {
  window.open(link, target);
};

export const formatDomain = (link) => {
  return link?.split("@")[1];
};

export const formatClientId = (link) => {
  return link?.split("@")[1]?.split(".")[0];
};

export const getObjectfromArrayPair = (data) => {
  let obj = {};
  for (const [name, value] of data) {
    obj[name] = value;
  }
  return obj;
};

export const dateDiffInDays = (_a, _b) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  let a = new Date(_a);
  let b = new Date(_b);
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
};
