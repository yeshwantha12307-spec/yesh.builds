import os
import fitz # PyMuPDF

src_dir = r"k:\Portfolio yesh\source_docs"
out_dir = r"k:\Portfolio yesh\public\certificates"
os.makedirs(out_dir, exist_ok=True)

for f in os.listdir(src_dir):
    if f.endswith(".pdf"):
        pdf_path = os.path.join(src_dir, f)
        doc = fitz.open(pdf_path)
        base_name = os.path.splitext(f)[0]
        for page_idx in range(len(doc)):
            page = doc[page_idx]
            pix = page.get_pixmap(dpi=150)
            img_name = f"{base_name}_page_{page_idx+1}.png"
            img_path = os.path.join(out_dir, img_name)
            pix.save(img_path)
            print(f"Rendered: {img_name} ({pix.width}x{pix.height})")
