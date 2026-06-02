from pathlib import Path
import re
files = [
    'blogs/blog-best-time-to-hike.html',
    'blogs/blog-forest-conservation.html',
    'blogs/blog-mountain-climbing-prep.html',
    'blogs/blog-nairobi-day-hikes.html',
    'blogs/kenya-safety.html',
    'blogs/safari-cost.html',
    'blogs/safari-tips.html',
    'blogs/big-five.html',
    'blogs/blog-scavenger-hunt-hikes.html'
]
for rel in files:
    path = Path(rel)
    if not path.exists():
        print('MISSING', rel)
        continue
    text = path.read_text(encoding='utf-8')
    orig = text
    if '<section class="blog-container page-content">' in text:
        text = text.replace('<section class="blog-container page-content">', '<main class="blog-page">', 1)
    elif '<section class="blog-container">' in text:
        text = text.replace('<section class="blog-container">', '<main class="blog-page">', 1)
    def repl(m):
        return '\n  <article class="blog-post">\n    <header class="blog-post-header">' + m.group(0) + '\n    </header>'
    text, count = re.subn(r'\n\s*<h1>.*?</h1>\n\s*<p class="blog-meta">.*?</p>', repl, text, count=1, flags=re.S)
    if 'class="blog-post-image"' in text:
        text = text.replace('class="blog-post-image"', 'class="blog-header-img"', 1)
    if '<article class="blog-post-content">' in text:
        text = text.replace('<article class="blog-post-content">', '<div class="blog-post-content">', 1)
    idx = text.find('<div class="blog-post-content">')
    if idx != -1:
        tail = text[idx:]
        if '</article>' in tail:
            text = text[:idx] + tail.replace('</article>', '</div>\n  </article>', 1)
    idx = text.find('</article>')
    if idx != -1:
        idx2 = text.find('</section>', idx)
        if idx2 != -1:
            text = text[:idx2] + '</main>' + text[idx2 + 10:]
    if text != orig:
        path.write_text(text, encoding='utf-8')
        print('UPDATED', rel)
    else:
        print('UNCHANGED', rel)
print('DONE')
