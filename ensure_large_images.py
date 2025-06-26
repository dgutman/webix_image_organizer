import os
import argparse
from girder_client import GirderClient
from dotenv import load_dotenv

load_dotenv(override=True)

# --- CONFIGURATION ---
DSA_API_URL = "https://candygram.neurology.emory.edu/api/v1"
DSA_API_KEY = os.getenv("DSA_API_KEY")  # Or set your API key here
print(DSA_API_KEY, "DSA_API_KEY")
# --- GIRDER CLIENT SETUP ---
gc = GirderClient(apiUrl=DSA_API_URL)
if DSA_API_KEY:
    gc.authenticate(apiKey=DSA_API_KEY)
else:
    gc.authenticate(interactive=True)


def iter_all_items_in_folder(folder_id, batch_size=100):
    """
    Generator to yield all items in a DSA folder using the /resource/{id}/items endpoint.
    """
    offset = 0
    while True:
        batch = gc.get(
            f"resource/{folder_id}/items",
            parameters={"type": "folder", "limit": batch_size, "offset": offset},
        )
        if not batch:
            break
        for item in batch:
            yield item
        if len(batch) < batch_size:
            break
        offset += batch_size


def ensure_large_images_in_folder(folder_id):
    """
    For every item in the folder, ensure it has a largeImage if it's an image file.
    If not, create it using the DSA endpoint.
    """
    valid_exts = (".png", ".jpg", ".jpeg", ".bmp")
    for item in iter_all_items_in_folder(folder_id):
        # Only process files with valid image extensions
        if not item["name"].lower().endswith(valid_exts):
            # print(f"Skipping {item['name']} (not an image file)")
            continue
        if "largeImage" not in item:
            print(f"Creating largeImage for {item['name']} ({item['_id']})")
            try:
                gc.post(f"item/{item['_id']}/tiles")
            except Exception as e:
                print(f"Failed to create largeImage for {item['name']}: {e}")
        else:
            continue
            # print(f"{item['name']} already has largeImage.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Ensure all items in a DSA folder have largeImage tiles."
    )
    parser.add_argument(
        "dsa_root_path", help="DSA resource path, e.g. /collection/mISIC/BoxFileSet"
    )
    args = parser.parse_args()

    # Look up the folder by path
    folder = gc.resourceLookup(args.dsa_root_path)
    ensure_large_images_in_folder(folder["_id"])
