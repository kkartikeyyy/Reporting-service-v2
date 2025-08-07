const axios = require('axios');

/**
 * Test script for scanner service integration
 * This demonstrates how to use the new endpoint to generate reports from scanner service data
 */

async function testScannerIntegration() {
    const reportingServiceUrl = 'http://localhost:3500';
    const scanId = '20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac';
    
    console.log('🧪 Testing Scanner Service Integration');
    console.log('=====================================');
    console.log(`📡 Reporting Service: ${reportingServiceUrl}`);
    console.log(`🔍 Scan ID: ${scanId}`);
    console.log('');
    
    try {
        console.log('📞 Making request to generate report from scanner service...');
        
        const response = await axios.get(`${reportingServiceUrl}/api/report/generate/${scanId}`, {
            timeout: 30000, // 30 second timeout
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('✅ Success! Report generated successfully');
        console.log('📄 Response Data:');
        console.log(JSON.stringify(response.data, null, 2));
        
        if (response.data.success && response.data.data) {
            const { data } = response.data;
            console.log('\n📊 Report Summary:');
            console.log(`   📁 PDF Path: ${data.pdf_path}`);
            console.log(`   📄 DOCX Path: ${data.docx_path}`);
            console.log(`   🆔 Report ID: ${data.report_id}`);
            console.log(`   📅 Generated: ${data.generated_at}`);
            
            if (data.vulnerability_summary) {
                console.log('\n🔍 Vulnerability Summary:');
                console.log(`   🔴 Critical: ${data.vulnerability_summary.critical}`);
                console.log(`   🟠 High: ${data.vulnerability_summary.high}`);
                console.log(`   🟡 Medium: ${data.vulnerability_summary.medium}`);
                console.log(`   🟢 Low: ${data.vulnerability_summary.low}`);
                console.log(`   📈 Total: ${data.vulnerability_summary.total}`);
            }
            
            if (data.repository) {
                console.log('\n📦 Repository Info:');
                console.log(`   🌐 URL: ${data.repository.url}`);
                console.log(`   🌿 Branch: ${data.repository.branch}`);
            }
        }
        
    } catch (error) {
        console.log('❌ Error occurred during test');
        
        if (error.response) {
            console.log(`📊 Status Code: ${error.response.status}`);
            console.log(`📄 Response Data:`, error.response.data);
            
            // Handle specific error cases
            switch (error.response.status) {
                case 503:
                    console.log('\n💡 This is expected if the scanner service is not running.');
                    console.log('   To test with real data, ensure the scanner service is running on port 3000.');
                    break;
                case 404:
                    console.log('\n💡 The scan ID was not found in the scanner service.');
                    console.log('   Try with a valid scan ID from your scanner service.');
                    break;
                default:
                    console.log('\n💡 Unexpected error occurred.');
            }
        } else if (error.code === 'ECONNREFUSED') {
            console.log('📄 Error: Connection refused to reporting service');
            console.log('💡 Make sure the reporting service is running on port 3500');
        } else {
            console.log('📄 Error:', error.message);
        }
    }
    
    console.log('\n🔚 Test completed');
}

// Additional test function for direct API testing
async function testDirectAPI() {
    console.log('\n🧪 Testing Direct API (Original Endpoint)');
    console.log('==========================================');
    
    // Example scan data structure
    const mockScanData = {
        report_id: "test_20250807_direct_api",
        repo_id: "test-repo-id",
        repo_url: "https://github.com/example/test-repo.git",
        branch: "main",
        scan_type: "complete",
        status: "completed",
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        progress: {
            total_files: 10,
            processed_files: 10,
            percentage: 100
        },
        vulnerability_count: {
            Critical: 5,
            High: 10,
            Medium: 8,
            Low: 2
        },
        repository_info: {
            languages: { "JavaScript": 70, "HTML": 30 },
            total_lines: 1000,
            file_types: { ".js": 7, ".html": 3 }
        },
        scan_results: {
            "test.js": {
                analysis: "Test vulnerability analysis for demonstration",
                file_path: "src/test.js",
                file_type: "CODE"
            }
        }
    };
    
    try {
        const response = await axios.post('http://localhost:3500/api/report', mockScanData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Direct API test successful');
        console.log('📄 Response:', response.data);
        
    } catch (error) {
        console.log('❌ Direct API test failed');
        console.log('📄 Error:', error.response?.data || error.message);
    }
}

// Run tests
async function runAllTests() {
    await testScannerIntegration();
    await testDirectAPI();
}

// Check if this script is being run directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testScannerIntegration,
    testDirectAPI,
    runAllTests
};
