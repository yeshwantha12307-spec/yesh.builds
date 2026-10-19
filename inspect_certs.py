import os
import sys
from pypdf import PdfReader

folder = r"K:\yesh pdf"
out_folder = r"K:\yesh pdf\extracted_images"
os.makedirs(out_folder, exist_ok=True)

for f in os.listdir(folder):
    if f.endswith(".pdf"):
        p = os.path.join(folder, f)
        reader = PdfReader(p)
        for i, page in enumerate(reader.pages):
            for idx, img_obj in enumerate(page.images):
                clean_img_name = img_obj.name.replace("/", "_").replace("\\", "_")
                if not any(clean_img_name.lower().endswith(ext) for ext in [".png", ".jpg", ".jpeg"]):
                    clean_img_name += ".png"
                safe_name = f.replace(".pdf", "") + f"_p{i+1}_img{idx}_{clean_img_name}"
                out_path = os.path.join(out_folder, safe_name)
                try:
                    with open(out_path, "wb") as fp:
                        fp.write(img_obj.data)
                    print(f"Saved: {safe_name} ({len(img_obj.data)} bytes)")
                except Exception as e:
                    print(f"Err {safe_name}: {e}")
