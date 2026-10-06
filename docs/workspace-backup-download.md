# Private workspace attachment downloads

Cloud workspace backups now download from `/api/workspace/export` as JSON attachments. The existing complete-text preview and manual copy remain available. Legacy browser backups still use a browser-generated download because the server cannot read local originals.

The export route reads only the authenticated identity's D1 workspace and ignores account identifiers supplied by callers. It requires the prepared preview version; stale versions return 409 rather than downloading changed data. Successful responses include schemaVersion 1, saved state, version, saved timestamp and export timestamp. Responses use private/no-store caching, nosniff and a fixed filename without account information. Cross-origin and explicit cross-site requests are rejected.

Browser navigation failures show short Chinese or English instructions and a return link. API requests retain structured errors. Errors are never served with attachment headers.

## Direct evidence

- Build and 102 regular tests passed; type checking passed and lint has no errors (two existing image warnings).
- `node --test tests/integration/workspace-export-preview.mjs` passed against actual local D1: attachment metadata, complete state, account isolation, anonymous rejection, malformed versions, cross-site rejection, stale preview rejection and bilingual browser error pages.
- Browser download returned `/Users/nova/Downloads/pioneer-workspace (5).json`, 1,133 bytes. SHA256: `50b212607315f0a82621559ec42f8c1257da0517949b06b6859fd4af10f6a154`.
- Downloaded JSON matched the actual local D1 state, saved version 1 and saved timestamp exactly. It contained no account identifier.
- Actual file chooser selected this downloaded file for import; the preview showed one evidence entry, task, completion and saved resource. Browser confirmation saved version 2 with the same state and no duplicate records.
- Visiting the version 1 download after that import displayed the Chinese changed-workspace explanation and a working workspace return link.

These checks used synthetic loopback identities and test data. No production personal data was exported, imported or deleted. Actual cloud attachment download and recovery are verified locally. Production deployment success is a separate check; real email delivery and destructive legacy-browser clearing acceptance remain pending.
