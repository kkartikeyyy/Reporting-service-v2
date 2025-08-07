# Scanner Service Integration Guide

## Overview

This guide explains how to integrate the CodeShuriken Reporting Service with your scanner microservice to automatically generate security reports from scan results.

## Architecture

```
[Scanner Service] ---> [Reporting Service] ---> [PDF/DOCX Reports]
     :3000                    :3500                   ./reports/
```

The integration flow:
1. Scanner service performs vulnerability scans and stores results
2. Reporting service fetches scan data via REST API
3. Reports are generated in PDF and DOCX formats
4. Generated reports are saved locally and metadata stored in database

## Quick Start

### 1. Configure Environment

Copy the example environment file and configure your scanner service URL:

```bash
cp .env.example .env
```

Edit `.env`:
```env
SCANNER_SERVICE_URL=http://localhost:3000
PORT=3500
NODE_ENV=development
```

### 2. Start the Reporting Service

```bash
npm install
npm start
```

The service will be available at `http://localhost:3500`

### 3. Generate Reports from Scanner Data

```bash
# Replace with your actual scan ID
curl -X GET "http://localhost:3500/api/report/generate/YOUR_SCAN_ID"
```

## Scanner Service Requirements

Your scanner service must provide an endpoint that returns scan data in the following format:

### Endpoint

```
GET /scan-report/{scanId}
```

### Response Format

```json
{
  "report_id": "20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac",
  "repo_url": "https://github.com/example/vulnerable-app.git",
  "repo_id": "abc123-def4-5678-9012-def456789012",
  "branch": "main",
  "scan_type": "complete",
  "status": "completed",
  "created_at": "2025-07-31T06:22:38.000Z",
  "completed_at": "2025-07-31T06:35:42.000Z",
  "progress": {
    "total_files": 50,
    "processed_files": 50,
    "percentage": 100
  },
  "vulnerability_count": {
    "Critical": 45,
    "High": 67,
    "Medium": 32,
    "Low": 11
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
      "analysis": "Detailed vulnerability analysis of package.json...",
      "file_path": "package.json",
      "file_type": "SBOM"
    },
    "src/app.js": {
      "analysis": "Security analysis of main application file...",
      "file_path": "src/app.js",
      "file_type": "CODE"
    }
  }
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `report_id` | string | Unique scan identifier |
| `repo_url` | string | Repository URL |
| `branch` | string | Git branch scanned |
| `scan_type` | string | Type of scan performed |
| `status` | string | Scan completion status |
| `created_at` | string | ISO 8601 scan start timestamp |
| `completed_at` | string | ISO 8601 scan completion timestamp |
| `vulnerability_count` | object | Count by severity level |
| `scan_results` | object | Detailed vulnerability findings |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `repo_id` | string | Repository identifier |
| `progress` | object | Scan progress information |
| `repository_info` | object | Repository metadata |
| `error_log` | string | Error information if scan failed |

## API Endpoints

### Generate Report from Scanner Service

**Endpoint:** `GET /api/report/generate/:scanId`

**Example:**
```bash
curl -X GET "http://localhost:3500/api/report/generate/20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac"
```

**Success Response:**
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

### Direct Report Generation

**Endpoint:** `POST /api/report`

For scenarios where you want to send scan data directly:

```bash
curl -X POST http://localhost:3500/api/report \
  -H "Content-Type: application/json" \
  -d @scan-results.json
```

## Error Handling

### Common Error Scenarios

#### Scanner Service Unavailable (503)

```json
{
  "success": false,
  "error": "Scanner service unavailable",
  "message": "Could not connect to scanner service. Please ensure it's running on the expected port."
}
```

**Resolution:** Ensure your scanner service is running and accessible at the configured URL.

#### Scan Report Not Found (404)

```json
{
  "success": false,
  "error": "Scan report not found",
  "message": "No scan report found with ID: 20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac"
}
```

**Resolution:** Verify the scan ID exists in your scanner service.

#### Scanner Service Error (Variable Status)

```json
{
  "success": false,
  "error": "Scanner service error",
  "message": "Error message from scanner service"
}
```

**Resolution:** Check scanner service logs for specific error details.

## Configuration

### Environment Variables

```env
# Scanner service configuration
SCANNER_SERVICE_URL=http://localhost:3000

# Reporting service configuration
PORT=3500
NODE_ENV=production
REPORT_OUTPUT_DIR=./reports

# Timeout configuration
REQUEST_TIMEOUT_MS=30000
```

### Docker Configuration

If running in containers, ensure network connectivity between services:

```yaml
version: '3.8'
services:
  scanner-service:
    build: ./scanner-service
    ports:
      - "3000:3000"
    networks:
      - codeshuriken-network

  reporting-service:
    build: ./reporting-service
    ports:
      - "3500:3500"
    environment:
      - SCANNER_SERVICE_URL=http://scanner-service:3000
    depends_on:
      - scanner-service
    networks:
      - codeshuriken-network

networks:
  codeshuriken-network:
    driver: bridge
```

## Testing

### Test Scanner Integration

```bash
# Test the integration endpoint
node test-scanner-integration.js
```

### Manual Testing

```bash
# Start reporting service
npm start

# Test with your scanner service
curl -X GET "http://localhost:3500/api/report/generate/YOUR_SCAN_ID"

# Check generated reports
ls -la reports/
```

## Report Output

Generated reports include:

### PDF Report Features
- Professional formatting with company branding
- Executive summary with vulnerability counts
- Detailed security analysis section
- Repository information and metrics
- Remediation recommendations

### DOCX Report Features
- Microsoft Word compatible format
- Editable content for customization
- Tables and structured data
- Professional layout

### File Naming Convention

```
security-report-{SCAN_ID}-{TIMESTAMP}.{pdf|docx}
```

Example: `security-report-20250731062238_ebe945fe_VULNERABILITY_6b2ae3ac-1754545415124.pdf`

## Production Deployment

### Security Considerations

1. **Authentication:** Implement API key or JWT authentication
2. **Rate Limiting:** Prevent abuse with request rate limiting
3. **Input Validation:** Validate all scanner service data
4. **HTTPS:** Use secure connections in production
5. **Network Security:** Restrict network access between services

### Performance Optimization

1. **Caching:** Cache report templates and static resources
2. **Async Processing:** Use background job queues for large reports
3. **Resource Limits:** Set memory and CPU limits
4. **Monitoring:** Implement health checks and metrics

### Monitoring

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

## Troubleshooting

### Common Issues

1. **Connection Refused to Scanner Service**
   - Check scanner service is running
   - Verify network connectivity
   - Validate SCANNER_SERVICE_URL configuration

2. **Report Generation Fails**
   - Check disk space in reports directory
   - Verify write permissions
   - Review error logs

3. **Large Report Performance**
   - Increase timeout values
   - Monitor memory usage
   - Consider pagination for large scan results

### Debug Mode

Enable debug logging:

```bash
DEBUG=reporting-service:* npm start
```

### Log Analysis

```bash
# Check application logs
tail -f logs/app.log

# Check error logs
tail -f logs/error.log
```

## Support

For technical support:
1. Check the troubleshooting section
2. Review application logs
3. Test with the provided test scripts
4. Create an issue in the repository with logs and configuration details

## Version Compatibility

| Reporting Service | Scanner Service API | Notes |
|-------------------|-------------------|-------|
| v2.0+ | v1.0+ | Full integration support |
| v1.x | N/A | Direct API only |
