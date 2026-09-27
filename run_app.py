#!/usr/bin/env python3
"""
UVic MECH 342 - Dynamics II Studio Launcher
Launches local HTTP server and automatically opens the browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8342
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]}\n")

def get_local_ip():
    import socket
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def main():
    os.chdir(DIRECTORY)
    port = PORT

    # Try binding to port, fallback if busy
    server = None
    for p in range(PORT, PORT + 20):
        try:
            server = socketserver.TCPServer(("", p), Handler)
            port = p
            break
        except OSError:
            continue

    if not server:
        print("Error: Could not bind to an open port.")
        sys.exit(1)

    local_ip = get_local_ip()
    local_url = f"http://localhost:{port}/index.html"
    network_url = f"http://{local_ip}:{port}/index.html"

    print("=" * 70)
    print("  UVic MECH 342: Advanced Dynamics II Studio")
    print(f"  Serving Directory: {DIRECTORY}")
    print("-" * 70)
    print(f"  [On This PC]:     {local_url}")
    print(f"  [On Other PCs/Wi-Fi Devices]: {network_url}")
    print("=" * 70)
    print("Opening application on this PC...")

    webbrowser.open(local_url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user. Goodbye!")
        server.server_close()

if __name__ == "__main__":
    main()
