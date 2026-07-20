#!/usr/bin/env python3
"""Snapshot the latest Substack posts into data/posts.json.

Run on a schedule by .github/workflows/substack-posts.yml so the Writing
section reads a committed snapshot instead of depending on a third-party
RSS bridge (rss2json caches feeds and can lag behind new posts).

Substack sits behind Cloudflare, which sometimes 403s requests from
GitHub Actions runners. We send browser-like headers and, if the RSS
feed is still blocked, fall back to Substack's JSON posts API. If both
sources fail the script exits non-zero so the workflow run goes red
instead of silently keeping a stale snapshot.

Stdlib only; safe to run locally: python3 scripts/fetch_substack_posts.py
Pass a path to a saved feed XML to run without network:
python3 scripts/fetch_substack_posts.py feed.xml
"""
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from email.utils import parsedate_to_datetime
from pathlib import Path

SITE = 'https://shegx07.substack.com'
FEED = f'{SITE}/feed'
API = f'{SITE}/api/v1/posts?limit=12'
OUT = Path(__file__).resolve().parent.parent / 'data' / 'posts.json'
MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
MAX_POSTS = 4
SNIPPET_LEN = 150
HEADERS = {
    'User-Agent': ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                   'AppleWebKit/537.36 (KHTML, like Gecko) '
                   'Chrome/126.0.0.0 Safari/537.36'),
    'Accept': 'application/rss+xml, application/xml, application/json, */*',
    'Accept-Language': 'en-US,en;q=0.9',
}


class FetchError(Exception):
    pass


def fetch(url):
    """Fetch a URL, falling back from urllib to curl.

    Cloudflare fingerprints TLS handshakes and blocks Python's urllib
    from datacenter IPs even with browser headers; curl's fingerprint
    often passes where urllib's does not.
    """
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        return urllib.request.urlopen(req, timeout=30).read()
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f'urllib fetch of {url} failed ({exc}); retrying with curl.')
    result = subprocess.run(
        ['curl', '-sfL', '--max-time', '30', '-A', HEADERS['User-Agent'], url],
        capture_output=True)
    if result.returncode != 0 or not result.stdout:
        raise FetchError(f'curl fetch of {url} failed (exit {result.returncode})')
    return result.stdout


def fmt_date(dt):
    return f'{MONTHS[dt.month - 1]} {dt.day}, {dt.year}'


def clip(snippet):
    snippet = re.sub(r'\s+', ' ', snippet).strip()
    if len(snippet) > SNIPPET_LEN:
        snippet = snippet[:SNIPPET_LEN] + '…'
    return snippet


def text(el, tag):
    node = el.find(tag)
    return (node.text or '').strip() if node is not None else ''


def posts_from_feed(xml_bytes):
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
            date = fmt_date(parsedate_to_datetime(raw_date))

        enclosure = item.find('enclosure')
        image = enclosure.get('url', '') if enclosure is not None else ''

        snippet = clip(re.sub(r'<[^>]+>', '', text(item, 'description')))
        posts.append({'title': title, 'link': link, 'date': date,
                      'image': image, 'snippet': snippet})
        if len(posts) == MAX_POSTS:
            break
    return posts


def posts_from_api(json_bytes):
    posts = []
    for item in json.loads(json_bytes):
        title = (item.get('title') or '').strip()
        link = (item.get('canonical_url') or '').strip()
        if not title or not link:
            continue

        date = ''
        raw_date = item.get('post_date') or ''
        if raw_date:
            date = fmt_date(datetime.fromisoformat(raw_date.replace('Z', '+00:00')))

        snippet = clip(item.get('truncated_body_text') or item.get('description') or '')
        posts.append({'title': title, 'link': link, 'date': date,
                      'image': item.get('cover_image') or '', 'snippet': snippet})
        if len(posts) == MAX_POSTS:
            break
    return posts


def main():
    if len(sys.argv) > 1:
        posts = posts_from_feed(Path(sys.argv[1]).read_bytes())
    else:
        posts = []
        try:
            posts = posts_from_feed(fetch(FEED))
        except (FetchError, ET.ParseError) as exc:
            print(f'RSS feed fetch failed ({exc}); trying the JSON API.')
        if not posts:
            try:
                posts = posts_from_api(fetch(API))
            except (FetchError, json.JSONDecodeError) as exc:
                raise SystemExit(f'JSON API fetch failed too ({exc}); giving up.')

    if not posts:
        raise SystemExit('No posts found in either source; keeping the existing snapshot.')

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(posts, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Wrote {len(posts)} posts to {OUT}')


if __name__ == '__main__':
    main()
