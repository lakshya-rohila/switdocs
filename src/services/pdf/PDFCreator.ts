import { Platform } from 'react-native';

export type BlockStyle = 'normal' | 'h1' | 'bold' | 'bullet';

export type TextBlock = {
  id: string;
  kind: 'text';
  text: string;
  style: BlockStyle;
};

export type ImageBlock = {
  id: string;
  kind: 'image';
  uri: string;
};

export type Block = TextBlock | ImageBlock;

/**
 * Converts the block editor state into a complete HTML document string
 * ready to pass to react-native-html-to-pdf.
 *
 * @param title       Document title (rendered as <h1>)
 * @param blocks      Ordered list of content blocks
 * @param base64Map   Map of image block id → base64 data URI string
 */
export function buildHtmlFromBlocks(
  title: string,
  blocks: Block[],
  base64Map: Record<string, string>,
): string {
  const fontFamily = Platform.select({ ios: 'Helvetica, Arial', android: 'sans-serif' });

  const blockHtml = blocks
    .map(block => {
      if (block.kind === 'image') {
        const src = base64Map[block.id];
        if (!src) {
          return '';
        }
        return `<div style="margin:12px 0;"><img src="${src}" style="max-width:100%;border-radius:6px;" /></div>`;
      }

      const text = escapeHtml(block.text);
      if (!text.trim()) {
        return '';
      }

      switch (block.style) {
        case 'h1':
          return `<h2 style="color:#0F172A;margin:16px 0 8px;">${text}</h2>`;
        case 'bold':
          return `<p style="margin:8px 0;"><strong>${text}</strong></p>`;
        case 'bullet': {
          const lines = text.split('\n').filter(Boolean);
          const items = lines.map(l => `<li>${l}</li>`).join('');
          return `<ul style="margin:8px 0;padding-left:22px;">${items}</ul>`;
        }
        default:
          return `<p style="margin:8px 0;">${text}</p>`;
      }
    })
    .join('\n');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: ${fontFamily};
        font-size: 15px;
        line-height: 1.6;
        color: #1E293B;
        padding: 32px 28px;
        margin: 0;
      }
      h1 { color: #0F172A; font-size: 26px; margin: 0 0 20px; }
      h2 { color: #0F172A; font-size: 20px; }
      p, ul { color: #334155; }
      img { display: block; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title || 'Untitled document')}</h1>
    ${blockHtml}
  </body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
