/**
 * Utility functions for handling CSV data
 */

/**
 * Reads a CSV file from the public directory
 * @param filePath Path to the CSV file relative to the public directory
 * @returns The CSV content as a string
 */
export async function readCSVFile(filePath: string): Promise<string> {
  try {
    // Remove leading slash if present to properly form the path
    const path = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    const response = await fetch(`/${path}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load CSV file: ${response.status} ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error("Error reading CSV file:", error);
    throw error;
  }
} 