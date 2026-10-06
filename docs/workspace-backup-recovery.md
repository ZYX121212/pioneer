# Workspace backup recovery

The workspace data section now offers an expandable Import a backup flow in Chinese and English. Visitors choose a Pioneer JSON file or paste complete JSON, inspect the merge, then explicitly confirm saving to the current account.

Supported inputs are exported workspace envelopes (`schemaVersion: 1`, `state`), complete raw workspace states, and existing legacy browser export files. Account identifiers and source version markers are not imported. Raw input is bounded to 1 MB; imported and merged state must satisfy the same field, identifier, list, timestamp and 150 KB normalized workspace limits as normal saves.

Merging preserves an existing cloud project, records with matching evidence/task identifiers and decisions with matching guide identifiers. Distinct records are added; saved resource and completion identifiers are deduplicated. Source files are retained and no cloud records are deleted. The preview describes the backup and resulting collection counts. The inspected cloud version is checked inside the save queue, followed by the normal server version check, so intervening saves cannot silently change the approved merge.

Reading a file or inspecting it does not upload its contents. Inspection refreshes the current account's workspace to establish the merge baseline. File parse errors, workspace read failures, excessive combined state and save conflicts retain the input and do not report success.

## Verification

- Build and 102 tests passed, including four backup parsing/merge tests and a queued-save conflict test.
- Type checking passed; lint has no errors and two existing image warnings.
- Actual browser file chooser selected a synthetic local JSON file. Before confirmation, actual local D1 stayed at version 0 with no project or evidence.
- Browser confirmation saved a project, task, evidence entry, completed guide and resource. Actual local D1 readback showed version 1 and matching content.
- Re-exported complete JSON included schemaVersion 1 and the actual saved state. It could be inspected again; duplicate records stayed at one each.
- Malformed JSON and cancelled imports left the actual D1 state and version unchanged.
- English preview at 390px had no horizontal overflow.

Browser tests used a loopback-only synthetic test identity. No production user data was imported, replaced or removed. The built-in browser still returned no downloaded file handle; complete JSON and file imports are verified, but actual download delivery remains unverified. Real email delivery and prior legacy-browser deletion acceptance remain separately pending.
