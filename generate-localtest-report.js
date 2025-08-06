const fs = require('fs-extra');
const path = require('path');
const pdfService = require('./src/services/pdfService');
const docxService = require('./src/services/docxService');

async function generateLocalTestReport() {
    try {
        console.log('📖 Reading LocalTest.txt data...');
        const localTestData = JSON.parse(fs.readFileSync('./LocalTest.txt', 'utf8'));
        
        console.log('📊 LocalTest (TestVWA) Scan Summary:');
        console.log(`- Repository: ${localTestData.repo_url}`);
        console.log(`- Total files scanned: ${localTestData.progress.total_files}`);
        console.log(`- Vulnerability counts:`);
        console.log(`  • Critical: ${localTestData.vulnerability_count.Critical || 0}`);
        console.log(`  • High: ${localTestData.vulnerability_count.High}`);
        console.log(`  • Medium: ${localTestData.vulnerability_count.Medium}`);
        console.log(`  • Low: ${localTestData.vulnerability_count.Low}`);
        
        // Transform LocalTest data to match our report format
        const reportData = {
            // Top-level fields expected by template
            repo_url: localTestData.repo_url,
            repo_id: localTestData.repo_id,
            branch: localTestData.branch,
            report_id: localTestData.report_id,
            scan_id: localTestData.report_id,
            scan_date: localTestData.created_at,
            scan_status: localTestData.status,
            scan_type: localTestData.scan_type,
            scan_duration: Math.round((new Date(localTestData.completed_at) - new Date(localTestData.created_at)) / 1000 / 60) + ' minutes',
            created_at: localTestData.created_at,
            completed_at: localTestData.completed_at,
            
            // Repository structure
            repository: {
                name: "TestVWA",
                url: localTestData.repo_url,
                branch: localTestData.branch
            },
            
            // Progress information
            progress: localTestData.progress,
            
            // Scan information
            scan: {
                id: localTestData.report_id,
                date: localTestData.created_at,
                status: localTestData.status,
                duration: Math.round((new Date(localTestData.completed_at) - new Date(localTestData.created_at)) / 1000 / 60) + ' minutes'
            },
            
            // Vulnerabilities summary counts (no detailed data to avoid duplication)
            vulnerabilities: {
                total: (localTestData.vulnerability_count.Critical || 0) + localTestData.vulnerability_count.High + localTestData.vulnerability_count.Medium + localTestData.vulnerability_count.Low,
                critical: localTestData.vulnerability_count.Critical || 0,
                high: localTestData.vulnerability_count.High,
                medium: localTestData.vulnerability_count.Medium,
                low: localTestData.vulnerability_count.Low
            },
            
            // Scan results for detailed security analysis section
            scan_results: localTestData.scan_results,
            
            // Repository information
            repository_info: localTestData.repository_info
        };
        
        console.log('\n📄 Generating PDF report...');
        const pdfPath = path.join(__dirname, 'reports', `testvwa-security-report-${Date.now()}.pdf`);
        await fs.ensureDir(path.dirname(pdfPath));
        await pdfService.generatePDF(reportData, pdfPath);
        console.log(`✅ PDF report generated: ${pdfPath}`);
        
        console.log('\n📄 Generating DOCX report...');
        const docxPath = path.join(__dirname, 'reports', `testvwa-security-report-${Date.now()}.docx`);
        await docxService.generateDocx(reportData, docxPath);
        console.log(`✅ DOCX report generated: ${docxPath}`);
        
        console.log('\n🎉 TestVWA security reports generated successfully!');
        
    } catch (error) {
        console.error('❌ Error generating TestVWA report:', error);
    }
}

generateLocalTestReport();
