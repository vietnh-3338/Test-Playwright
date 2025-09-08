# PowerShell script to remove console.log statements from TypeScript files
# Usage: ./scripts/remove-console-logs.ps1

Write-Host "Removing console.log statements from TypeScript files..." -ForegroundColor Yellow

# Define the project root directory
$projectRoot = Split-Path -Parent $PSScriptRoot

# Get all TypeScript files in the project
$tsFiles = Get-ChildItem -Path $projectRoot -Recurse -Include "*.ts" -Exclude "*.d.ts" | Where-Object {
    $_.FullName -notlike "*node_modules*" -and
    $_.FullName -notlike "*playwright-report*" -and
    $_.FullName -notlike "*test-results*"
}

$totalFiles = 0
$modifiedFiles = 0
$totalLogsRemoved = 0

foreach ($file in $tsFiles) {
    $totalFiles++
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Count console.log statements before removal
    $logCount = ([regex]::Matches($content, "console\.log\s*\([^)]*\)\s*;?", [System.Text.RegularExpressions.RegexOptions]::Multiline)).Count
    
    if ($logCount -gt 0) {
        Write-Host "Processing: $($file.Name) - Found $logCount console.log statements" -ForegroundColor Cyan
        
        # Remove console.log statements with various patterns
        # Pattern 1: Simple console.log(...);
        $content = $content -replace "^\s*console\.log\s*\([^)]*\)\s*;?\s*[\r\n]*", ""
        
        # Pattern 2: console.log in the middle of lines (less common but possible)
        $content = $content -replace "console\.log\s*\([^)]*\)\s*;?\s*", ""
        
        # Clean up any extra blank lines that might have been left
        $content = $content -replace "(\r?\n){3,}", "`r`n`r`n"
        
        # Count remaining console.log statements
        $remainingCount = ([regex]::Matches($content, "console\.log\s*\([^)]*\)\s*;?", [System.Text.RegularExpressions.RegexOptions]::Multiline)).Count
        $removed = $logCount - $remainingCount
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $modifiedFiles++
            $totalLogsRemoved += $removed
            Write-Host "  ✓ Removed $removed console.log statements" -ForegroundColor Green
            
            if ($remainingCount -gt 0) {
                Write-Host "  ⚠ $remainingCount console.log statements may remain (complex patterns)" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "`nSummary:" -ForegroundColor Magenta
Write-Host "  Total files scanned: $totalFiles" -ForegroundColor White
Write-Host "  Files modified: $modifiedFiles" -ForegroundColor Green
Write-Host "  Total console.log statements removed: $totalLogsRemoved" -ForegroundColor Green

if ($modifiedFiles -gt 0) {
    Write-Host "`n✓ Console.log cleanup completed!" -ForegroundColor Green
    Write-Host "Please review the changes and run your tests to ensure everything works correctly." -ForegroundColor Yellow
} else {
    Write-Host "`nNo console.log statements found to remove." -ForegroundColor Blue
}
