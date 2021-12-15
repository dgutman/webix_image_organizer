import argparse
import concurrent.futures
import json
import large_image
import os
import tifftools


def make_image_set(args):
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        for src in args.source:
            for base, _, files in os.walk(src):
                for file in sorted(files):
                    path = os.path.join(src, base, file)
#                    print(args.out,file,base,src)
                    relOutDir = base.replace(src,args.out)
                    if not os.path.isdir(relOutDir):
                        os.makedirs(relOutDir)
                    pool.submit(process_file, path, relOutDir, file)


def process_file(path, rootout, file):
    destroot = os.path.join(rootout, file)
    if os.path.exists(destroot + '.json') and os.path.getsize(destroot + '.json') > 1024:
        return
    print(path)
    try:
        ts = large_image.open(path)
    except Exception:
        return
    try:
        region, _ = ts.getRegion(
            output=dict(maxWidth=4096, maxHeight=4096), encoding='JPEG', jpegQuality=90)
    except Exception:
        return
    open(destroot + '_small.jpg', 'wb').write(region)
    try:
        macro, _ = ts.getAssociatedImage('macro', encoding='JPEG')
        open(destroot + '_macro.jpg', 'wb').write(macro)
    except Exception:
        pass
    info = tifftools.read_tiff(path)
    # Remove tile offsets and byte counts
    for ifd in info['ifds']:
        for tag in {324, 325, 273, 279, 34675}:
            ifd['tags'].pop(tag, None)
    json.dump(info, open(destroot + '.json', 'w'), indent=2,
              cls=tifftools.commands.ExtendedJsonEncoder)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Extract low resolution image, macro image, and tifftools '
        'data from a directory of files.')
    parser.add_argument(
        'source', nargs='+', help='Source file.')
    parser.add_argument(
        '--out', required=True,
        help='Output directory.')
    parser.add_argument(
        '--verbose', '-v', action='count', default=0, help='Increase output.')
    args = parser.parse_args()
    make_image_set(args)
