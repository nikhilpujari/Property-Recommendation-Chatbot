import { google, sheets_v4 } from 'googleapis';

interface CustomerData {
  name: string;
  contact: string;
  interest: string;
  timestamp: string;
  propertyInterest?: string;
  locationInterest?: string;
  budgetRange?: string;
  notes?: string;
}

// Keep a local cache of the contacts we've seen
// Map of contact info -> row number in the sheet
const contactRowMap = new Map<string, number>();

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private readonly sheetId: string;

  constructor() {
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    // Initialize the Google Sheets API
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
    this.sheetId = process.env.GOOGLE_SHEET_ID || '';
    
    if (!this.sheetId) {
      console.warn('Warning: GOOGLE_SHEET_ID environment variable is not set.');
    }
  }

  /**
   * Check if a contact exists in the sheet and find its row number
   */
  private async findContactRow(contact: string): Promise<number | null> {
    try {
      // First check our local cache
      if (contactRowMap.has(contact)) {
        return contactRowMap.get(contact) || null;
      }

      // If not in cache, search the sheet
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Sheet1!C:C', // Contact column (Column C)
      });

      const rows = response.data.values;
      if (rows && rows.length > 0) {
        // Start from 1 because row 0 is headers
        for (let i = 1; i < rows.length; i++) {
          if (rows[i] && rows[i][0] === contact) {
            // Add to cache for future use
            contactRowMap.set(contact, i + 1); // +1 because sheet rows are 1-indexed
            return i + 1;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error finding contact in sheet:', error);
      return null;
    }
  }

  /**
   * Adds a new row to the Google Sheet with customer data or updates an existing row
   */
  async addCustomerData(data: CustomerData): Promise<boolean> {
    try {
      if (!this.sheetId) {
        console.error('Error: Google Sheet ID is not configured');
        return false;
      }

      // Format the data as a row
      const values = [
        data.timestamp || new Date().toISOString(),
        data.name,
        data.contact,
        data.interest,
        data.propertyInterest || '',
        data.locationInterest || '',
        data.budgetRange || '',
        data.notes || ''
      ];

      // Check if this contact already exists
      const existingRow = await this.findContactRow(data.contact);

      if (existingRow) {
        // Update the existing row
        const result = await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.sheetId,
          range: `Sheet1!A${existingRow}:H${existingRow}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [values]
          }
        });
        return result.status === 200;
      } else {
        // Append a new row
        const result = await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.sheetId,
          range: 'Sheet1!A:H',
          valueInputOption: 'RAW',
          requestBody: {
            values: [values]
          }
        });

        if (result.status === 200) {
          // If the API doesn't return the row number, we can roughly estimate it
          // This is not 100% accurate but good enough for our cache
          const updatedRange = result.data.updates?.updatedRange;
          if (updatedRange) {
            const match = updatedRange.match(/A(\d+):/);
            if (match && match[1]) {
              const rowNumber = parseInt(match[1]);
              contactRowMap.set(data.contact, rowNumber);
            }
          }
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error adding/updating data in Google Sheet:', error);
      return false;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();