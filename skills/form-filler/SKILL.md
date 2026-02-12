---
name: form-filler
description: Detect form fields on a page, fill them with provided data, and submit
---

# Form Filler

Use browsy's page intelligence to detect form fields, fill them with provided data, and submit.

## Steps

1. Use `browsy_browse` to navigate to the form page (or use current page)
2. Use `browsy_page_info` to understand the page type and suggested actions
3. Use `browsy_find` with role "textbox" to locate all text input fields
4. Use `browsy_find` with role "combobox" to locate dropdowns
5. Use `browsy_find` with role "checkbox" to locate checkboxes
6. For each field that matches provided data:
   - Text inputs: use `browsy_type_text` with the field ID and value
   - Dropdowns: use `browsy_select` with the field ID and value
   - Checkboxes: use `browsy_check` or `browsy_uncheck` as needed
7. Use `browsy_get_page` to verify the form state after filling
8. Use `browsy_find` to locate the submit button
9. Use `browsy_click` to submit the form
10. Verify submission success by checking the resulting page
