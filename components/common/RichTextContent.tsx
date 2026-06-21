import type { ComponentPropsWithoutRef, ElementType } from 'react';

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const HTML_ENTITY_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeLineBreaks(value: string): string {
  return value.replace(/\r\n?/g, '\n');
}

function wrapPlainTextAsHtml(value: string, defaultTag: string): string {
  const normalized = normalizeLineBreaks(value).trim();
  if (!normalized) {
    return '';
  }

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      const html = escapeHtml(paragraph).replace(/\n/g, '<br />');
      return `<${defaultTag}>${html}</${defaultTag}>`;
    });

  return paragraphs.join('');
}

export function renderRichTextHtml(content: unknown, defaultTag = 'p'): string {
  if (typeof content !== 'string') {
    return '';
  }

  const normalized = normalizeLineBreaks(content);
  if (!normalized.trim()) {
    return '';
  }

  if (HTML_TAG_PATTERN.test(normalized)) {
    return normalized;
  }

  return wrapPlainTextAsHtml(normalized, defaultTag);
}

export function richTextToPlainText(content: unknown): string {
  if (typeof content !== 'string') {
    return '';
  }

  return content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|blockquote)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(amp|lt|gt|quot|nbsp|#39);/gi, (entity) => HTML_ENTITY_MAP[entity.toLowerCase()] ?? entity)
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

type RichTextContentProps<T extends ElementType> = Omit<ComponentPropsWithoutRef<T>, 'children'> & {
  as?: T;
  content?: string | null;
  defaultTag?: string;
};

function RichTextContent<T extends ElementType = 'div'>({
  as,
  content,
  defaultTag = 'p',
  ...props
}: RichTextContentProps<T>) {
  const Component = (as ?? 'div') as ElementType;
  const html = renderRichTextHtml(content, defaultTag);

  if (!html) {
    return null;
  }

  return <Component {...props} data-rich-text="" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function RichTextBlock<T extends ElementType = 'div'>(props: RichTextContentProps<T>) {
  return <RichTextContent {...props} />;
}

export function RichTextInline<T extends ElementType = 'span'>(props: RichTextContentProps<T>) {
  return (
    <RichTextContent
      {...props}
      as={(props.as ?? 'span') as T}
      defaultTag={props.defaultTag ?? 'span'}
    />
  );
}
