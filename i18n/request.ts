import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

const jsonContentNamespaces = [
  'navbar',
  'footer',
  'landing',
  'about-us',
  'pay-it-forward',
  'privacy-policy',
  'terms-and-conditions',
  'cookie-policy',
  'app-development',
  'web-development',
  'web-design',
  'digital-marketing-services',
  'ppc-google-ads-management',
  'seo',
  'graphic-design',
  'social-media-marketing-services',
  'wordpress-development',
  'blogs',
  'contact',
  'contact-modal',
  'growth-popup',
] as const;

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const [baseMessages, ...namespaceMessages] = await Promise.all([
    import(`../messages/${locale}.json`).then((m) => m.default),
    ...jsonContentNamespaces.map((ns) =>
      import(`../jsonContent/${ns}/${locale}.json`).then((m) => m.default)
    ),
  ]);

  const merged: Record<string, unknown> = {...baseMessages};
  jsonContentNamespaces.forEach((ns, i) => {
    merged[ns] = namespaceMessages[i];
  });

  return {
    locale,
    messages: merged,
  };
});
