import argparse
import json
import os
import sys
import tifftools
from tifftools import Datatype


def add_meta(meta, key, value):
    key = key.strip()
    value = str(value).strip()
    if key.endswith(' Q') and value.split(';')[0].isdigit():
        return
    try:
        float(value)
        return
    except Exception:
        if not value or str(value).lower() in {'none', 'true', 'false'}:
            return
    meta.setdefault(key, [])
    if value not in meta[key]:
        meta[key].append(value)


def flatten(ifds, meta=None, tagSet=tifftools.Tag):
    meta = meta or {}
    for ifd in ifds:
        subifdList = []
        for tag, taginfo in sorted(ifd['tags'].items()):
            tag = tifftools.commands.get_or_create_tag(
                tag, tagSet, {'datatype': Datatype[taginfo['datatype']]})
            if not tag.isIFD() and taginfo['datatype'] not in (Datatype.IFD, Datatype.IFD8):
                if 'data' not in taginfo:
                    continue
                if taginfo['datatype'] == Datatype.ASCII:
                    value = taginfo['data']
                    # change this to deal with Philips
                    if value.startswith('<?xml'):
                        continue
                elif taginfo['datatype'] == Datatype.UNDEFINED:
                    try:
                        value = taginfo['data'].encode()
                    except Exception:
                        continue
                elif 'date' in tag['name'].lower():
                    value = str(taginfo['data'])
                else:
                    continue
                add_meta(meta, tag['name'], value)
            elif 'ifds' in taginfo:
                subifdList.append((tag, taginfo))
        for tag, taginfo in subifdList:
            for subifds in taginfo['ifds']:
                flatten(subifds, meta, getattr(tag, 'tagset', None))
    return meta


def check_aperio(meta):
    for key in list(meta.keys()):
        for value in meta[key][:]:
            if value.startswith('Aperio '):
                meta[key].remove(value)
                if not len(meta[key]):
                    meta.pop(key, None)
                try:
                    for entry in value.replace('\r', '\n').split('\n', 1)[1].strip().split('|'):
                        if '=' in entry:
                            skey, svalue = entry.split('=', 1)
                            add_meta(meta, skey, svalue)
                except Exception:
                    pass
    return meta


def check_imagej(meta):
    for key in list(meta.keys()):
        for value in meta[key][:]:
            if value.startswith('ImageJ='):
                meta[key].remove(value)
                if not len(meta[key]):
                    meta.pop(key, None)
                for entry in value.replace('\r', '\n').split('\n', 1)[1].strip().split('\n'):
                    if '=' in entry:
                        skey, svalue = entry.split('=', 1)
                        add_meta(meta, skey, svalue)
    return meta


def check_hamamatsu(meta):
    pms = meta.pop('NDPI_PROPERTY_MAP', None)
    if not pms:
        return meta
    for pm in pms:
        for entry in pm.split('\r\n'):
            if '=' in entry:
                skey, svalue = entry.split('=', 1)
                add_meta(meta, skey, svalue)
    return meta


def unjson(meta):
    for key in list(meta.keys()):
        for value in meta[key][:]:
            if value.startswith('{'):
                try:
                    jvalue = json.loads(value)
                except Exception:
                    continue
                meta[key].remove(value)
                if not len(meta[key]):
                    meta.pop(key, None)
                for skey, svalue in jvalue.items():
                    if skey in {'large_image_converter', 'metadata'}:
                        continue
                    if skey == 'internal':
                        for tkey, tvalue in svalue.items():
                            if isinstance(tvalue, dict):
                                for ukey, uvalue in tvalue.items():
                                    add_meta(meta, ukey, str(uvalue))
                            else:
                                add_meta(meta, tkey, str(tvalue))
                    else:
                        add_meta(meta, skey, str(svalue))
    return meta


def list_metadata(args):
    meta = {}
    if args.collection and os.path.exists(args.collection):
        meta = json.load(open(args.collection))
    for src in args.source:
        if args.verbose:
            sys.stderr.write('%s\n' % src)
            sys.stderr.flush()
        try:
            info = tifftools.read_tiff(src)
        except Exception:
            continue
        meta = flatten(info['ifds'], meta=meta)
        meta = unjson(meta)
        meta = check_aperio(meta)
        meta = check_hamamatsu(meta)
        meta = check_imagej(meta)
    if args.out:
        outptr = open(args.out, 'w')
    else:
        outptr = sys.stdout
    for key, values in sorted(meta.items()):
        outptr.write('%s: %s\n' % (key, values[0] if len(values) == 1 else values))
    if args.collection:
        meta = json.dump(meta, open(args.collection, 'w'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='List all ASCII, Date, and som,e binary fields from TIFF files')
    parser.add_argument(
        'source', nargs='+', help='Source file.')
    parser.add_argument(
        '--collection',
        help='A file path to read and write collected metadata.  Use this to '
        'merge multiple runs of the program.')
    parser.add_argument(
        '--out',
        help='If specified, output the results to this text file.  Otherwise, '
        'output to stdout.')
    parser.add_argument(
        '--verbose', '-v', action='count', default=0, help='Increase output.')
    args = parser.parse_args()
    list_metadata(args)
