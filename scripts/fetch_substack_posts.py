#!/usr/bin/env python3
"""Snapshot the latest Substack posts into data/posts.json.

Run on a schedule by .github/workflows/substack-posts.yml so the Writing
section reads a committed snapshot instead of depending on a third-party
RSS bridge (rss2json caches feeds and can lag behind new posts).

Stdlib only; safe to run locally: python3 scripts/fetch_substack_posts.py
Pass a path to a saved feed XML to run without network:
python3 scripts/fetch_substack_posts.py feed.xml
"""
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

FEED = 'https://shegx07.substack.com/feed'
OUT = Path(__file__).resolve().parent.parent / 'data' / 'posts.json'
MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
MAX_POSTS = 4
SNIPPET_LEN = 150


def text(el, tag):
    node = el.find(tag)
    return (node.text or '').strip() if node is not None else ''


def main():
    if len(sys.argv) > 1:
        xml_bytes = Path(sys.argv[1]).read_bytes()
    else:
        req = urllib.request.Request(FEED, headers={'User-Agent': 'shegx-portfolio posts snapshot'})
        xml_bytes = urllib.request.urlopen(req, timeout=30).read()
    root = ET.fromstring(xml_bytes)

    posts = []
    for item in root.iter('item'):
        title = text(item, 'title')
        link = text(item, 'link')
        if not title or not link:
            continue

        date = ''
        raw_date = text(item, 'pubDate')
        if raw_date:
            dt = parsedate_to_datetime(raw_date)
            date = f'{MONTHS[dt.month - 1]} {dt.day}, {dt.year}'

        enclosure = item.find('enclosure')
        image = enclosure.get('url', '') if enclosure is not None else ''

        snippet = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text(item, 'description'))).strip()
        if len(snippet) > SNIPPET_LEN:
            snippet = snippet[:SNIPPET_LEN] + '…'

        posts.append({'title': title, 'link': link, 'date': date,
                      'image': image, 'snippet': snippet})
        if len(posts) == MAX_POSTS:
            break

    if not posts:
        raise SystemExit('Feed returned no posts; keeping the existing snapshot.')

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(posts, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {len(posts)} posts to {OUT}')


if __name__ == '__main__':
    main()
