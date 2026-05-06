# Create PDF Block Editor — Design Spec

**Date:** 2026-05-06  
**Status:** Approved

---

## Problem

The current Create PDF screen is disjointed: users must switch tabs, scroll past a blank preview, hit "Preview" to see anything, then scroll back down to "Create PDF". The upload zone does nothing meaningful. There is no real editing surface.

## Goal

Replace the current screen with a simple, self-contained block editor where users compose a document (text + images), then tap one button to generate and save the PDF to their device.

---

## Screen Layout

Three fixed zones:

1. **Header** — Back arrow + "Create PDF" title + ghost "Clear all" button (top right)
2. **Scrollable editor canvas** — white document-like background with page shadow
3. **Sticky bottom bar** — "Save PDF" primary button + "Share" ghost button

---

## Editor Canvas

A `ScrollView` containing:

- **Title field** — large `TextInput`, placeholder "Document title", H1-style font. Full width. Always first.
- **Content blocks** — ordered list of `Block` items rendered sequentially:
  - **Text block**: multiline `TextInput`, auto-expands, styled by its `BlockStyle`
  - **Image block**: full-width image with a small "✕ Remove" overlay button
- **Add block row** — two chips at the bottom: `[ + Text ]` and `[ + Image ]`
  - `+ Text` appends a new text block and auto-focuses it
  - `+ Image` opens the image picker; on success appends an image block

---

## Formatting Toolbar

A compact horizontal `ScrollView` toolbar that appears **above the keyboard** (via `KeyboardAvoidingView`). Visible only when a text block is focused.

| Button | Effect on export |
|--------|-----------------|
| **B** | Wraps block text in `<strong>` |
| H1 | Renders block as `<h2>` |
| • List | Renders block as `<ul><li>` |
| ¶ Normal | Resets to plain `<p>` |

Active style for the focused block is highlighted.

---

## State Shape

```ts
type BlockStyle = 'normal' | 'h1' | 'bold' | 'bullet';

type TextBlock = {
  id: string;
  kind: 'text';
  text: string;
  style: BlockStyle;
};

type ImageBlock = {
  id: string;
  kind: 'image';
  uri: string; // absolute local path, no file:// prefix
};

type Block = TextBlock | ImageBlock;

// Screen state
{
  title: string;
  blocks: Block[];
  focusedBlockId: string | null;
  busy: boolean;
}
```

---

## PDF Generation

**Trigger:** User taps "Save PDF"

**Steps:**
1. Show `ProgressOverlay` (`busy = true`)
2. For each image block: read file as base64 via `RNFS.readFile(uri, 'base64')`
3. Call `buildHtmlFromBlocks(title, blocks, base64Map)` → returns a complete HTML string
4. Call `generatePDF({ html, fileName: sanitized-title + timestamp, directory: 'docs' })`
5. Save path is `RNFS.DocumentDirectoryPath/<filename>.pdf`
6. Hide overlay, show a success toast: "PDF saved — tap to share"
7. Tapping toast (or the "Share" button) opens OS share sheet via `shareLocalFile`

**HTML block mapping:**

| Block type | HTML output |
|-----------|-------------|
| Title | `<h1>` |
| Text (normal) | `<p>` |
| Text (h1) | `<h2>` |
| Text (bold) | `<p><strong>…</strong></p>` |
| Text (bullet) | `<ul><li>…</li></ul>` |
| Image | `<img src="data:image/jpeg;base64,…" style="max-width:100%;margin:8px 0"/>` |

---

## Files Changed

| File | Change |
|------|--------|
| `src/screens/pdf/CreatePDFScreen.tsx` | Full rewrite — block editor UI |
| `src/services/pdf/PDFCreator.ts` | Add `buildHtmlFromBlocks()` helper |

No new dependencies required. Uses existing: `react-native-html-to-pdf`, `react-native-fs`, `@react-native-documents/picker`, `react-native-share`.

---

## Out of Scope

- Table blocks (Add Table tab removed)
- Drag-to-reorder blocks
- Font/color picker
- Cloud save
