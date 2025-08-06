const { Document, Packer, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, PageBreak } = require("docx");
const fs = require("fs-extra");

exports.generateDocx = async (data, outputPath) => {
  const doc = new Document({
    creator: "Automated Security Assessment Tool",
    title: "Security Assessment Report",
    description: "Comprehensive security vulnerability assessment report",
    sections: [{
      properties: {},
      children: [
        // Title Page
        new Paragraph({
          text: "CodeShuriken",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        
        new Paragraph({
          text: "Security Assessment Report",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Repository: ",
              bold: true
            }),
            new TextRun({
              text: data.repo_url
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Generated: ",
              bold: true
            }),
            new TextRun({
              text: data.created_at
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: "Report ID: ",
              bold: true
            }),
            new TextRun({
              text: data.report_id
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),

        // Page Break for TOC
        new PageBreak(),

        // Table of Contents
        new Paragraph({
          text: "Table of Contents",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Preface", bold: true }),
            new TextRun({ text: ".................................................. 3" })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Executive Summary", bold: true }),
            new TextRun({ text: "............................................ 4" })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "1. Repository Information", bold: true }),
            new TextRun({ text: "........................................... 5" })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "2. Security Analysis & Vulnerability Assessment", bold: true }),
            new TextRun({ text: "........................ 7" })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "3. Code Metrics", bold: true }),
            new TextRun({ text: ".................................................. 8" })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "4. Recommendations", bold: true }),
            new TextRun({ text: "................................................ 9" })
          ],
          spacing: { after: 100 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "5. Summary", bold: true }),
            new TextRun({ text: "..................................................... 10" })
          ],
          spacing: { after: 400 }
        }),

        // Page Break for Preface
        new PageBreak(),

        // Preface
        new Paragraph({
          text: "Preface",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 300 }
        }),

        new Paragraph({
          text: "About This Report",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),

        new Paragraph({
          text: "This automated security assessment report has been generated to provide comprehensive insights into the security posture of your software repository. The analysis includes dependency vulnerabilities, code quality metrics, and actionable security recommendations.",
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: "Methodology",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),

        new Paragraph({
          text: "Our security assessment employs multiple scanning techniques including:",
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: "• Static code analysis for vulnerability detection",
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: "• Dependency vulnerability scanning against known CVE databases",
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: "• Software Bill of Materials (SBOM) generation and analysis",
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: "• Code quality and security best practices evaluation",
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: "Scope and Limitations",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),

        new Paragraph({
          text: "This report covers static analysis findings and known vulnerabilities in dependencies. It does not include dynamic testing, manual code review findings, or infrastructure security assessments. The analysis is based on the repository state at the time of scanning.",
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: "How to Use This Report",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),

        new Paragraph({
          text: "Review the Executive Summary for high-level findings, then proceed to detailed sections. Prioritize critical and high-severity vulnerabilities for immediate remediation. Use the recommendations section to improve your overall security posture.",
          spacing: { after: 400 }
        }),

        // Page Break for Executive Summary
        new PageBreak(),

        // Executive Summary
        new Paragraph({
          text: "Executive Summary",
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        }),

        new Paragraph({
          children: [
            new TextRun({
              text: `This report was prepared by automated security scanning to review aspects of the security and integrity of the repository `,
            }),
            new TextRun({
              text: data.repo_url,
              bold: true
            }),
            new TextRun({
              text: "."
            })
          ],
          spacing: { after: 200 }
        }),

        new Paragraph({
          text: "This report identifies potential security weaknesses and vulnerabilities found through static code review and searches of public vulnerability sources. The analysis focused particularly on dependency vulnerabilities that could be exploited to alter system behavior, access critical data, or conduct denial of service attacks.",
          spacing: { after: 200 }
        }),

        // Key Findings Summary
        new Paragraph({
          text: "Key Findings Summary:",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),

        new Paragraph({
          text: `• Repository contains ${data.progress?.total_files || 'N/A'} files with ${data.progress?.processed_files || 'N/A'} successfully processed`,
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: `• Scan completion rate: ${data.progress?.percentage || 'N/A'}%`,
          spacing: { after: 100 }
        }),

        new Paragraph({
          text: `• Primary languages identified: ${data.repository_info?.languages ? Object.entries(data.repository_info.languages).map(([lang, perc]) => `${lang} (${perc}%)`).join(', ') : 'Not available'}`,
          spacing: { after: 300 }
        }),

        // Page Break for Repository Information
        new PageBreak(),

        // Repository Information
        new Paragraph({
          text: "1 Repository Information",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        new Paragraph({
          text: "1.1 Language Distribution",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
      ]
    }]
  });

  // Add language distribution table if available
  if (data.repository_info && data.repository_info.languages) {
    const languageRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Language", bold: true })],
            shading: { fill: "3498db" }
          }),
          new TableCell({
            children: [new Paragraph({ text: "Percentage", bold: true })],
            shading: { fill: "3498db" }
          }),
        ],
      })
    ];

    Object.entries(data.repository_info.languages).forEach(([lang, percentage]) => {
      languageRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(lang)],
            }),
            new TableCell({
              children: [new Paragraph(`${percentage}%`)],
            }),
          ],
        })
      );
    });

    doc.addSection({
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: languageRows
        })
      ]
    });
  }

  // Add security analysis section
  doc.addSection({
    children: [
      new Paragraph({
        text: "2 Security Analysis & Vulnerability Assessment",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    ]
  });

  // Add scan results
  if (data.scan_results) {
    let sectionIndex = 1;
    Object.entries(data.scan_results).forEach(([filename, result]) => {
      doc.addSection({
        children: [
          new Paragraph({
            text: `3.${sectionIndex} ${filename} Analysis`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({ text: "File: ", bold: true }),
              new TextRun(result.file_path || filename)
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Type: ", bold: true }),
              new TextRun(result.file_type || "Unknown")
            ],
            spacing: { after: 200 }
          }),

          new Paragraph({
            text: "Security Analysis:",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          }),

          new Paragraph({
            text: result.analysis || "No detailed analysis available for this file.",
            spacing: { after: 200 }
          })
        ]
      });
      sectionIndex++;
    });
  }

  // Add recommendations section
  doc.addSection({
    children: [
      new Paragraph({
        text: "4 Recommendations",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),

      new Paragraph({
        text: "Immediate Actions Required:",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),

      new Paragraph({
        text: "• Review and address all critical and high severity vulnerabilities",
        spacing: { after: 100 }
      }),

      new Paragraph({
        text: "• Update all outdated dependencies to their latest stable versions",
        spacing: { after: 100 }
      }),

      new Paragraph({
        text: "• Implement proper dependency management practices",
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "Long-term Security Improvements:",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),

      new Paragraph({
        text: "• Integrate automated security scanning into CI/CD pipeline",
        spacing: { after: 100 }
      }),

      new Paragraph({
        text: "• Regular security code reviews",
        spacing: { after: 100 }
      }),

      new Paragraph({
        text: "• Monitor security advisories for used dependencies",
        spacing: { after: 100 }
      }),

      new Paragraph({
        text: "• Implement secure coding practices",
        spacing: { after: 400 }
      }),

      // Page Break for Summary
      new PageBreak(),

      // Summary Section
      new Paragraph({
        text: "5 Summary",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }),

      new Paragraph({
        text: "Assessment Results Overview",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),

      // Summary Table
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "Scan Type:", bold: true })],
                width: { size: 25, type: WidthType.PERCENTAGE }
              }),
              new TableCell({
                children: [new Paragraph(data.scan_type || "N/A")],
                width: { size: 25, type: WidthType.PERCENTAGE }
              }),
              new TableCell({
                children: [new Paragraph({ text: "Status:", bold: true })],
                width: { size: 25, type: WidthType.PERCENTAGE }
              }),
              new TableCell({
                children: [new Paragraph(data.status || "N/A")],
                width: { size: 25, type: WidthType.PERCENTAGE }
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "Files Processed:", bold: true })],
              }),
              new TableCell({
                children: [new Paragraph(`${data.progress?.processed_files || 'N/A'}/${data.progress?.total_files || 'N/A'}`)],
              }),
              new TableCell({
                children: [new Paragraph({ text: "Progress:", bold: true })],
              }),
              new TableCell({
                children: [new Paragraph(`${data.progress?.percentage || 'N/A'}%`)],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "Repository URL:", bold: true })],
              }),
              new TableCell({
                children: [new Paragraph(data.repo_url || "N/A")],
                columnSpan: 3
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "Branch Analyzed:", bold: true })],
              }),
              new TableCell({
                children: [new Paragraph(data.branch || "N/A")],
              }),
              new TableCell({
                children: [new Paragraph({ text: "Scan Completed:", bold: true })],
              }),
              new TableCell({
                children: [new Paragraph(data.completed_at || "N/A")],
              }),
            ],
          }),
        ],
      }),

      new Paragraph({
        text: "Primary Languages",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),

      new Paragraph({
        text: data.repository_info?.languages ? 
          Object.entries(data.repository_info.languages)
            .map(([lang, perc]) => `${lang}: ${perc}%`)
            .join(', ') : 
          'Not available',
        spacing: { after: 200 }
      }),

      new Paragraph({
        text: "Next Steps",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),

      new Paragraph({
        text: "1. Immediate: Address any critical or high-severity vulnerabilities identified",
        spacing: { after: 100 }
      }),

      new Paragraph({
        text: "2. Short-term: Review and update outdated dependencies",
        spacing: { after: 100 }
      }),

      new Paragraph({
        text: "3. Long-term: Implement continuous security monitoring and automated scanning",
        spacing: { after: 100 }
      }),

      new Paragraph({
        text: "4. Process: Integrate security practices into development workflow",
        spacing: { after: 200 }
      }),

      // Footer
      new Paragraph({
        text: `Report generated on ${data.created_at}`,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 100 }
      }),

      new Paragraph({
        text: "Automated Security Assessment Tool",
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outputPath, buffer);
};
