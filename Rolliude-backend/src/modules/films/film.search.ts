const MAX_SEARCH_TOKENS = 5;

export function normalizeSearchText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

export function buildSearchField(title: string, originalTitle?: string | null): string {
  return normalizeSearchText(originalTitle ? `${title} ${originalTitle}` : title);
}

export function buildSearchTokens(term: string | undefined): string[] {
  if (!term) {
    return [];
  }

  const tokens = normalizeSearchText(term)
    .split(/\s+/)
    .filter(token => token.length > 0);

  return [...new Set(tokens)].slice(0, MAX_SEARCH_TOKENS);
}
