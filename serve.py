#!/usr/bin/env python3
"""Lightweight static HTTP server for this project.

Usage examples:
  python serve.py            # serve current directory on port 8000
  python serve.py -p 8080 -d .

This is a tiny wrapper around Python's http.server to make serving
the site easy on Windows and other platforms.
"""
import http.server
import socketserver
import argparse
import os
import sys


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return


def main():
    parser = argparse.ArgumentParser(description="Serve a directory over HTTP")
    parser.add_argument("-p", "--port", type=int, default=8000, help="Port to serve on (default: 8000)")
    parser.add_argument("-d", "--dir", default='.', help="Directory to serve (default: current directory)")
    parser.add_argument("--no-quiet", action='store_true', help="Don't silence request logs")
    args = parser.parse_args()

    serve_dir = os.path.abspath(args.dir)
    if not os.path.isdir(serve_dir):
        print(f"Error: directory does not exist: {serve_dir}")
        sys.exit(2)

    os.chdir(serve_dir)
    handler_class = http.server.SimpleHTTPRequestHandler if args.no_quiet else QuietHandler

    with socketserver.TCPServer(("", args.port), handler_class) as httpd:
        host = '127.0.0.1'
        print(f"Serving {serve_dir} at http://{host}:{args.port} (CTRL+C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")


if __name__ == '__main__':
    main()
