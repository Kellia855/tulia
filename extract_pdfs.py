#!/usr/bin/env python3
"""Extract text from PDF files in the current directory."""

from pathlib import Path
from pypdf import PdfReader

pdfs = [
    Path("Kellia_Kamikazi[Assignment1]_[W4]_[01252026].pdf"),
    Path("Kellia_Kamikazi_[Assignment2]_[02232026].pdf"),
]

for pdf in pdfs:
    if not pdf.exists():
        print(f"⚠️  {pdf} not found")
        continue
    
    reader = PdfReader(str(pdf))
    text = []
    for i, page in enumerate(reader.pages, start=1):
        page_text = page.extract_text() or ""
        text.append(f"\n--- PAGE {i} ---\n{page_text}")
    
    out = pdf.with_suffix(".txt")
    out.write_text("\n".join(text), encoding="utf-8")
    print(f"✓ Created: {out}")

print("\n✓ Done! Text files ready for analysis.")
