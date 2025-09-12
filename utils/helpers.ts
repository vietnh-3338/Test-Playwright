// Helper functions for test automation

import { TestScenario } from './testData';

/**
 * Generate a timestamp-based filename
 */
export function generateTimestampedFilename(prefix: string, extension: string): string {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}.${extension}`;
}

/**
 * Save PDF buffer to file
 */
export async function savePdfBuffer(buffer: Buffer, filePath: string): Promise<void> {
  const fs = require('fs');
  const path = require('path');
  
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, buffer);
}

/**
 * Create mock download object for PDF testing
 */
export function createMockDownload(pdfBuffer: Buffer, filename: string) {
  return {
    suggestedFilename: () => filename,
    path: async () => {
      const fs = require('fs');
      const path = require('path');
      const tempPath = path.join('./test-downloads', `temp-${Date.now()}.pdf`);
      
      // Ensure directory exists
      const dir = path.dirname(tempPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(tempPath, pdfBuffer);
      return tempPath;
    },
    saveAs: async (path: string) => {
      await savePdfBuffer(pdfBuffer, path);
    },
    _buffer: pdfBuffer
  };
}

/**
 * Generate PDF using Playwright's pdf() method
 */
export async function generatePdfFromPage(page: any, options: any = {}) {
  const defaultOptions = {
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  };
  
  return await page.pdf({ ...defaultOptions, ...options });
}

/**
 * Wait for page load with network idle
 */
export async function waitForPageLoad(page: any, timeout: number = 15000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Clean up temporary files
 */
export function cleanupTempFiles(directory: string) {
  const fs = require('fs');
  const path = require('path');
  
  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory);
    files.forEach((file: string) => {
      if (file.startsWith('temp-')) {
        fs.unlinkSync(path.join(directory, file));
      }
    });
  }
}

// Test scenario helper functions
export function getScenarioByName(scenarios: TestScenario[], name: string): TestScenario | undefined {
  return scenarios.find(scenario => scenario.scenarioName === name);
}

export function getScenariosByCriteria(scenarios: TestScenario[], criteria: Partial<TestScenario>): TestScenario[] {
  return scenarios.filter(scenario => {
    return Object.entries(criteria).every(([key, value]) => 
      scenario[key as keyof TestScenario] === value
    );
  });
}

export function getApprovedScenarios(scenarios: TestScenario[]): TestScenario[] {
  return scenarios.filter(scenario => scenario.step5Selection === 'approved');
}

export function getNotAppliedScenarios(scenarios: TestScenario[]): TestScenario[] {
  return scenarios.filter(scenario => scenario.step5Selection === 'notApplied');
}
