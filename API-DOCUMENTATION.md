# CodeShuriken Reporting Service API Documentation

## Overview

The CodeShuriken Reporting Service is a comprehensive security assessment report generation system that converts vulnerability scan data into professional PDF and DOCX reports. The service processes JSON data from security scanners and generates detailed security analysis reports with vulnerability assessments, remediation recommendations, and compliance mappings.

**Version:** 2.0  
**Base URL:** `http://localhost:3500`  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Report Generation API](#report-generation-api)
3. [Data Models](#data-models)
4. [Response Formats](#response-formats)
5. [Error Handling](#error-handling)
6. [Code Examples](#code-examples)
7. [Report Templates](#report-templates)
8. [CLI Tools](#cli-tools)

---

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

> **Note:** In production environments, implement proper authentication and authorization mechanisms.

---

## Report Generation API

### POST /api/report

Generates security assessment reports in PDF and DOCX formats from vulnerability scan data.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `report_id` | string | Yes | Unique identifier for the scan report |
| `repo_id` | string | Yes | Repository identifier |
| `repo_url` | string | Yes | Repository URL |
| `branch` | string | Yes | Git branch analyzed |
| `scan_type` | string | Yes | Type of scan (e.g., "complete", "partial") |
| `status` | string | Yes | Scan status (e.g., "completed", "failed") |
| `created_at` | string | Yes | ISO 8601 timestamp of scan start |
| `completed_at` | string | Yes | ISO 8601 timestamp of scan completion |
| `progress` | object | Yes | Scan progress information |
| `vulnerability_count` | object | Yes | Vulnerability count by severity |
| `repository_info` | object | Yes | Repository metadata |
| `scan_results` | object | Yes | Detailed vulnerability analysis |

### GET /api/report/generate/:scanId

**NEW ENDPOINT** - Generates security assessment reports by fetching scan data from the scanner microservice.

#### Request

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scanId` | string | Yes | Scan report ID from scanner service (e.g., "20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac") |

**Headers:**
```
Accept: application/json
```

**Environment Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `SCANNER_SERVICE_URL` | http://localhost:3000 | Base URL of the scanner microservice |

#### Example Request

```bash
curl -X GET "http://localhost:3500/api/report/generate/20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac"
```

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Report generated successfully from scanner service",
  "data": {
    "scan_id": "20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac",
    "report_id": "20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac",
    "db_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "pdf_path": "reports/security-report-20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac-1754545415124.pdf",
    "docx_path": "reports/security-report-20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac-1754545418138.docx",
    "generated_at": "2025-08-07T12:35:00.000Z",
    "vulnerability_summary": {
      "total": 155,
      "critical": 45,
      "high": 67,
      "medium": 32,
      "low": 11
    },
    "repository": {
      "url": "https://github.com/example/vulnerable-app.git",
      "branch": "main"
    }
  }
}
```

**Error Responses:**

**Scanner Service Unavailable (503 Service Unavailable):**
```json
{
  "success": false,
  "error": "Scanner service unavailable",
  "message": "Could not connect to scanner service. Please ensure it's running on the expected port."
}
```

**Scan Report Not Found (404 Not Found):**
```json
{
  "success": false,
  "error": "Scan report not found",
  "message": "No scan report found with ID: 20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac"
}
```

**Scanner Service Error (Variable Status):**
```json
{
  "success": false,
  "error": "Scanner service error",
  "message": "Error message from scanner service"
}
```

#### Example Request

```json
{
  "report_id": "20250807120000_abc123_COMPLETE_def456",
  "repo_id": "abc123-def4-5678-9012-def456789012",
  "repo_url": "https://github.com/example/vulnerable-app.git",
  "branch": "main",
  "scan_type": "complete",
  "status": "completed",
  "created_at": "2025-08-07T12:00:00.000Z",
  "completed_at": "2025-08-07T12:30:00.000Z",
  "progress": {
    "total_files": 50,
    "processed_files": 50,
    "percentage": 100
  },
  "vulnerability_count": {
    "Critical": 15,
    "High": 23,
    "Medium": 12,
    "Low": 5
  },
  "repository_info": {
    "languages": {
      "JavaScript": 65.5,
      "Java": 25.3,
      "Python": 9.2
    },
    "total_lines": 12500,
    "file_types": {
      ".js": 45,
      ".java": 15,
      ".py": 8
    }
  },
  "scan_results": {
    "package.json": {
      "analysis": "Detailed vulnerability analysis...",
      "file_path": "package.json",
      "file_type": "SBOM"
    }
  }
}
```

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Reports generated successfully",
  "data": {
    "pdf_path": "/reports/security-report-1754545415124.pdf",
    "docx_path": "/reports/security-report-1754545418138.docx",
    "report_id": "20250807120000_abc123_COMPLETE_def456",
    "generated_at": "2025-08-07T12:35:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid JSON format",
  "message": "Request body must be valid JSON"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Internal error generating report",
  "message": "Failed to generate PDF report"
}
```

---

## Data Models

### Vulnerability Count Object

```typescript
interface VulnerabilityCount {
  Critical: number;
  High: number;
  Medium: number;
  Low: number;
}
```

### Progress Object

```typescript
interface Progress {
  total_files: number;
  processed_files: number;
  percentage: number;
}
```

### Repository Info Object

```typescript
interface RepositoryInfo {
  languages: Record<string, number>;
  total_lines: number;
  file_types: Record<string, number>;
  structure?: object;
}
```

### Scan Results Object

```typescript
interface ScanResults {
  [filename: string]: {
    analysis: string;
    file_path: string;
    file_type: "CODE" | "SBOM" | "CONFIG" | "OTHER";
  };
}
```

### Complete Request Schema

```typescript
interface ReportRequest {
  report_id: string;
  repo_id: string;
  repo_url: string;
  branch: string;
  scan_type: string;
  status: string;
  created_at: string;
  completed_at: string;
  progress: Progress;
  vulnerability_count: VulnerabilityCount;
  repository_info: RepositoryInfo;
  scan_results: ScanResults;
  error_log?: string | null;
}
```

---

## Response Formats

### Success Response Format

All successful API responses follow this structure:

```typescript
interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}
```

### Error Response Format

All error responses follow this structure:

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: any;
}
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Report generated successfully |
| 400 | Bad Request - Invalid input data |
| 413 | Payload Too Large - Request body exceeds size limit |
| 500 | Internal Server Error - Server-side error |

### Common Error Scenarios

#### 1. Invalid JSON Format

**Request:** Malformed JSON
**Response:** 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid JSON format",
  "message": "Expected ',' or '}' after property value in JSON"
}
```

#### 2. Missing Required Fields

**Request:** Missing required fields
**Response:** 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields",
  "message": "Fields required: report_id, repo_url, scan_results"
}
```

#### 3. Payload Too Large

**Request:** Request body > 10MB
**Response:** 413 Payload Too Large
```json
{
  "success": false,
  "error": "PayloadTooLargeError",
  "message": "request entity too large"
}
```

---

## Code Examples

### Scanner Service Integration

#### cURL Example (New Endpoint)

```bash
# Generate report from scanner service
curl -X GET "http://localhost:3500/api/report/generate/20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac"

# With verbose output
curl -v -X GET "http://localhost:3500/api/report/generate/20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac"
```

#### JavaScript/Node.js Example (Scanner Service)

```javascript
const axios = require('axios');

async function generateReportFromScanner(scanId) {
  try {
    const response = await axios.get(`http://localhost:3500/api/report/generate/${scanId}`);
    
    console.log('Report generated successfully:', response.data);
    console.log('PDF Path:', response.data.data.pdf_path);
    console.log('DOCX Path:', response.data.data.docx_path);
    console.log('Vulnerability Summary:', response.data.data.vulnerability_summary);
    
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else {
      console.error('Request Error:', error.message);
    }
    throw error;
  }
}

// Usage
generateReportFromScanner('20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac');
```

#### Python Example (Scanner Service)

```python
import requests
import json

def generate_report_from_scanner(scan_id):
    try:
        response = requests.get(f'http://localhost:3500/api/report/generate/{scan_id}')
        response.raise_for_status()
        
        data = response.json()
        print(f"Report generated successfully: {data['message']}")
        print(f"PDF Path: {data['data']['pdf_path']}")
        print(f"DOCX Path: {data['data']['docx_path']}")
        print(f"Total Vulnerabilities: {data['data']['vulnerability_summary']['total']}")
        
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error generating report: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Error details: {e.response.json()}")
        raise

# Usage
generate_report_from_scanner('20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac')
```

#### PowerShell Example (Scanner Service)

```powershell
function Generate-ReportFromScanner {
    param([string]$ScanId)
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3500/api/report/generate/$ScanId" -Method GET
        
        Write-Host "Report generated successfully: $($response.message)" -ForegroundColor Green
        Write-Host "PDF Path: $($response.data.pdf_path)" -ForegroundColor Yellow
        Write-Host "DOCX Path: $($response.data.docx_path)" -ForegroundColor Yellow
        Write-Host "Total Vulnerabilities: $($response.data.vulnerability_summary.total)" -ForegroundColor Cyan
        
        return $response
    }
    catch {
        Write-Error "Error generating report: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $errorDetails = $_.Exception.Response.Content | ConvertFrom-Json
            Write-Host "Error details: $($errorDetails | ConvertTo-Json)" -ForegroundColor Red
        }
        throw
    }
}

# Usage
Generate-ReportFromScanner -ScanId "20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac"
```

### Direct API Integration

#### cURL Example (Original Endpoint)

```bash
curl -X POST http://localhost:3500/api/report \
  -H "Content-Type: application/json" \
  -d @scan-results.json
```

#### JavaScript/Node.js Example (Direct Data)

```javascript
const axios = require('axios');
const fs = require('fs');

async function generateReport() {
  try {
    const scanData = JSON.parse(fs.readFileSync('scan-results.json', 'utf8'));
    
    const response = await axios.post('http://localhost:3500/api/report', scanData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Report generated:', response.data);
  } catch (error) {
    console.error('Error generating report:', error.response?.data || error.message);
  }
}

generateReport();
```

### Python Example

```python
import requests
import json

def generate_report():
    with open('scan-results.json', 'r') as f:
        scan_data = json.load(f)
    
    response = requests.post(
        'http://localhost:3500/api/report',
        json=scan_data,
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 200:
        print(f"Report generated: {response.json()}")
    else:
        print(f"Error: {response.json()}")

generate_report()
```

### PowerShell Example

```powershell
$scanData = Get-Content "scan-results.json" -Raw
$response = Invoke-RestMethod -Uri "http://localhost:3500/api/report" -Method POST -Body $scanData -ContentType "application/json"
Write-Host "Report generated: $($response | ConvertTo-Json)"
```

---

## Report Templates

### Generated Report Structure

The service generates comprehensive security reports with the following structure:

1. **Title Page**
   - Repository information
   - Generation timestamp
   - Report ID

2. **Table of Contents**
   - Navigation to all sections

3. **Preface**
   - Report context and purpose

4. **Executive Summary**
   - High-level findings
   - Vulnerability count breakdown
   - Key statistics

5. **Repository Information**
   - Language breakdown
   - File statistics
   - Code metrics

6. **Security Analysis & Vulnerability Assessment**
   - Detailed vulnerability analysis
   - File-by-file security findings
   - CVSS scores and severity levels

7. **Code Metrics**
   - Lines of code
   - File processing statistics

8. **Recommendations**
   - Remediation guidelines
   - Priority rankings

9. **Summary**
   - Assessment overview
   - Key statistics
   - Final recommendations

### Supported Output Formats

- **PDF**: High-quality, print-ready reports with professional formatting
- **DOCX**: Microsoft Word compatible documents for editing and collaboration

---

## CLI Tools

### Direct Report Generation Scripts

The service includes CLI tools for direct report generation without using the API:

#### 1. DVWA Report Generator

```bash
node generate-dvwa-report.js
```

**Input:** `DVWA_test.txt` (DVWA vulnerability scan results)  
**Output:** PDF and DOCX reports for DVWA security assessment

#### 2. TestVWA Report Generator

```bash
node generate-localtest-report.js
```

**Input:** `LocalTest.txt` (TestVWA vulnerability scan results)  
**Output:** PDF and DOCX reports for TestVWA security assessment

### CLI Script Features

- **Automatic file detection**: Scripts automatically read input files
- **Progress reporting**: Real-time progress updates during generation
- **Error handling**: Comprehensive error reporting and debugging
- **Timestamped outputs**: Generated files include timestamps for versioning

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3500 | Server port |
| `NODE_ENV` | development | Environment mode |
| `REPORT_OUTPUT_DIR` | ./reports | Report output directory |
| `SCANNER_SERVICE_URL` | http://localhost:3000 | Base URL for scanner microservice |

### Body Parser Limits

- **JSON Limit**: 10MB (configurable for large scan results)
- **URL Encoded Limit**: 10MB

### Scanner Service Integration

The reporting service integrates with a separate scanner microservice to fetch vulnerability scan data. Configure the scanner service URL using the `SCANNER_SERVICE_URL` environment variable.

**Default Scanner Service Endpoint:**
```
GET {SCANNER_SERVICE_URL}/scan-report/{scanId}
```

**Example Scanner Service Response Expected:**
```json
{
  "report_id": "20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac",
  "repo_url": "https://github.com/example/repo.git",
  "repo_id": "abc123-def4-5678-9012-def456789012",
  "branch": "main",
  "scan_type": "complete",
  "status": "completed",
  "created_at": "2025-07-31T06:22:38.000Z",
  "completed_at": "2025-07-31T06:35:42.000Z",
  "vulnerability_count": {
    "Critical": 45,
    "High": 67,
    "Medium": 32,
    "Low": 11
  },
  "scan_results": {
    "file1.js": {
      "analysis": "Vulnerability analysis...",
      "file_path": "src/file1.js",
      "file_type": "CODE"
    }
  },
  "repository_info": {
    "languages": {"JavaScript": 75.5, "HTML": 24.5},
    "total_lines": 5000,
    "file_types": {".js": 25, ".html": 10}
  }
}
```

### Puppeteer Configuration

```javascript
{
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  format: "A4",
  printBackground: true,
  margin: { 
    top: "40px", 
    bottom: "40px", 
    left: "20px", 
    right: "20px" 
  }
}
```

---

## Dependencies

### Core Dependencies

- **Express.js**: Web framework
- **Puppeteer**: PDF generation
- **Handlebars**: Template engine
- **fs-extra**: File system utilities
- **docx**: Word document generation

### Security Features

- **Input validation**: JSON schema validation
- **XSS protection**: HTML encoding in templates
- **File path sanitization**: Secure file handling

---

## Deployment

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Server runs on http://localhost:3500
```

### Production Deployment

```bash
# Set environment
export NODE_ENV=production
export PORT=3500

# Start server
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3500
CMD ["npm", "start"]
```

---

## Rate Limiting

Currently, the API does not implement rate limiting. For production use, consider implementing:

- Request rate limiting per IP
- Concurrent request limiting
- File size validation
- Request timeout handling

---

## Monitoring and Logging

### Request Logging

The service logs all incoming requests with:
- Timestamp
- Request method and path
- Response status
- Processing time

### Error Logging

Comprehensive error logging includes:
- Stack traces for debugging
- Request context
- Error categorization

---

## Support and Troubleshooting

### Common Issues

1. **Chrome/Puppeteer Issues**
   ```bash
   npx puppeteer browsers install chrome
   ```

2. **Memory Issues with Large Files**
   - Increase Node.js memory limit: `--max-old-space-size=4096`

3. **File Permission Issues**
   - Ensure write permissions in reports directory

### Debug Mode

Enable debug logging:
```bash
DEBUG=reporting-service:* npm start
```

---

## Changelog

### Version 2.0
- Enhanced vulnerability count display
- Fixed data duplication issues
- Improved error handling
- Added comprehensive CLI tools
- Professional report formatting

### Version 1.0
- Initial API implementation
- Basic PDF/DOCX generation
- Template system

---

**For technical support or feature requests, please contact the development team or create an issue in the repository.**
