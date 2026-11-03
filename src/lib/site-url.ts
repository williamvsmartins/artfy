const DEFAULT_SITE_URL = 'https://artfy.vercel.app';

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function siteHost(): string {
  return new URL(siteUrl()).host;
}
