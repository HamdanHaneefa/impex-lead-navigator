# Google Sheets Integration Setup

This guide will help you connect the IMPEX xSeries lead form to Google Sheets.

## Option 1: Google Apps Script (Recommended - Free)

1. **Create a new Google Sheet** with these column headers:
   - Timestamp
   - Environment
   - Display Size
   - Quantity
   - Timeline
   - Full Name
   - Email
   - Phone
   - Organization
   - City
   - Role
   - Notes
   - Source

2. **Create a Google Apps Script**:
   - In your Google Sheet, go to Extensions > Apps Script
   - Replace the default code with:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp,
      data.environment,
      data.display_size,
      data.quantity,
      data.timeline,
      data.full_name,
      data.email,
      data.phone,
      data.organization,
      data.city || '',
      data.role || '',
      data.notes || '',
      data.source
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy the script**:
   - Click "Deploy" > "New deployment"
   - Select type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the Web App URL

4. **Add the URL to your .env file**:
```
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Option 2: Sheet.best (Easy, Paid)

1. Go to [sheet.best](https://sheet.best/)
2. Connect your Google Sheet
3. Get your API endpoint
4. Add to .env:
```
VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://sheet.best/api/sheets/YOUR_SHEET_ID
```

## Option 3: Zapier or Make (Integromat)

1. Create a webhook trigger in Zapier/Make
2. Connect it to Google Sheets
3. Map the form fields to sheet columns
4. Add the webhook URL to .env

## Testing

After setup, test the form submission. Check your Google Sheet to verify data is being recorded correctly.

## Troubleshooting

- Check browser console for errors
- Verify the webhook URL is correct in .env
- Ensure Google Apps Script has proper permissions
- Check that column headers match the data structure
