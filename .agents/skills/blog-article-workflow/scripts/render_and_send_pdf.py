#!/usr/bin/env python3
"""Render a monochrome HTML draft into PDF via headless Chrome and/or send it via Tailscale Taildrop."""

import argparse
import os
import subprocess
import sys

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def render_pdf(html_path: str, pdf_path: str) -> None:
    html_abs = os.path.abspath(html_path)
    pdf_abs = os.path.abspath(pdf_path)
    if not os.path.exists(html_abs):
        print(f"ERROR: HTML file not found: {html_abs}", file=sys.stderr)
        sys.exit(1)
    os.makedirs(os.path.dirname(pdf_abs), exist_ok=True)
    subprocess.run(
        [
            CHROME_BIN,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_abs}",
            f"file://{html_abs}",
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    size_kb = os.path.getsize(pdf_abs) / 1024
    print(f"RENDERED: {pdf_abs} ({size_kb:.1f} KB)")


def send_tailscale(file_path: str, target: str, timeout_sec: int) -> None:
    file_abs = os.path.abspath(file_path)
    if not os.path.exists(file_abs):
        print(f"ERROR: File not found: {file_abs}", file=sys.stderr)
        sys.exit(1)

    status = subprocess.run(["tailscale", "status"], capture_output=True, text=True)
    for line in status.stdout.splitlines():
        if target.lower() in line.lower():
            print(f"PEER STATUS: {line.strip()}")
            break

    dest = target if target.endswith(":") else f"{target}:"
    try:
        res = subprocess.run(
            ["tailscale", "file", "cp", "--verbose", file_abs, dest],
            capture_output=True,
            text=True,
            timeout=timeout_sec,
        )
        if res.stdout:
            print(res.stdout.strip())
        if res.stderr:
            print(res.stderr.strip())
        if res.returncode != 0:
            sys.exit(res.returncode)
        print(f"SENT OK -> {target}: {os.path.basename(file_abs)}")
    except subprocess.TimeoutExpired as exc:
        print(f"TIMEOUT after {timeout_sec}s: perangkat '{target}' kemungkinan sedang offline di Tailscale.", file=sys.stderr)
        if exc.stderr:
            msg = exc.stderr.decode("utf-8", errors="ignore") if isinstance(exc.stderr, bytes) else exc.stderr
            print(msg.strip(), file=sys.stderr)
        sys.exit(2)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render HTML draft to PDF and/or send via Tailscale.")
    parser.add_argument("--html", help="Path to source HTML file to render.")
    parser.add_argument("--pdf", help="Path to output PDF file (required with --html).")
    parser.add_argument("--send", help="Path to file to send via Tailscale Taildrop.")
    parser.add_argument("--target", default="iphone-xs", help="Tailscale peer name (default: iphone-xs).")
    parser.add_argument("--timeout", type=int, default=25, help="Taildrop timeout in seconds (default: 25).")
    args = parser.parse_args()

    if not args.html and not args.send:
        parser.print_help()
        sys.exit(1)

    if args.html:
        if not args.pdf:
            print("ERROR: --pdf is required when using --html", file=sys.stderr)
            sys.exit(1)
        render_pdf(args.html, args.pdf)

    if args.send:
        send_tailscale(args.send, args.target, args.timeout)


if __name__ == "__main__":
    main()
