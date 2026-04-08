const fallbackSiteUrl = 'https://cl1nical.dev';

export function getSiteUrl() {
  const configured = import.meta.env.PUBLIC_SITE_URL?.trim();
  return (configured && configured.length > 0 ? configured : fallbackSiteUrl).replace(/\/$/, '');
}

export function toAbsoluteUrl(path = '/') {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
