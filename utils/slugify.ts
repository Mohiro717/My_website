export const slugify = (value: string): string => {
  const normalized = value
    .toString()
    .normalize('NFKC')
    .trim()
    // collapse whitespace to single hyphen
    .replace(/\s+/g, '-')
    // remove characters that frequently break anchors while keeping CJK, latin, numbers and dashes
    .replace(/[^0-9A-Za-z\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\-\u30FC_]+/g, '')
    // dedupe consecutive hyphens
    .replace(/-+/g, '-');

  return normalized || 'section';
};
