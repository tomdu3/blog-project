# Architectural Improvements: Notion Integration

Currently, the blog project utilizes a multi-step conversion process to render blog post content:
`Notion Block JSON (Backend) -> Markdown String (Backend API) -> HTML String (Frontend Marked) -> Sanitize (DOMPurify) -> React DOM (dangerouslySetInnerHTML)`

This document outlines the issues with this approach and provides concrete plans for optimizing the integration.

---

## The Issues with the Current Flow

1. **Serialization and Parsing Redundancy:**
   - The Notion API sends content as a structured JSON hierarchy (already an AST).
   - The backend flattens this structured data into raw Markdown text.
   - The frontend parses this raw text back into HTML using the client-side library `marked`.
   - The browser parses the HTML strings into DOM nodes.
   - This double-parsing adds execution overhead on both server and client.

2. **Loss of Content Fidelity:**
   - Notion supports rich, interactive content: column layouts, toggles, callout callouts, bookmarks, tables, synced blocks, and videos.
   - Converting to plain markdown discards or strips these features.

3. **Security Vulnerabilities (XSS):**
   - Injecting raw HTML via `dangerouslySetInnerHTML` exposes the frontend to Cross-Site Scripting (XSS).
   - This necessitates importing and running `DOMPurify` (or `isomorphic-dompurify`) on the client, which inflates the client-side bundle size.

---

## Proposed Options

### Option 1: Direct JSON-to-React Components (Recommended)
Pass the structured Notion blocks JSON from the backend directly to the frontend, and map blocks directly to React components.

- **Pros:** Full support for rich layouts, high rendering fidelity, zero intermediate flat-text conversions, no `dangerouslySetInnerHTML` or `DOMPurify` needed, and easy mapping to custom interactive React components.
- **Cons:** Slightly larger JSON payload sizes across the network.

### Option 2: Frontend `react-markdown` Integration
If keeping Markdown on the backend is preferred (e.g. for simple storage or third-party integrations):
- Replace `marked` + `DOMPurify` + `dangerouslySetInnerHTML` on the frontend with `react-markdown`.
- **Pros:** Renders Markdown directly to React's Virtual DOM securely, without raw HTML injection or XSS risks.
- **Cons:** Still carries the parsing overhead and loss of Notion features.

### Option 3: Direct Notion-to-HTML on Backend
Convert Notion blocks directly to HTML on the backend.
- **Pros:** Frontend receives complete HTML and requires no rendering or parsing libraries.
- **Cons:** Cannot easily map specific Notion blocks to dynamic React components.

---

## Chosen Path: Option 1 (Direct JSON-to-React Components)
To implement the recommended approach, we will modify:
1. **Backend**:
   - Update `app/notion/parser.py` to stop converting blocks to markdown, and instead extract and return the structured block JSON list.
   - Update `PostDetail` model in `app/models.py` to accept a list of blocks/dicts as content.
2. **Frontend**:
   - Update `BlogPostPage` to traverse and render Notion block components recursively.
