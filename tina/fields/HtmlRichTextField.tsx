import { useEffect, useMemo, useRef, useState } from 'react';
import { renderRichTextHtml } from '../../components/common/RichTextContent';

type TinaFieldProps = {
  field?: {
    label?: string | false;
    description?: string;
    list?: boolean;
  };
  input: {
    value?: string | string[];
    onChange: (value: string | string[]) => void;
  };
  meta?: {
    error?: string;
    submitError?: string;
    touched?: boolean;
  };
};

type RichTextEditorProps = TinaFieldProps & {
  compact?: boolean;
};

const BLOCK_TAG_OPTIONS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'] as const;
const INLINE_TAGS = new Set(['strong', 'em', 'u', 's', 'code', 'span']);
const CLEAR_FORMAT_TAGS = new Set([
  ...INLINE_TAGS,
  'a',
  'font',
  'b',
  'i',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'pre',
]);
const BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol', 'li', 'pre']);
const ALLOWED_TAGS = new Set([...INLINE_TAGS, ...BLOCK_TAGS, 'br', 'a']);
const COLOR_STYLE_TAGS = new Set([...ALLOWED_TAGS]);
const SKIP_CONTENT_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed']);
const COLOR_KEYWORDS = new Set(['inherit', 'initial', 'transparent', 'unset', 'currentcolor']);
const HEX_COLOR_PATTERN = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const RGB_COLOR_PATTERN =
  /^rgba?\(\s*(?:\d{1,3}%?\s*,\s*){2}\d{1,3}%?(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;
const HSL_COLOR_PATTERN =
  /^hsla?\(\s*\d{1,3}(?:deg)?\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;

function isSafeLinkHref(value: string): boolean {
  return /^(https?:|mailto:|tel:|\/|#)/i.test(value);
}

function getToolbarLabel(tagName: string): string {
  return tagName.toUpperCase();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeCssColor(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function isSafeCssColor(value: string): boolean {
  const normalized = normalizeCssColor(value);
  const lowerCased = normalized.toLowerCase();

  return (
    COLOR_KEYWORDS.has(lowerCased) ||
    HEX_COLOR_PATTERN.test(normalized) ||
    RGB_COLOR_PATTERN.test(normalized) ||
    HSL_COLOR_PATTERN.test(normalized) ||
    /^[a-z]+$/i.test(normalized)
  );
}

function extractSafeColorStyle(value: string): string | null {
  for (const declaration of value.split(';')) {
    const [rawProperty, ...rawValueParts] = declaration.split(':');

    if (!rawProperty || rawValueParts.length === 0) {
      continue;
    }

    if (rawProperty.trim().toLowerCase() !== 'color') {
      continue;
    }

    const colorValue = normalizeCssColor(rawValueParts.join(':'));
    if (isSafeCssColor(colorValue)) {
      return colorValue;
    }
  }

  return null;
}

function unwrapElement(element: Element) {
  const parent = element.parentNode;
  if (!parent) {
    return;
  }

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
}

function stripFormattingFromFragment(fragment: DocumentFragment) {
  const documentNode = fragment.ownerDocument;
  const walker = documentNode.createTreeWalker(fragment, NodeFilter.SHOW_ELEMENT);
  const elements: Element[] = [];
  let currentNode = walker.nextNode();

  while (currentNode) {
    elements.push(currentNode as Element);
    currentNode = walker.nextNode();
  }

  for (const element of elements) {
    element.removeAttribute('style');
  }

  for (const element of elements.reverse()) {
    if (CLEAR_FORMAT_TAGS.has(element.tagName.toLowerCase())) {
      unwrapElement(element);
    }
  }
}

function stripFormattingFromElement(element: HTMLElement) {
  const fragment = element.ownerDocument.createDocumentFragment();

  while (element.firstChild) {
    fragment.appendChild(element.firstChild);
  }

  stripFormattingFromFragment(fragment);
  element.appendChild(fragment);
}

function sanitizeEditorHtml(input: string): string {
  if (typeof window === 'undefined' || !input.trim()) {
    return '';
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(`<div>${input}</div>`, 'text/html');
  const root = documentNode.body.firstElementChild;

  if (!root) {
    return '';
  }

  const sanitizeElement = (element: Element) => {
    const tagName = element.tagName.toLowerCase();

    if (SKIP_CONTENT_TAGS.has(tagName)) {
      element.remove();
      return;
    }

    const normalizedTagName =
      tagName === 'b' ? 'strong' :
      tagName === 'i' ? 'em' :
      tagName === 'font' ? 'span' :
      tagName === 'div' ? 'p' :
      tagName;

    if (normalizedTagName !== tagName) {
      const replacement = documentNode.createElement(normalizedTagName);
      while (element.firstChild) {
        replacement.appendChild(element.firstChild);
      }
      for (const attribute of Array.from(element.attributes)) {
        replacement.setAttribute(attribute.name, attribute.value);
      }
      element.replaceWith(replacement);
      sanitizeElement(replacement);
      return;
    }

    if (!ALLOWED_TAGS.has(tagName)) {
      const fragment = documentNode.createDocumentFragment();
      while (element.firstChild) {
        fragment.appendChild(element.firstChild);
      }
      element.replaceWith(fragment);
      return;
    }

    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name === 'style' && COLOR_STYLE_TAGS.has(tagName)) {
        const safeColor = extractSafeColorStyle(attribute.value);
        if (safeColor) {
          element.setAttribute('style', `color: ${safeColor};`);
        } else {
          element.removeAttribute(attribute.name);
        }
        continue;
      }

      if (attribute.name === 'color' && COLOR_STYLE_TAGS.has(tagName)) {
        const safeColor = normalizeCssColor(attribute.value);
        if (isSafeCssColor(safeColor)) {
          element.setAttribute('style', `color: ${safeColor};`);
        }
        element.removeAttribute(attribute.name);
        continue;
      }

      if (tagName === 'a' && attribute.name === 'href') {
        const href = attribute.value.trim();
        if (!isSafeLinkHref(href)) {
          element.removeAttribute(attribute.name);
          continue;
        }

        element.setAttribute('href', href);
        if (/^https?:/i.test(href)) {
          element.setAttribute('target', '_blank');
          element.setAttribute('rel', 'noopener noreferrer');
        } else {
          element.removeAttribute('target');
          element.removeAttribute('rel');
        }
        continue;
      }

      if (tagName === 'a' && (attribute.name === 'target' || attribute.name === 'rel')) {
        continue;
      }

      element.removeAttribute(attribute.name);
    }

    for (const child of Array.from(element.children)) {
      sanitizeElement(child);
    }
  };

  for (const child of Array.from(root.children)) {
    sanitizeElement(child);
  }

  const html = root.innerHTML
    .replace(/<(p|blockquote|h[1-6]|li)>\s*<\/\1>/gi, '')
    .replace(/<p><br><\/p>/gi, '')
    .replace(/\s+(<\/(p|blockquote|h[1-6]|li|ul|ol|pre)>)/gi, '$1')
    .trim();

  return html;
}

function htmlToRichTextList(input: string, defaultTag: string): string[] {
  if (typeof window === 'undefined' || !input.trim()) {
    return [];
  }

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(`<div>${input}</div>`, 'text/html');
  const root = documentNode.body.firstElementChild;

  if (!root) {
    return [];
  }

  const items: string[] = [];
  let inlineBuffer = '';

  const flushInlineBuffer = () => {
    const trimmed = inlineBuffer.trim();
    if (!trimmed) {
      inlineBuffer = '';
      return;
    }

    items.push(`<${defaultTag}>${trimmed}</${defaultTag}>`);
    inlineBuffer = '';
  };

  for (const node of Array.from(root.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent ?? '';
      if (textContent.trim()) {
        inlineBuffer += escapeHtml(textContent);
      }
      continue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();

    if (BLOCK_TAGS.has(tagName)) {
      flushInlineBuffer();
      items.push(element.outerHTML.trim());
      continue;
    }

    inlineBuffer += element.outerHTML;
  }

  flushInlineBuffer();

  return items;
}

function renderEditorHtml(value: string | string[] | undefined, defaultTag: string) {
  if (Array.isArray(value)) {
    return value.map((item) => renderRichTextHtml(item, defaultTag)).join('');
  }

  return renderRichTextHtml(value, defaultTag);
}

function syncEditorHtml(editor: HTMLDivElement, value: string | string[] | undefined, defaultTag: string) {
  const nextHtml = renderEditorHtml(value, defaultTag);
  if (editor.innerHTML !== nextHtml) {
    editor.innerHTML = nextHtml;
  }
}

function RichTextEditor({ field, input, meta, compact = false }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const selectionRangeRef = useRef<Range | null>(null);
  const defaultTag = compact ? 'span' : 'p';
  const label = field?.label;
  const description = field?.description;
  const isListField = field?.list === true || Array.isArray(input.value);
  const error = meta?.touched ? meta.error ?? meta.submitError : undefined;
  const [selectedColor, setSelectedColor] = useState('#101828');
  const toolbarTagButtons = useMemo(
    () => BLOCK_TAG_OPTIONS.map((tagName) => ({ tagName, label: getToolbarLabel(tagName) })),
    []
  );

  const isSelectionInsideEditor = (selection: Selection | null) => {
    const editor = editorRef.current;

    if (!editor || !selection || selection.rangeCount === 0) {
      return false;
    }

    return editor.contains(selection.getRangeAt(0).commonAncestorContainer);
  };

  const saveSelection = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const selection = window.getSelection();
    if (!selection || !isSelectionInsideEditor(selection)) {
      return;
    }

    selectionRangeRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    if (typeof window === 'undefined') {
      return false;
    }

    const selection = window.getSelection();
    const savedRange = selectionRangeRef.current;

    if (!selection || !savedRange) {
      return false;
    }

    try {
      selection.removeAllRanges();
      selection.addRange(savedRange);
      return true;
    } catch {
      selectionRangeRef.current = null;
      return false;
    }
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    if (document.activeElement === editor) {
      return;
    }

    syncEditorHtml(editor, input.value, defaultTag);
  }, [defaultTag, input.value]);

  const commitEditorValue = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const sanitized = sanitizeEditorHtml(editor.innerHTML);
    if (editor.innerHTML !== sanitized) {
      editor.innerHTML = sanitized;
    }

    selectionRangeRef.current = null;
    input.onChange(isListField ? htmlToRichTextList(sanitized, defaultTag) : sanitized);
  };

  const focusEditor = () => {
    editorRef.current?.focus();
    restoreSelection();
  };

  const setStyleWithCss = (enabled: boolean) => {
    document.execCommand('styleWithCSS', false, enabled ? 'true' : 'false');
  };

  const runCommand = (command: string, value?: string) => {
    focusEditor();
    setStyleWithCss(false);
    document.execCommand(command, false, value);
    commitEditorValue();
  };

  const applyBlockTag = (tagName: string) => {
    focusEditor();
    setStyleWithCss(false);
    document.execCommand('formatBlock', false, `<${tagName}>`);
    commitEditorValue();
  };

  const applyTextColor = (color: string, scope: 'selection' | 'all') => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    focusEditor();

    if (scope === 'all' && typeof window !== 'undefined') {
      const selection = window.getSelection();
      const range = document.createRange();

      range.selectNodeContents(editor);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    setStyleWithCss(true);
    document.execCommand('foreColor', false, color);
    setStyleWithCss(false);
    commitEditorValue();
  };

  const insertLink = () => {
    const currentSelection = typeof window !== 'undefined' ? window.getSelection()?.toString() ?? '' : '';
    const nextHref = window.prompt('Enter a URL', currentSelection || 'https://');
    if (!nextHref) {
      return;
    }

    focusEditor();
    setStyleWithCss(false);
    document.execCommand('createLink', false, nextHref.trim());
    commitEditorValue();
  };

  const clearFormatting = () => {
    const editor = editorRef.current;
    if (!editor || typeof window === 'undefined') {
      return;
    }

    focusEditor();
    setStyleWithCss(false);

    const selection = window.getSelection();
    if (!selection || !isSelectionInsideEditor(selection) || selection.rangeCount === 0) {
      stripFormattingFromElement(editor);
      commitEditorValue();
      return;
    }

    const range = selection.getRangeAt(0);
    if (!range || range.collapsed) {
      stripFormattingFromElement(editor);
      const nextRange = document.createRange();
      nextRange.selectNodeContents(editor);
      nextRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(nextRange);
      saveSelection();
      commitEditorValue();
      return;
    }

    const fragment = range.extractContents();
    stripFormattingFromFragment(fragment);

    const nodesToInsert = Array.from(fragment.childNodes);
    range.insertNode(fragment);

    if (nodesToInsert.length > 0) {
      const nextRange = document.createRange();
      nextRange.setStartBefore(nodesToInsert[0]);
      nextRange.setEndAfter(nodesToInsert[nodesToInsert.length - 1]);
      selection.removeAllRanges();
      selection.addRange(nextRange);
    }

    commitEditorValue();
  };

  return (
    <div className="space-y-2">
      {label !== false && (
        <div className="space-y-1">
          {typeof label === 'string' && label.trim() ? (
            <label className="block text-sm font-medium text-[#1E1F21]">{label}</label>
          ) : null}
          {description ? (
            <p className="text-xs leading-5 text-[#667085]">{description}</p>
          ) : null}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-[#D0D5DD] bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-[#EAECF0] bg-[#F9FAFB] p-2">
          {toolbarTagButtons.map(({ tagName, label: tagLabel }) => (
            <button
              key={tagName}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                applyBlockTag(tagName);
              }}
              className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
            >
              {tagLabel}
            </button>
          ))}

          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              runCommand('bold');
            }}
            className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
          >
            Bold
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              runCommand('italic');
            }}
            className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
          >
            Italic
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              runCommand('underline');
            }}
            className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
          >
            Underline
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              runCommand('insertUnorderedList');
            }}
            className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
          >
            Bullets
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              runCommand('insertOrderedList');
            }}
            className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
          >
            Numbers
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              insertLink();
            }}
            className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
          >
            Link
          </button>
          <label className="flex items-center gap-2 rounded-md border border-[#D0D5DD] bg-white px-2 py-1 text-xs font-semibold text-[#344054]">
            <span>Color</span>
            <input
              type="color"
              value={selectedColor}
              onMouseDown={saveSelection}
              onChange={(event) => {
                setSelectedColor(event.target.value);
              }}
              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
              aria-label="Choose text color"
            />
          </label>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              applyTextColor(selectedColor, 'selection');
            }}
            className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
          >
            Color Text
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              applyTextColor(selectedColor, 'all');
            }}
            className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
          >
            Color All
          </button>
          <button
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              clearFormatting();
            }}
            className="rounded-md border border-[#D0D5DD] px-2 py-1 text-xs font-semibold text-[#344054] transition-colors hover:bg-white"
          >
            Clear
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={commitEditorValue}
          onBlur={commitEditorValue}
          onKeyUp={saveSelection}
          onMouseUp={saveSelection}
          className={`rich-html-field prose prose-sm max-w-none px-3 py-3 text-[#101828] outline-none [&_a]:cursor-pointer hover:[&_a]:cursor-pointer ${
            compact ? 'min-h-[120px]' : 'min-h-[220px]'
          }`}
        />
      </div>

      {error ? (
        <p className="text-xs leading-5 font-medium text-[#D92D20]">{error}</p>
      ) : null}
    </div>
  );
}

export function InlineHtmlRichTextField(props: TinaFieldProps) {
  return <RichTextEditor {...props} compact />;
}

export function BlockHtmlRichTextField(props: TinaFieldProps) {
  return <RichTextEditor {...props} />;
}
