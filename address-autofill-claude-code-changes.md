# Address Autofill — Design Prototype Updates from User Test

## Context

This document describes changes to the **Edit Address** design prototype based on two rounds of simulated usability testing (100-persona panels). Apply these changes to the existing design prototype. These are user-test-driven changes only — other implementation notes already on the prototype (e.g., post-replace field flash) are not repeated here.

The prototype is a React component (`address-autofill-test.jsx`) rendered via `test.html`.

---

## Changes to Apply

### 1. Make address fields editable

**What changed:** Address, City, State, and ZIP Code fields were non-interactive `<div>` elements styled to look like inputs. They are now real `<input>` and `<textarea>` elements with `onChange` handlers and local state.

**Why:** The V1 design created a false affordance — fields looked clickable but weren't. 8/100 users tried to edit them directly before discovering the search bar. This was a Critical (Severity 1) issue.

**Implementation details:**
- `Address` → `<textarea>` (72px height, same styling as before)
- `City`, `State`, `ZIP Code` → `<input type="text">`
- All fields are editable at all times — the search bar is an accelerator, not the only path
- When a search result is confirmed via Replace, the field values update via state
- Fields should use consistent styling: `border: 1px solid #d0d0d0`, `borderRadius: 3`, `fontSize: 13`, `fontFamily: 'Prompt', sans-serif`, white background

### 2. PO Box error — add recovery path + plain language

**What changed:** The PO Box error message was a dead end with jargon. Now it has an actionable link and simpler copy.

**Old copy:**
```
PO Boxes aren't supported.
Please enter a deliverable street address instead.
```

**New copy:**
```
PO Boxes aren't supported.
Please enter a street address instead, or [enter the address manually].
```

**Behavior of "enter the address manually" link:**
- Clears the search input value
- Resets search state to idle (closes the error message)
- Shifts focus to the Address `<textarea>` (use `setTimeout` ~50ms to allow state update before focus)

**Why:** V1 had 28/100 users stuck at this dead end (Critical issue). "Deliverable street address" was jargon unfamiliar to novice and intermediate users (Major issue). V2 reduced PO Box friction from 41% to 28% Partial+Failure.

### 3. No-results fallback — add "Enter manually" link with focus shift

**What changed:** The no-results message was text-only instruction with no actionable affordance. Now it has a clickable link.

**Old copy:**
```
No matching addresses found.
Enter the address manually in the fields below.
```

**New copy:**
```
No matching addresses found.
[Enter the address manually]
```

**Behavior:** Same as the PO Box "enter manually" link — clears search, resets state, focuses Address textarea.

**Why:** V1 had 25/100 users unable to transition from search to manual entry (Major issue). The text instruction alone wasn't sufficient. V2 reduced no-results friction from 41% to 23% Partial+Failure.

### 4. Confirm dialog — clarify replacement scope

**Old copy:**
```
Replace current address with 135 N Pennsylvania St, Indianapolis, IN 46204?
```

**New copy:**
```
Replace all address fields with 135 N Pennsylvania St, Indianapolis, IN 46204?
```

**Why:** 7/100 users paused at the confirm step, unsure whether Replace would overwrite just the street line or all fields. "All address fields" makes the scope explicit. Minor issue.

### 5. Dropdown — Smarty US Autocomplete Pro format with city/state emphasis

**What changed:** Mock data and dropdown rendering updated to match the Smarty US Autocomplete Pro API response format.

**Mock data structure:**
```js
const MOCK_RESULTS = [
  { street_line: "135 N Pennsylvania St", secondary: "", city: "Indianapolis", state: "IN", zipcode: "46204", entries: 0 },
  { street_line: "135 N Pennsylvania Ave", secondary: "", city: "Lansing", state: "MI", zipcode: "48912", entries: 0 },
  { street_line: "135 N Penn St", secondary: "Apt", city: "York", state: "PA", zipcode: "17401", entries: 4 },
];
```

**Dropdown item rendering:**
```
135 N Pennsylvania St — Indianapolis, IN 46204
135 N Pennsylvania Ave — Lansing, MI 48912
135 N Penn St Apt (4 entries) — York, PA 17401
```

**Formatting rules:**
- `street_line` + `secondary` (if present) in normal weight
- If `entries > 0`, show `(N entries)` in `fontSize: 11`, `color: #888`
- Em dash separator (`—`)
- **City, State** in `fontWeight: 600`, `color: #333` (bold emphasis for disambiguation)
- `zipcode` in `color: #888`

**Why:** V1 had 4/100 users selecting the wrong address because all three results started with "135 N Penn..." and city/state wasn't visually emphasized. Bold city/state makes disambiguation immediate.

**Note:** The field names changed from V1 (`line1` → `street_line`, `zip` → `zipcode`). Update the `EXISTING_ADDRESS` constant and all references accordingly.

### 6. Bad Address checkbox — flash on auto-clear

**What changed:** When the Replace action clears the Bad Address checkbox, the checkbox now flashes to make the state change visible.

**Behavior:**
- On Replace, if `badAddress` is `true`:
  1. Set `badAddress` to `false`
  2. Set `badAddressFlash` to `true`
  3. After 1500ms, set `badAddressFlash` to `false`
- Flash style: `background: #b8f0d0`, `boxShadow: 0 0 0 4px rgba(58,143,163,0.3)`, with `transition: background 0.4s ease, box-shadow 0.4s ease`
- Show a "Cleared" text label next to the checkbox during flash: `fontSize: 10`, `color: #3a8fa3`, `fontWeight: 500`

**Why:** V1 had 5/100 users who didn't notice the checkbox changed. V2 flash was noticed by 9/100 and received positive feedback from Development Directors and Power Users. Cosmetic issue with easy fix.

### 7. Search discoverability helper text (new from V2)

**What changed:** V2 testing surfaced a new Major issue: with editable fields, some users (mainly Volunteer Coordinators and Executive Directors) go straight to the Address textarea and never discover the search autofill. They complete the task successfully but miss the accelerator.

**Fix:** Add an italic helper line between the search field and the address fields: *"Type an address above to auto-fill the fields below"*

**Behavior:**
- Visible when `searchState === "idle"` (initial state, or after cancel/manual entry reset)
- Hidden when the user is actively searching, confirming, viewing an error, or has completed a replacement
- Styling: `fontSize: 11`, `color: #bbb` (grayLight), `fontStyle: italic`, `marginBottom: 10`

**Why:** This nudges users toward the search field without being intrusive, and disappears once search is being used or after a successful replacement. It does not restrict manual entry.

---

## Things NOT changed (and why)

- **Search text pre-fill on fallback:** When "enter manually" is clicked, the search query could auto-populate the Address field to save a retype. 7/100 V2 personas expected this. Discussed and **deferred to a future iteration** to simplify initial scope. Do not implement in this update.
- **Type field label color (teal vs gray):** Existing pattern designating required fields. Out of scope for this feature.
- **Post-replace field flash on updated fields:** Already noted on the design prototype as an implementation note for engineering. Not a user-test-driven change.
- **Keyboard navigation in dropdown:** Flagged by Power Users as an accessibility requirement (WCAG 2.1 Level A). Should be implemented in production but is a standard interaction pattern, not a design prototype concern.

---

## Remaining observation for documentation

Volunteer Coordinators and Executive Directors still show higher friction than other archetypes on the manual entry fallback path. This friction is about the **existing form layout** (field format uncertainty, which-field-goes-where hesitation) — not the autocomplete feature addition. The autocomplete feature performs well for these archetypes when they find it. Document this distinction so it's clear the address autofill feature is not the source of remaining friction.
