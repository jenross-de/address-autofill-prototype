# Address Autofill — Design Implementation Spec

This document specifies the design implementation for the **Address Autofill** feature on the Edit Address screen. It covers the search-and-replace autofill workflow, error states, and field behavior changes validated through two rounds of usability testing (100-persona simulated panels each).

The Smarty US Autocomplete Pro API powers the address lookup. Mock data in the prototype matches the Smarty response format.

---

## Design tokens

Use these values for all new UI in this feature. They are matched to existing Bloomerang conventions observed in the current UI.

### Colors

| Token | Value | Usage |
|---|---|---|
| `green` | `#4caf50` | Active/selected states, focus borders, autofill borders, hover highlights, checkmarks |
| `greenLight` | `#eaf6ea` | Autofill field background, dropdown hover background |
| `greenDark` | `#2d7a30` | Autofill field text |
| `teal` | `#3a8fa3` | Replace button background only |
| `link` | `#298BAB` | All inline text links (no underline; color darkens on hover) |
| `linkHover` | `#1f6d87` | Link hover state |
| `inputText` | `#202020` | Input field text |
| `placeholder` | `#aaa` | Placeholder text |
| `labelColor` | `#999` | Field label text |
| `gray` | `#d0d0d0` | Default input borders |
| `error` | `#ea1d35` | Error state borders |

### Typography

| Element | Font size | Font weight | Color |
|---|---|---|---|
| Field labels | 14px | 500 | `#999` |
| Input text | 13px | 400 | `#202020` |
| Placeholder text | 13px | 400 | `#aaa` |
| Dropdown items | 12px | 400 | `#333` |
| Dropdown city/state | 12px | 600 | `#333` |
| Dropdown entry count | 11px | 400 | `#999` |
| Dropdown zipcode | 12px | 400 | `#999` |
| Confirmation card | 12px | 400 | `#555` |
| Helper text | 11px | 400 italic | `#aaa` |
| "Cleared" flash label | 10px | 500 | `#4caf50` |

### Font family

`'Prompt', sans-serif` — applied to all form elements, buttons, labels, and inputs in this feature.

### When in doubt

If a situation isn't explicitly covered by this spec, use the existing Bloomerang component and style defaults. Do not introduce new patterns, colors, or spacing that aren't already present in the product or documented here.

---

## Feature summary

Users editing a constituent's address can type into a "Search for an Address" field to get autocomplete suggestions from the Smarty API. Selecting a result triggers a confirmation step, then replaces all address fields. If the search fails (no results) or is invalid (PO Box), the user is guided to manual entry via an explicit link that clears the search and focuses the Address field.

---

## Scope: US addresses only

The address autofill feature applies **only when Country = United States**.

For non-US countries, the Edit Address form has a different structure — no City, State, or ZIP Code fields, just a free-form Address textarea. The "Search for an Address" field and all autocomplete functionality should not be rendered in this case.

**Implementation:** Conditionally render the search field based on the selected Country value. If Country changes away from United States while the search is in use, reset search state to idle and hide the search field.

---

## Focus behavior on page load

**Decision: retain focus on the Country field (existing behavior). Do not auto-focus the Search for an Address field.**

This was explicitly considered and declined for two reasons:

1. **Accessibility (WCAG 2.4.3, Level A — Focus Order):** Focus must follow a logical sequence that matches DOM order and preserves operability. Country sits above the search field in the DOM and determines whether the search field appears at all. Auto-focusing the search field would cause screen reader and keyboard users to encounter fields out of DOM order, requiring them to navigate backwards to reach Country — a conformance failure at the baseline level.

2. **User experience:** Country controls the entire form structure. Focusing past it assumes the user's intent (replace a US address) before that's been established. Users who only need to correct a single field would also land in the wrong place. The search field's discoverability is addressed through the helper text (*"Type an address above to auto-fill the fields below"*) rather than by overriding focus order.

---

## Component: Search for an Address

### States

| State | Trigger | UI |
|---|---|---|
| Idle | Empty search input | Placeholder text: "Start typing an address..." Search icon in gray (`#999`). |
| Typing | User types non-PO-Box text | Search icon turns green (`#4caf50`). Dropdown appears with results. Input border green. |
| Confirming | User clicks a dropdown result | Dropdown closes. Confirmation card appears below search. |
| Replaced | User clicks Replace | Confirmation card closes. Fields update. Search clears. Bad Address checkbox clears (with flash). |
| No Results | Search returns no matches | No-results message with "Enter the address manually" link. |
| PO Box | Input matches `/po\s*box/i` | Error message with "enter the address manually" link. |

### Search input

- **Label:** "Search for an Address" — `fontSize: 14px`, `fontWeight: 500`, `color: #999`
- **Placeholder:** "Start typing an address..." — `color: #aaa`
- **Icon:** Magnifying glass, positioned left (absolute, 10px left, 11px top). Color: `#999` idle, `#4caf50` active.
- **Active state:** Border `1px solid #4caf50`. No box-shadow.
- **Idle state:** Border `1px solid #d0d0d0`.
- **Focus state:** Border `1px solid #4caf50` (matches Bloomerang's existing field focus convention).
- **Padding:** `0 10px 0 32px` (room for icon)

---

## Component: Dropdown Results

**Spec-level detail (complex interaction)**

### Data format (Smarty US Autocomplete Pro)

Each suggestion contains: `street_line`, `secondary`, `city`, `state`, `zipcode`, `entries`

### Rendering per row

```
{street_line} {secondary} {entries > 0 ? "(N entries)" : ""} — {city}, {state} {zipcode}
```

**Typography rules:**

- `street_line` + `secondary`: normal weight, color `#333`
- `(N entries)`: fontSize 11, color `#999`
- Em dash separator (`—`)
- **City, State**: `fontWeight: 600`, color `#333` — this is the primary disambiguation signal
- `zipcode`: color `#999`

**Interaction:**

- Hover state: background `#eaf6ea` (green light)
- Click: sets selected result, transitions to Confirming state
- Border between items: `1px solid #f2f2f2`

**Entries > 0 behavior (production):**

When a result has `entries > 0`, clicking it should drill down to show secondary address options (Apt 1, Apt 2, etc.) per Smarty's recommended UX pattern. The badge alone is not self-explanatory — the drill-down is essential.

**Mobile — virtual keyboard and dropdown visibility:**

On mobile devices, the soft keyboard reduces the visible viewport when the search field is focused. Ensure the dropdown scrolls into view and is not obscured by the keyboard. The dropdown should remain accessible without requiring the user to dismiss the keyboard first.

### Acceptance criteria

- [ ] Dropdown appears when user types 1+ characters (non-PO-Box)
- [ ] Results render in Smarty format with bold city/state
- [ ] Clicking a result transitions to confirmation
- [ ] Results with `entries > 0` show the count badge and trigger drill-down
- [ ] Dropdown is visible and scrollable when soft keyboard is open on mobile

---

## Component: Confirmation Card

**Copy:** "Replace all address fields with **{street_line}, {city}, {state} {zipcode}**?"

**Buttons:**

- **Replace** (primary): background `#3a8fa3` (teal), white text. Updates all address fields, clears search, clears Bad Address checkbox (with flash).
- **Cancel** (secondary): white background, `1px solid #ccc` border, color `#555`. Returns to idle state, clears search and selection.

### Acceptance criteria

- [ ] Confirmation text includes "all address fields" (not "current address")
- [ ] Replace updates street_line, secondary, city, state, zipcode
- [ ] Cancel returns to idle without modifying any fields

---

## Component: PO Box Error

**Spec-level detail (complex interaction)**

**Trigger:** Search input matches `/po\s*box/i`

**Copy:**

> **PO Boxes aren't supported.**
> Please enter a street address instead, or [enter the address manually].

**"enter the address manually" link behavior:**

1. Clears the search input value
2. Resets search state to idle (closes the error message)
3. After ~50ms (allow state update), shifts focus to the Address `<textarea>`

**Styling:** Same container as no-results (`#fafafa` background, `1px solid #e0e0e0` border). Link is `color: #298BAB`, `text-decoration: none`, `fontWeight: 500`. Color darkens to `#1f6d87` on hover.

### Acceptance criteria

- [ ] PO Box pattern triggers error (case-insensitive, with or without space)
- [ ] Copy says "street address" — NOT "deliverable street address"
- [ ] "enter the address manually" link clears search, focuses Address field
- [ ] Focus shift works reliably (slight delay for state update)

---

## Component: No-Results Message

**Spec-level detail (complex interaction)**

**Copy:**

> **No matching addresses found.**
> [Enter the address manually]

**Link behavior:** Identical to PO Box manual link — clears search, resets state, focuses Address textarea.

**Styling:** Same container as PO Box error (`#fafafa` background, `1px solid #e0e0e0` border). Link is `color: #298BAB`, `text-decoration: none`, `fontWeight: 500`. Color darkens to `#1f6d87` on hover.

### Acceptance criteria

- [ ] No-results message appears when API returns zero suggestions
- [ ] "Enter the address manually" is a clickable link (not plain text instruction)
- [ ] Link clears search and focuses Address field

---

## Component: Address Fields

All address fields are **editable at all times**. The search bar is an accelerator — not the only input method.

| Field | Element | Height | Max Width |
|---|---|---|---|
| Address | `<textarea>` | 72px | 100% |
| City | `<input type="text">` | 36px | 100% |
| State | `<input type="text">` | 36px | 200px |
| ZIP Code | `<input type="text">` | 36px | 160px |

**Shared input styling:** `border: 1px solid #d0d0d0`, `borderRadius: 3px`, `fontSize: 13px`, `fontFamily: 'Prompt', sans-serif`, `color: #202020`, white background, `outline: none`.

**Focus state:** `border: 1px solid #4caf50` (matches Bloomerang's existing focus convention — green border, no shadow).

**Field labels:** `fontSize: 14px`, `fontWeight: 500`, `color: #999`.

**Autofill state** (after Replace populates fields): `border: 1px solid #4caf50`, `background: #eaf6ea`, `color: #2d7a30`.

### Acceptance criteria

- [ ] All four fields are editable real inputs (not display divs)
- [ ] Fields update when a search result is confirmed via Replace
- [ ] Fields retain manual edits if no search is performed

---

## Component: Bad Address Checkbox Flash

**Trigger:** Replace action when Bad Address is checked.

**Sequence:**

1. Set checkbox to unchecked
2. Apply flash style: `background: #b8f0d0`, `boxShadow: 0 0 0 4px rgba(58,143,163,0.3)`
3. Show "Cleared" label next to checkbox: `fontSize: 10px`, `color: #4caf50`, `fontWeight: 500`
4. After 1500ms, remove flash style and label

**Transition:** `background 0.4s ease, box-shadow 0.4s ease`

### Acceptance criteria

- [ ] Checkbox unchecks on Replace
- [ ] Flash is visible for ~1.5 seconds
- [ ] "Cleared" label appears during flash
- [ ] If Bad Address is already unchecked, no flash occurs

---

## Component: Search Discoverability Helper Text

V2 testing surfaced a Major issue: with editable fields, some users (mainly Volunteer Coordinators and Executive Directors) go straight to the Address textarea and never discover the search autofill.

**Copy:** *Type an address above to auto-fill the fields below*

**Placement:** Between the search field and the Address textarea.

**Visibility:** Only when the search is in idle state (initial load, or after cancel/manual entry reset). Hidden during active search, confirmation, error states, or after a successful replacement.

**Styling:** `fontSize: 11px`, `color: #aaa`, `fontStyle: italic`, `marginBottom: 10px`

### Acceptance criteria

- [ ] Helper text is visible on initial page load
- [ ] Helper text hides when user starts typing in search
- [ ] Helper text hides after a successful Replace
- [ ] Helper text reappears if search is canceled or reset to idle
- [ ] Text does not interfere with error messages or confirmation card

---

## Accessibility notes

- **Keyboard navigation in dropdown:** Arrow keys to navigate, Enter to select. Required for WCAG 2.1 Level A (keyboard operability). Not in the prototype but required for production.
- **Focus management:** "enter manually" links must shift focus programmatically to the Address textarea.
- **Type field label:** Uses `#4caf50` (green) to indicate required fields — matching Bloomerang's existing convention for required field labels. Not changing here.

---

## Out of scope

- Search text pre-fill on fallback — when "enter manually" is clicked, copying the search query into the Address field. Identified in V2 testing (7/100 personas expected it). Deferred to a future iteration to simplify initial scope.
- Post-replace field flash (green highlight on updated fields) — noted separately for dev implementation
- Type field label color consistency — existing required-field pattern, separate initiative

---

## Observation: Remaining friction on manual entry path

Volunteer Coordinators and Executive Directors still show higher friction than other archetypes when falling back to manual entry. **This friction is about the existing form layout** (field format uncertainty, which-field-goes-where hesitation) — not the autocomplete feature. The helper text addresses the discoverability gap, but the underlying form-layout hesitation is a pre-existing concern. This distinction matters for prioritization: the autofill feature is not the source of remaining friction.
