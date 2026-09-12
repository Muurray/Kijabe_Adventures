import xml.etree.ElementTree as ET
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
import ssl
import sys

ssl._create_default_https_context = ssl._create_unverified_context

path = 'sitemap.xml'
root = ET.parse(path).getroot()
ns = {'sm': 'https://www.sitemaps.org/schemas/sitemap/0.9'}
urls = [el.text for el in root.findall('.//sm:loc', ns)]
print('Found', len(urls), 'URLs')
failed = []
print('Validating sitemap URLs...')
for url in urls:
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urlopen(req, timeout=20) as resp:
            code = resp.getcode()
            print(url, code)
            if code >= 400:
                failed.append((url, code))
    except HTTPError as e:
        print(url, 'HTTPError', e.code)
        failed.append((url, e.code))
    except URLError as e:
        print(url, 'URLError', e.reason)
        failed.append((url, str(e.reason)))
    except Exception as e:
        print(url, 'ERROR', e)
        failed.append((url, str(e)))
print('---')
if failed:
    print('Failures:', len(failed))
    for u, err in failed:
        print(u, err)
    sys.exit(1)
else:
    print('All URLs returned a successful status code.')
