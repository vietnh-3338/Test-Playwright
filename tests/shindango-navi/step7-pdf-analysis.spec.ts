import { test, expect } from '@playwright/test';
import { ShindangoNaviApp } from '../../pages/app.page';
import { PdfVerifier } from '../../utils/pdfVerifier';

test.describe('Step 7: PDF Content Analysis', () => {
  let app: ShindangoNaviApp;
  let pdfVerifier: PdfVerifier;

  test.beforeEach(async ({ page }) => {
    app = new ShindangoNaviApp(page);
    pdfVerifier = new PdfVerifier('./test-downloads');
  });

  test('Analyze PDF Content', async ({ page }) => {
    console.log('\n=== Analyzing PDF Content ===');
    
    const testPostalCode = '0640941';
    
    // Complete workflow to Step 7 results page
    await app.completeToStep7Results(testPostalCode);
    await app.step7Results.verifyResultsPageLoaded();
    console.log('  ✓ Results page loaded');
    
    // Download PDF
    const download = await app.step7Results.downloadPdfFromSaveButton();
    const pdfPath = await pdfVerifier.savePdfDownload(download, 'content-analysis.pdf');
    console.log(`  ✓ PDF saved: ${pdfPath}`);
    
    // Extract and analyze PDF text
    try {
      const pdfText = await pdfVerifier.extractPdfText(pdfPath);
      console.log(`\n📄 PDF Content Analysis:`);
      console.log(`   - Total text length: ${pdfText.length} characters`);
      
      // Show first 500 characters
      console.log(`\n📝 First 500 characters of PDF:`);
      console.log(pdfText.substring(0, 500));
      console.log('...');
      
      // Show last 500 characters  
      console.log(`\n📝 Last 500 characters of PDF:`);
      console.log('...');
      console.log(pdfText.substring(Math.max(0, pdfText.length - 500)));
      
      // Search for common keywords
      const keywords = [
        '札幌', '中央区', '役所', '保健', '福祉', '地域', '包括', '支援', 'センター',
        '011', '205', '520', '3304', '3668',
        'アドレス', 'address', '住所', '電話', 'phone', 'tel'
      ];
      
      console.log(`\n🔍 Keyword Analysis:`);
      keywords.forEach(keyword => {
        const count = (pdfText.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        if (count > 0) {
          console.log(`   - "${keyword}": found ${count} time(s)`);
        }
      });
      
      // Check if PDF contains any Japanese text
      const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(pdfText);
      console.log(`   - Contains Japanese text: ${hasJapanese}`);
      
      // Check if PDF contains any numbers
      const hasNumbers = /\d/.test(pdfText);
      console.log(`   - Contains numbers: ${hasNumbers}`);
      
      // Save full text to file for inspection
      const fs = require('fs');
      const textPath = pdfPath.replace('.pdf', '.txt');
      fs.writeFileSync(textPath, pdfText, 'utf8');
      console.log(`   ✓ Full text saved to: ${textPath}`);
      
    } catch (error) {
      console.log(`❌ PDF text extraction failed: ${error}`);
    }
    
    // Also check what's on the original results page
    console.log(`\n📄 Original Page Content Analysis:`);
    const pageText = await app.step7Results.getPageContent();
    console.log(`   - Page text length: ${pageText.length} characters`);
    
    // Search for contact info on original page
    const contactKeywords = [
      '札幌市中央区役所', '保健福祉課福祉支援一・二係', '011‑205‑3304',
      '札幌市中央区旭ケ丘5丁目6-51', '中央区第2地域包括支援センター', '011‑520‑3668'
    ];
    
    console.log(`\n🔍 Contact Info on Original Page:`);
    contactKeywords.forEach(keyword => {
      const found = pageText.includes(keyword);
      console.log(`   - "${keyword}": ${found ? '✓ FOUND' : '❌ NOT FOUND'}`);
    });
    
    console.log('\n=== Analysis Complete ===');
  });
});
