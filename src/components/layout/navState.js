export function getNavActiveState(pathname) {
  const isProfile =
    pathname === '/dein-profil' ||
    pathname === '/einstellungen' ||
    pathname.startsWith('/updatepass') ||
    pathname.startsWith('/profil/');

  const isActivity =
    pathname.includes('aktivitat') ||
    pathname.includes('activity');

  const isSearch =
    pathname === '/suche' ||
    pathname === '/filter' ||
    pathname === '/karte' ||
    pathname.startsWith('/abstimmfilter') ||
    pathname.startsWith('/erstellzeit-filter');

  const isHome = !isProfile && !isActivity && !isSearch;

  return {
    home: isHome,
    search: isSearch,
    activity: isActivity,
    profile: isProfile,
  };
}

export function getHeaderTabState(pathname) {
  const isCrowdfunding = pathname.startsWith('/crowdfunding');
  const isSuggestions = !isCrowdfunding;

  return {
    suggestions: isSuggestions,
    crowdfunding: isCrowdfunding,
    suggestions_active:
      isSuggestions &&
      (pathname === '/' ||
        pathname.includes('aktiv') ||
        pathname.includes('geteilter') ||
        pathname.includes('post-verify')),
    suggestions_accepted: pathname.includes('akzeptiert'),
    suggestions_denied: pathname.includes('abgelehnt'),
    newest:
      pathname === '/' ||
      (pathname.includes('neuste') && !pathname.includes('beliebtesten')) ||
      pathname.includes('geteilter'),
    favourites: pathname.includes('beliebtesten'),
  };
}
