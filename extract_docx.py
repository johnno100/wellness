#!/usr/bin/env python3
import docx
import os

try:
    doc = docx.Document('/home/ubuntu/upload/Wellness_AI_Integration_Report.docx')
    with open('doc_content.txt', 'w') as f:
        for para in doc.paragraphs:
            if para.text.strip():
                f.write(para.text + '\n')
    print("Document extracted successfully")
except Exception as e:
    print(f"Error extracting document: {e}")
