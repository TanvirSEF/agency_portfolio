const CONTACT_SECTION_ID = 'contact-section';
const LOCALE_SEGMENTS = new Set(['en', 'sv']);

function withContactHash(path: string): string {
  return `${path}#${CONTACT_SECTION_ID}`;
}

function getLocalePrefix(pathname: string): string {
  const localeSegment = pathname.split('/')[1];
  return LOCALE_SEGMENTS.has(localeSegment) ? `/${localeSegment}` : '';
}

function syncContactHashInUrl() {
  const nextUrl = withContactHash(`${window.location.pathname}${window.location.search}`);
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentUrl === nextUrl) return;
  window.history.pushState(window.history.state, '', nextUrl);
}

export function scrollToContact() {
  const el = document.getElementById(CONTACT_SECTION_ID);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    syncContactHashInUrl();
    return;
  }

  const localePrefix = getLocalePrefix(window.location.pathname);
  const targetPath = withContactHash(`${localePrefix}/contact`);
  if (window.location.pathname + window.location.hash === targetPath) return;
  window.location.href = targetPath;
}
