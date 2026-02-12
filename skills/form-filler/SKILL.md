# form-filler

Detect form fields on a page, fill them with provided data, and submit. Handles multi-step forms, dropdowns, checkboxes, and radio buttons.

## Usage

```
/form-filler https://example.com/signup {"first_name": "Jane", "last_name": "Doe", "email": "jane@example.com"}
```

## What it does

Uses browsy's page intelligence and form interaction tools to fill and submit forms:

- **Field detection** — uses `browsy_page_info` and `browsy_find` to identify all form fields by label, ARIA role, and input type (text, email, date, number, select, checkbox, radio)
- **Smart matching** — maps provided data keys to form fields by matching against labels, names, and placeholder text
- **Type-aware filling** — dispatches to the correct tool for each field type: `browsy_type_text` for text/email/date/number, `browsy_select` for dropdowns, `browsy_check`/`browsy_uncheck` for checkboxes and radios
- **State verification** — calls `browsy_get_page` after filling to confirm values were applied correctly before submitting
- **Multi-step support** — after form submission via `browsy_click`, checks the resulting page for continuation forms and repeats the fill-verify-submit cycle
- **Error detection** — checks the post-submission page for validation errors and reports them

## Workflow

1. `browsy_browse` — navigate to the form page (or use current page)
2. `browsy_page_info` — identify page type and form structure
3. `browsy_find` — locate all input fields by role:
   - `role: "textbox"` — text inputs, textareas
   - `role: "combobox"` — dropdown selects
   - `role: "checkbox"` — checkboxes
   - `role: "radio"` — radio buttons
4. Match provided data keys to detected fields
5. Fill each matched field:
   - Text/email/date/number: `browsy_type_text`
   - Dropdowns: `browsy_select`
   - Checkboxes: `browsy_check` or `browsy_uncheck`
   - Radio buttons: `browsy_check`
6. `browsy_get_page` — verify form state matches expected values
7. `browsy_find` — locate submit/continue button
8. `browsy_click` — submit the form
9. Check resulting page for errors or next step

## Example output

```
Navigating to https://example.com/signup...

Page detected: Form
Fields detected: 5

=== Field Mapping ===

| Field              | Type     | Value              | Status |
|-------------------|----------|--------------------|--------|
| First name         | text     | Jane               | filled |
| Last name          | text     | Doe                | filled |
| Email              | email    | jane@example.com   | filled |
| Country            | select   | US                 | selected |
| Accept terms       | checkbox | true               | checked |

=== Verification ===

All 5 fields verified via browsy_get_page.

Submitting form...

Result: Redirected to https://example.com/welcome
Page type: Content
No validation errors detected.

Form submitted successfully.
```

## Example with multi-step form

```
Navigating to https://gov.example.com/apply...

=== Step 1 of 3: Personal Information ===

Filled 4 fields: first name, last name, date of birth, preferred contact.
Verified. Submitting...

=== Step 2 of 3: Address ===

Filled 4 fields: street address, city, state (dropdown), ZIP code.
Verified. Submitting...

=== Step 3 of 3: Review & Consent ===

Checked: "I agree to the privacy policy"
Submitting...

Result: Application submitted. Confirmation number: GOV-2026-48291
```

## Requirements

- `@openclaw/browsy` plugin must be registered
- browsy server must be running (auto-started if `autoStart: true`)
- Form data must be provided as a JSON object with keys that match field labels
