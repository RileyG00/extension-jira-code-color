# Jira Inline Code Colorizer

A Chrome extension (Manifest V3) that restyles inline code blocks
(`span.code`) on any `*.atlassian.net` page with configurable text and
background colors.

## Load it (unpacked / side-load)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked**.
4. Select this project folder (`extension-jira-code-color`).
5. Visit any `*.atlassian.net` page — inline code spans will pick up the
   configured colors automatically.

## Configure

Right-click the extension's icon (or its entry in `chrome://extensions`)
and choose **Options**. The settings page lets you:

- Pick from a set of quick preset themes (Sunset, Ocean Blue, Forest
  Green, High Contrast, etc.)
- Set custom text and background colors via color pickers or hex input
- See a live preview before it's applied
- Reset back to the default theme (`#ffc896` text on `#433831` background)

The dark presets are tuned for Jira dark mode: every one has at least 7:1
text/background contrast (WCAG AAA), and each background is light enough
to stand out from Jira's dark page surface. Users who had picked an older
preset are moved to its updated colors automatically.

Settings are stored with `chrome.storage.sync`, so they follow you across
Chrome profiles signed into the same account, and pages update live via
a storage-change listener (no reload needed after saving).

## How it works

`content.js` injects a `<style>` tag on matching pages with:

```css
span.code,
code[data-renderer-mark="true"] {
  color: <your text color> !important;
  background-color: <your background color> !important;
}
```

Two selectors are targeted because Jira has more than one inline-code
markup depending on the editor/page:

- `span.code` — classic wiki-markup rendering
- `code[data-renderer-mark="true"]` — the newer Atlaskit/ADF editor,
  which also stamps each element with auto-generated, unstable atomic
  class names (e.g. `_ca0qyh40`) from its compiled CSS-in-JS. Those
  hashed classes change across Jira releases, so `data-renderer-mark`
  is the stable hook to use instead.

If a future Jira update changes this markup again, add the new
selector to the `SELECTORS` array at the top of `content.js`.
