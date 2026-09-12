# Local static server

This repository contains a small script to serve the site locally for development.

Files added:

- `serve.py` — tiny Python static server wrapper using `http.server`.

Quick start (Python 3):

```powershell
# from repository root
python serve.py
# or specify port and directory
python serve.py -p 8080 -d .
```

Alternative (Node):

```powershell
# if you have npm installed, you can use http-server
npx http-server -p 8000
```

Open <http://127.0.0.1:8000> in your browser.
