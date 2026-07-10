#!/usr/bin/env python3
"""
gen_product_pages.py
Pre-renders product page body content (H1, price, description, CTA, trust row)
into static HTML so AI crawlers and non-JS environments see real content.

watch.js continues to run for real users (progressive enhancement):
it overwrites #watch-content at runtime, so there is no functional change
for browsers — only crawlers and view-source benefit.

Run from repo root:  python gen_product_pages.py
Idempotent: safe to run multiple times.
"""
import json
import re
import urllib.parse
from pathlib import Path

BASE = Path(__file__).parent

watches = json.loads((BASE / "watches.json").read_text(encoding="utf-8-sig"))

LEK_RATE = 97

LANGS = {
    "en": {
        "desc_key": "description_en",
        "back_href": "/en/shop/",
        "back_label": "Back to shop",
        "ref_label": "Ref.",
        "sold_text": "This watch has been sold.",
        "cta_label": "Enquire via WhatsApp",
        "ig_label": "Instagram",
        "swiss_label": "Swiss Brand",
        "trust": [
            ('<span class="trust-item" style="color:#1a7a3f;font-weight:600">'
             '<i class="fas fa-money-bill" aria-hidden="true" style="color:#1a7a3f"></i>'
             " Cash on delivery</span>"),
            ('<span class="trust-item">'
             '<i class="fas fa-shield-alt" aria-hidden="true"></i>'
             " 1-year guarantee</span>"),
            ('<span class="trust-item">'
             '<i class="fas fa-star" aria-hidden="true"></i>'
             " Brand new &amp; genuine</span>"),
            ('<span class="trust-item">'
             '<i class="fas fa-clock" aria-hidden="true"></i>'
             " Mon–Sat 8:30–20:30</span>"),
        ],
        "wa_msg": (
            "Hi, I’m interested in the {brand} {model}"
            " (Ref. {ref}) — can you confirm if it’s still available?"
        ),
    },
    "it": {
        "desc_key": "description_it",
        "back_href": "/it/shop/",
        "back_label": "Torna al negozio",
        "ref_label": "Rif.",
        "sold_text": "Questo orologio è stato venduto.",
        "cta_label": "Richiedi via WhatsApp",
        "ig_label": "Instagram",
        "swiss_label": "Marchio Svizzero",
        "trust": [
            ('<span class="trust-item" style="color:#1a7a3f;font-weight:600">'
             '<i class="fas fa-money-bill" aria-hidden="true" style="color:#1a7a3f"></i>'
             " Pagamento alla consegna</span>"),
            ('<span class="trust-item">'
             '<i class="fas fa-shield-alt" aria-hidden="true"></i>'
             " Garanzia 1 anno</span>"),
            ('<span class="trust-item">'
             '<i class="fas fa-star" aria-hidden="true"></i>'
             " Nuovo &amp; originale</span>"),
            ('<span class="trust-item">'
             '<i class="fas fa-clock" aria-hidden="true"></i>'
             " Lun–Sab 8:30–20:30</span>"),
        ],
        "wa_msg": (
            "Salve, sono interessato all’orologio {brand} {model}"
            " (Rif. {ref}) — potete confermare se è ancora disponibile?"
        ),
    },
    "sq": {
        "desc_key": "description_sq",
        "back_href": "/sq/shop/",
        "back_label": "Kthehu në dyqan",
        "ref_label": "Ref.",
        "sold_text": "Kjo orë është shëtur.",
        "cta_label": "Pyesni në WhatsApp",
        "ig_label": "Instagram",
        "swiss_label": "Markë Zvicerane",
        "trust": [
            ('<span class="trust-item" style="color:#1a7a3f;font-weight:600">'
             '<i class="fas fa-money-bill" aria-hidden="true" style="color:#1a7a3f"></i>'
             " Para në dorëzim</span>"),
            ('<span class="trust-item">'
             '<i class="fas fa-shield-alt" aria-hidden="true"></i>'
             " Garanci 1 vit</span>"),
            ('<span class="trust-item">'
             '<i class="fas fa-star" aria-hidden="true"></i>'
             " E re &amp; origjinale</span>"),
            ('<span class="trust-item">'
             '<i class="fas fa-clock" aria-hidden="true"></i>'
             " Hën–Sht 8:30–20:30</span>"),
        ],
        "wa_msg": (
            "Pershendetje, jam i interesuar per oren {brand} {model}"
            " (Ref. {ref}) - a mund te konfirmoni nese është ende e disponueshme?"
        ),
    },
}


def replace_watch_content(html: str, new_div: str) -> str:
    """Replace <div id="watch-content"...>...</div> with new_div.
    Uses depth-counting so it correctly handles nested divs (idempotent)."""
    m = re.search(r'<div id="watch-content"[^>]*>', html)
    if not m:
        return html
    start = m.start()
    pos = m.end()
    depth = 1
    end = pos
    while depth > 0 and pos < len(html):
        next_open = html.find("<div", pos)
        next_close = html.find("</div>", pos)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            end = next_close + 6  # len("</div>") == 6
            pos = next_close + 6
    return html[:start] + new_div + html[end:]


def lek(price, currency):
    if not price or currency != "EUR":
        return 0
    # half-up to match Math.round in shop/watch.js (Python round() is banker's: 48.5 -> 48)
    return int(price * LEK_RATE / 100 + 0.5) * 100


def build_price_html(price, currency):
    if not price:
        return "Price on request"
    eur = f"€{price}"
    l = lek(price, currency)
    if l:
        eur += (
            f'<span style="font-size:1.1rem;color:#888;font-weight:500;margin-left:.5rem">'
            f"· {l:,} L</span>"
        )
    return eur


def build_img_html(w):
    image = w.get("image", "")
    if not image:
        return ""
    webp = image
    jpg = re.sub(r"\.webp$", ".jpg", image, flags=re.IGNORECASE)
    alt = f'{w["brand"]} {w["model"]}'
    sold = w.get("sold", False)
    badge = "Sold" if sold else w.get("condition", "New")
    return (
        f'<div class="watch-img-wrap">'
        f"<picture>"
        f'<source srcset="{webp}" type="image/webp">'
        f'<img src="{jpg}" alt="{alt}" fetchpriority="high" loading="eager">'
        f"</picture>"
        f'<span class="watch-badge-pg">{badge}</span>'
        f"</div>"
    )


def build_watch_div(w, lang, cfg):
    brand = w.get("brand", "")
    model = w.get("model", "")
    ref = w.get("reference", "") or "—"
    price = w.get("price")
    currency = w.get("currency", "EUR")
    sold = w.get("sold", False)
    desc = w.get(cfg["desc_key"]) or w.get("description_en", "")

    # WhatsApp URL
    wa_text = cfg["wa_msg"].format(brand=brand, model=model, ref=ref)
    wa_url = (
        "https://api.whatsapp.com/send?phone=355676360510&amp;text="
        + urllib.parse.quote(wa_text)
    )

    img_html = build_img_html(w)
    price_html = build_price_html(price, currency)

    swiss_html = ""
    if brand == "Hislon":
        swiss_html = (
            f'<p style="font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;'
            f'color:#8a9abf;font-weight:600;margin:0 0 .3rem">{cfg["swiss_label"]}</p>'
        )

    if sold:
        cta_html = (
            f'<p style="font-size:1rem;color:#888;font-weight:600">{cfg["sold_text"]}</p>'
        )
    else:
        cta_html = (
            f'<div class="watch-cta-wrap">'
            f'<a href="{wa_url}" target="_blank" rel="noopener noreferrer" '
            f'class="watch-cta-main" data-fb-contact="1">'
            f'<i class="fab fa-whatsapp" aria-hidden="true"></i> {cfg["cta_label"]}</a>'
            f'<a href="https://instagram.com/iglisiwatch" target="_blank" '
            f'rel="noopener noreferrer" class="watch-ig">'
            f'<i class="fab fa-instagram" aria-hidden="true"></i> {cfg["ig_label"]}</a>'
            f"</div>"
        )

    trust_html = (
        '<div class="trust-row">'
        + "".join(cfg["trust"])
        + "</div>"
    )

    info_html = (
        f'<div class="watch-info">'
        f'<a href="{cfg["back_href"]}" class="back-link">'
        f'<i class="fas fa-arrow-left" aria-hidden="true"></i> {cfg["back_label"]}</a>'
        f"<div>"
        f'<p class="watch-brand-pg">{brand}</p>'
        f"{swiss_html}"
        f'<h1 class="watch-title-pg">{model}</h1>'
        f'<p class="watch-ref-pg">{cfg["ref_label"]} {ref}</p>'
        f"</div>"
        f'<p class="watch-price-pg">{price_html}</p>'
        f'<p class="watch-desc-pg">{desc}</p>'
        f"{cta_html}"
        f"{trust_html}"
        f"</div>"
    )

    return (
        f'<div id="watch-content" class="watch-page pre-rendered">'
        f"{img_html}"
        f"{info_html}"
        f"</div>"
    )


updated = []
skipped_missing = []
unchanged = []

for w in watches:
    wid = w["id"]
    for lang, cfg in LANGS.items():
        path = BASE / lang / "shop" / f"{wid}.html"
        if not path.exists():
            skipped_missing.append(f"{lang}/shop/{wid}.html")
            continue

        html = path.read_text(encoding="utf-8")
        new_div = build_watch_div(w, lang, cfg)
        new_html = replace_watch_content(html, new_div)

        if new_html == html:
            unchanged.append(f"{lang}/shop/{wid}.html")
            print(f"  SKIP (no change): {lang}/shop/{wid}.html")
        else:
            path.write_text(new_html, encoding="utf-8")
            updated.append(f"{lang}/shop/{wid}.html")
            print(f"  OK: {lang}/shop/{wid}.html")

print(f"\nDone. Updated: {len(updated)}  |  Unchanged: {len(unchanged)}  |  Missing: {len(skipped_missing)}")
if skipped_missing:
    print("Missing:", skipped_missing)
