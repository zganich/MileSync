const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const logger = require('../config/logger');

class PDFProcessor {
  constructor() {
    this.mileagePatterns = [
      // Common mileage patterns
      /(\d{1,3}(?:,\d{3})*)\s*miles?/gi,
      /mileage[:\s]*(\d{1,3}(?:,\d{3})*)/gi,
      /odometer[:\s]*(\d{1,3}(?:,\d{3})*)/gi,
      /(\d{1,3}(?:,\d{3})*)\s*mi/gi,
      /total[:\s]*(\d{1,3}(?:,\d{3})*)/gi,
      // Date and mileage combinations
      /(\d{1,2}\/\d{1,2}\/\d{2,4})[:\s]*(\d{1,3}(?:,\d{3})*)/gi,
      // Trip-specific patterns
      /trip[:\s]*(\d{1,3}(?:,\d{3})*)/gi,
      /distance[:\s]*(\d{1,3}(?:,\d{3})*)/gi
    ];
    
    this.datePatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{2,4})/g,
      /(\d{4}-\d{2}-\d{2})/g,
      /(\d{1,2}-\d{1,2}-\d{2,4})/g
    ];
  }

  async processPDF(filePath) {
    try {
      logger.info(`Processing PDF: ${filePath}`);
      
      // Read PDF file
      const dataBuffer = await fs.readFile(filePath);
      
      // Parse PDF content
      const pdfData = await pdfParse(dataBuffer);
      
      // Extract text content
      const textContent = pdfData.text;
      
      if (!textContent || textContent.trim().length === 0) {
        throw new Error('No text content found in PDF');
      }
      
      logger.info(`Extracted ${textContent.length} characters from PDF`);
      
      // Extract mileage data
      const mileageData = this.extractMileageData(textContent);
      
      // Extract date information
      const dates = this.extractDates(textContent);
      
      // Extract trip information
      const trips = this.extractTrips(textContent, dates);
      
      return {
        success: true,
        data: {
          textContent,
          mileageData,
          dates,
          trips,
          pageCount: pdfData.numpages,
          fileSize: dataBuffer.length
        }
      };
      
    } catch (error) {
      logger.error(`Error processing PDF ${filePath}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  extractMileageData(text) {
    const mileageEntries = [];
    
    this.mileagePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const mileage = parseInt(match[1].replace(/,/g, ''));
        if (mileage && mileage > 0 && mileage < 1000000) { // Reasonable mileage range
          mileageEntries.push({
            value: mileage,
            context: this.getContext(text, match.index, 50),
            pattern: pattern.source
          });
        }
      }
    });
    
    // Remove duplicates and sort
    const uniqueEntries = mileageEntries.filter((entry, index, self) => 
      index === self.findIndex(e => e.value === entry.value)
    );
    
    return uniqueEntries.sort((a, b) => a.value - b.value);
  }

  extractDates(text) {
    const dates = [];
    
    this.datePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const dateStr = match[1];
        const date = this.parseDate(dateStr);
        if (date && this.isValidDate(date)) {
          dates.push({
            dateString: dateStr,
            date: date,
            context: this.getContext(text, match.index, 30)
          });
        }
      }
    });
    
    // Remove duplicates and sort
    const uniqueDates = dates.filter((entry, index, self) => 
      index === self.findIndex(e => e.date.getTime() === entry.date.getTime())
    );
    
    return uniqueDates.sort((a, b) => a.date - b.date);
  }

  extractTrips(text, dates) {
    const trips = [];
    
    // Look for patterns that suggest trip entries
    const tripPatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{2,4})[:\s]*(\d{1,3}(?:,\d{3})*)[:\s]*(\d{1,3}(?:,\d{3})*)/gi,
      /trip[:\s]*(\d{1,2}\/\d{1,2}\/\d{2,4})[:\s]*(\d{1,3}(?:,\d{3})*)[:\s]*(\d{1,3}(?:,\d{3})*)/gi
    ];
    
    tripPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const dateStr = match[1];
        const startMileage = parseInt(match[2].replace(/,/g, ''));
        const endMileage = parseInt(match[3].replace(/,/g, ''));
        
        if (startMileage && endMileage && endMileage > startMileage) {
          const date = this.parseDate(dateStr);
          if (date && this.isValidDate(date)) {
            trips.push({
              date: date,
              startMileage,
              endMileage,
              totalMiles: endMileage - startMileage,
              context: this.getContext(text, match.index, 100)
            });
          }
        }
      }
    });
    
    return trips.sort((a, b) => a.date - b.date);
  }

  parseDate(dateStr) {
    try {
      // Handle different date formats
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const month = parseInt(parts[0]);
          const day = parseInt(parts[1]);
          let year = parseInt(parts[2]);
          
          // Handle 2-digit years
          if (year < 100) {
            year += year < 50 ? 2000 : 1900;
          }
          
          return new Date(year, month - 1, day);
        }
      } else if (dateStr.includes('-')) {
        return new Date(dateStr);
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  isValidDate(date) {
    return date instanceof Date && !isNaN(date) && 
           date.getFullYear() >= 2020 && 
           date.getFullYear() <= 2030;
  }

  getContext(text, index, length) {
    const start = Math.max(0, index - length);
    const end = Math.min(text.length, index + length);
    return text.substring(start, end).trim();
  }

  // Simple validation for extracted data
  validateExtractedData(data) {
    const issues = [];
    
    if (!data.trips || data.trips.length === 0) {
      issues.push('No trip data found');
    }
    
    if (!data.dates || data.dates.length === 0) {
      issues.push('No date information found');
    }
    
    if (!data.mileageData || data.mileageData.length === 0) {
      issues.push('No mileage data found');
    }
    
    // Check for reasonable mileage values
    if (data.trips) {
      data.trips.forEach((trip, index) => {
        if (trip.totalMiles > 1000) {
          issues.push(`Trip ${index + 1} has unusually high mileage: ${trip.totalMiles} miles`);
        }
        if (trip.totalMiles < 0) {
          issues.push(`Trip ${index + 1} has negative mileage`);
        }
      });
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

module.exports = new PDFProcessor();
