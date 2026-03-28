#!/usr/bin/env python
import sys

# Try to import fitz, install if not available
try:
    import fitz
except ImportError:
    import subprocess
    print("Installing pymupdf...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pymupdf"])
    import fitz

# Extract text from PDF
pdf_path = r"C:\Users\chinn\Downloads\Resumate_Production_Optimization_Report.pdf"

try:
    # Open the PDF
    doc = fitz.open(pdf_path)
    
    # Extract text from all pages
    print(f"PDF: {pdf_path}")
    print(f"Total pages: {len(doc)}\n")
    print("=" * 80)
    print("PDF CONTENT")
    print("=" * 80 + "\n")
    
    full_text = ""
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        full_text += text
        print(f"\n--- PAGE {page_num + 1} ---\n")
        print(text)
    
    # Close the document
    doc.close()
    
    print("\n" + "=" * 80)
    print("END OF PDF CONTENT")
    print("=" * 80)

except FileNotFoundError:
    print(f"ERROR: File not found at {pdf_path}")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    sys.exit(1)
