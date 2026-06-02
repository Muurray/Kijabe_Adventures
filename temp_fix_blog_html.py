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

    # Normalize top wrapper
    if '<main class="blog-page">' not in text:
        if '<section class="blog-container page-content">' in text:
            text = text.replace('<section class="blog-container page-content">', '<main class="blog-page">', 1)
        elif '<section class="blog-container">' in text:
            text = text.replace('<section class="blog-container">', '<main class="blog-page">', 1)

    # Remove stray blog-post-content before main
    text = re.sub(r'<div class="blog-post-content">\s*(?=<main class="blog-page">)', '', text, count=1)

    # Remove duplicate <body> tags after the first
    body_openings = list(re.finditer(r'<body[^>]*>', text))
    if len(body_openings) > 1:
        for match in reversed(body_openings[1:]):
            text = text[: match.start()] + text[match.end() :]

    # Collapse duplicated nested article/header wrappers
    while True:
        new_text = re.sub(
            r'<article class="blog-post">\s*<header class="blog-post-header">\s*<article class="blog-post">\s*<header class="blog-post-header">',
            '<article class="blog-post">\n  <header class="blog-post-header">',
            text,
            flags=re.S,
        )
        if new_text == text:
            break
        text = new_text

    # Remove duplicate closing headers and articles
    text = re.sub(r'</header>\s*</header>', '</header>', text)
    text = re.sub(r'</article>\s*</article>', '</article>', text)

    # Remove extra closing div before article close
    text = re.sub(r'</div>\s*</div>\s*</article>', '</div>\n  </article>', text)

    # Ensure page close uses </main> not </section>
    if '<main class="blog-page">' in text and '</main>' not in text:
        first_main = text.find('<main class="blog-page">')
        section_close = text.find('</section>', first_main)
        if section_close != -1:
            text = text[:section_close] + '</main>' + text[section_close + len('</section>') :]

    # Remove any </body> before footer and keep only one after footer
    footer_index = text.find('<footer')
    if footer_index != -1:
        if '</body>' in text[:footer_index]:
            text = text[: text.rfind('</body>', 0, footer_index)] + text[text.rfind('</body>', 0, footer_index) + len('</body>') :]
        after_footer = text[footer_index:]
        body_closures = list(re.finditer(r'</body>', after_footer))
        if len(body_closures) == 0:
            html_close = text.rfind('</html>')
            if html_close != -1:
                text = text[:html_close] + '</body>\n' + text[html_close:]
            else:
                text = text + '\n</body>\n'
        elif len(body_closures) > 1:
            # keep only the last </body> after footer
            last = body_closures[-1]
            for match in reversed(body_closures[:-1]):
                start = footer_index + match.start()
                end = footer_index + match.end()
                text = text[:start] + text[end:]

    if text != orig:
        path.write_text(text, encoding='utf-8')
        print('UPDATED', rel)
    else:
        print('UNCHANGED', rel)

print('DONE')
