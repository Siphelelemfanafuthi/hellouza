"""Parse simple `node-a -- node-b` topology lines."""
from __future__ import annotations


def parse_topology(raw: str) -> list[tuple[str, str]]:
    links: list[tuple[str, str]] = []
    for line in raw.splitlines():
        if "--" in line:
            left, right = (part.strip() for part in line.split("--", 1))
            if left and right:
                links.append((left, right))
    return links
