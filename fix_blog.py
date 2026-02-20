# Fix orphaned JS in blog.html
path = r"blogs/blog.html"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

# Remove the orphaned string - try different apostrophe chars
for apostrophe in ["'", "\u2019", "\u2018"]:
    bad = f"*/{apostrophe}s most iconic wildlife...\","
    if bad in c:
        c = c.replace(bad, "*/")
        break

with open(path, "w", encoding="utf-8") as f:
    f.write(c)
print("Done")
