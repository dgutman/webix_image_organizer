import os
from girder_client import GirderClient

# CONFIGURATION
LOCAL_ROOT = "/Users/dagutman/Downloads/RegisteredCases"
DSA_ROOT_PATH = "/collection/mISIC/BoxFileSet"  # Change as needed
DSA_API_URL = "https://candygram.neurology.emory.edu/api/v1"
DSA_API_KEY = os.getenv("GIRDER_API_KEY")  # Or set your API key here

# Authenticate
gc = GirderClient(apiUrl=DSA_API_URL)
if DSA_API_KEY:
    gc.authenticate(apiKey=DSA_API_KEY)
else:
    gc.authenticate(interactive=True)


def get_or_create_dsa_folder(gc, dsa_parent_path, folder_name):
    """Get or create a folder in DSA under dsa_parent_path with folder_name."""
    try:
        folder = gc.resourceLookup(f"{dsa_parent_path}/{folder_name}")
    except Exception:
        parent_folder = gc.resourceLookup(dsa_parent_path)
        folder = gc.createFolder(parent_folder["_id"], folder_name, reuseExisting=True)
    return folder


def sync_folder(local_dir, dsa_parent_path):
    """Recursively sync a local directory to DSA, preserving structure."""
    folder_name = os.path.basename(local_dir)
    dsa_folder = get_or_create_dsa_folder(gc, dsa_parent_path, folder_name)
    dsa_folder_id = dsa_folder["_id"]

    # List files already in DSA folder to avoid re-uploading
    dsa_items = {item["name"] for item in gc.listItem(dsa_folder_id)}

    for entry in os.listdir(local_dir):
        if (
            entry.startswith(".")
            or "Thumbs.db" in entry
            or entry.lower().endswith(".zip")
        ):
            continue  # Skip hidden files/folders, Thumbs.db, and .zip files
        local_path = os.path.join(local_dir, entry)
        if os.path.isdir(local_path):
            sync_folder(local_path, f"{dsa_parent_path}/{folder_name}")
        else:
            if entry not in dsa_items:
                print(f"Uploading {local_path} to {dsa_folder['name']}")
                gc.uploadFileToFolder(dsa_folder_id, local_path)
            else:
                continue
                # print(f"Skipping {local_path}, already exists in DSA.")


def iter_all_items_in_folder(folder_id, batch_size=100):
    """
    Yield all items in a folder using the /resource/{id}/items endpoint.
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


if __name__ == "__main__":
    sync_folder(LOCAL_ROOT, DSA_ROOT_PATH)
