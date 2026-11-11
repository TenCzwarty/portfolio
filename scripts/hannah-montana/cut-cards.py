#!/usr/bin/env python3
"""
Cuts trading cards out of flatbed scans and straightens them.

Usage:
    python cut-cards.py [scan_dir] [out_dir]
    (defaults: the folder this script is in, and <scan_dir>/cut)

Expects cards laid on a white scanner background, not touching each other
(e.g. 9 per A4 page). For every scan, in file-name order:
  1. finds non-white pixels on a 1/8 preview and splits them into separate
     regions (one per card; dust and specks are dropped by size),
  2. measures each card's tilt from the minimum-area rectangle around it,
  3. cuts the card from the full-resolution scan, rotates it upright and
     trims it tightly to the card edges.
Cards are numbered page by page, row by row, left to right: 01.png, 02.png …

Needs Pillow and numpy only.
"""

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None  # 600 dpi A4 scans are ~35 Mpx

PREVIEW_SCALE = 8  # detection runs on a 1/8 preview
MIN_CARD_FRACTION = 0.004  # regions smaller than this share of the page are dust
CROP_MARGIN = 60  # px of full-res margin around a card before rotating
EDGE_FILL = 0.35  # a row/column belongs to the card if this share of it is card


def card_mask(rgb: np.ndarray) -> np.ndarray:
    """True where a pixel is card rather than white scanner background."""
    rgb = rgb.astype(np.int16)
    lo = rgb.min(axis=2)
    spread = rgb.max(axis=2) - lo
    return (lo < 215) | (spread > 40)


def regions(mask: np.ndarray, min_area: int) -> list[np.ndarray]:
    """Connected regions of True pixels (8-connected), as arrays of (y, x)."""
    h, w = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    found = []
    for y0, x0 in zip(*np.nonzero(mask)):
        if seen[y0, x0]:
            continue
        seen[y0, x0] = True
        queue = deque([(y0, x0)])
        points = []
        while queue:
            y, x = queue.popleft()
            points.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True
                        queue.append((ny, nx))
        if len(points) >= min_area:
            found.append(np.array(points))
    return found


def convex_hull(points: np.ndarray) -> np.ndarray:
    """Monotone-chain convex hull of (x, y) points."""
    pts = sorted(set(map(tuple, points)))
    if len(pts) < 3:
        return np.array(pts)

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return np.array(lower[:-1] + upper[:-1], dtype=float)


def tilt_degrees(points_yx: np.ndarray) -> float:
    """Tilt of the minimum-area rectangle around the points, in -45..45 deg."""
    hull = convex_hull(points_yx[:, ::-1])
    best_area, best_angle = None, 0.0
    for i in range(len(hull)):
        dx, dy = hull[(i + 1) % len(hull)] - hull[i]
        angle = np.arctan2(dy, dx)
        c, s = np.cos(-angle), np.sin(-angle)
        rotated = hull @ np.array([[c, s], [-s, c]])
        area = np.ptp(rotated[:, 0]) * np.ptp(rotated[:, 1])
        if best_area is None or area < best_area:
            best_area, best_angle = area, angle
    degrees = np.degrees(best_angle)
    return (degrees + 45) % 90 - 45


def trim(card: Image.Image) -> Image.Image:
    """Crop an upright card to the rows and columns that are mostly card."""
    mask = card_mask(np.asarray(card))
    rows = np.nonzero(mask.mean(axis=1) > EDGE_FILL)[0]
    cols = np.nonzero(mask.mean(axis=0) > EDGE_FILL)[0]
    if not len(rows) or not len(cols):
        return card
    return card.crop((cols[0], rows[0], cols[-1] + 1, rows[-1] + 1))


def reading_order(found: list[np.ndarray]) -> list[np.ndarray]:
    """Sort regions row by row (rows = similar vertical centers), then by x."""
    centers = [(r[:, 0].mean(), r[:, 1].mean(), r) for r in found]
    centers.sort(key=lambda c: c[0])
    rows, current = [], []
    for c in centers:
        height = np.ptp(c[2][:, 0])
        if current and c[0] - current[-1][0] > height / 2:
            rows.append(current)
            current = []
        current.append(c)
    if current:
        rows.append(current)
    return [c[2] for row in rows for c in sorted(row, key=lambda c: c[1])]


def cut_page(path: Path) -> list[Image.Image]:
    page = Image.open(path).convert("RGB")
    preview = page.reduce(PREVIEW_SCALE)
    mask = card_mask(np.asarray(preview))
    min_area = int(mask.size * MIN_CARD_FRACTION)

    cards = []
    for region in reading_order(regions(mask, min_area)):
        angle = tilt_degrees(region)
        y0, x0 = region.min(axis=0) * PREVIEW_SCALE - CROP_MARGIN
        y1, x1 = (region.max(axis=0) + 1) * PREVIEW_SCALE + CROP_MARGIN
        box = (max(x0, 0), max(y0, 0), min(x1, page.width), min(y1, page.height))
        crop = page.crop(box)
        # The tilt is measured with y pointing down, so a positive angle is a
        # clockwise lean; PIL's positive rotation is counter-clockwise
        upright = crop.rotate(angle, resample=Image.BICUBIC, expand=True, fillcolor="white")
        card = trim(upright)
        if card.width > card.height:
            card = card.rotate(90, expand=True)
        cards.append(card)
        print(f"  card {len(cards)}: tilt {angle:+.2f} deg, {card.width}x{card.height}px")
    return cards


def main() -> None:
    scan_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else scan_dir / "cut"
    out_dir.mkdir(parents=True, exist_ok=True)

    scans = sorted(p for p in scan_dir.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".tif", ".tiff"})
    number = 0
    for scan in scans:
        print(scan.name)
        for card in cut_page(scan):
            number += 1
            card.save(out_dir / f"{number:02d}.png", optimize=True)
    print(f"\n{number} cards written to {out_dir}")


if __name__ == "__main__":
    main()
