"""VMORDEKAI® · gerador do catálogo de produtos.

Fonte única:  data/produtos.json
Gera:         js/data/produtos.js            (catálogo usado pelo shop e pelas páginas)
              produto_<slug>.html            (uma página por produto, com SEO próprio)
              shop.html                      (lista sem JavaScript entre os marcadores produtos:inicio/fim)

Uso:
    python3 tools/build_produtos.py           # gera e mostra pendências de dados
    python3 tools/build_produtos.py --check   # falha se algum arquivo gerado estiver desatualizado

Sem dependências externas.
"""
from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "data" / "produtos.json"
CATALOG_JS = ROOT / "js" / "data" / "produtos.js"
SHOP = ROOT / "shop.html"
SITE = "https://victormordekai.github.io/VMORDEKAI/"

REQUIRED = ("ref", "slug", "nome", "categoria", "resumo", "descricao", "imagens")
OPTIONAL = ("volume", "dimensoes", "material", "forro", "cores", "preco", "disponibilidade")

PAGE = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- GERADO por tools/build_produtos.py a partir de data/produtos.json — não editar à mão. -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{nome} · {ref} | VMORDEKAI® SHOP</title>
  <meta name="description" content="{descricao}">
  <meta name="author" content="Victor Mordekai Ferreira">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#000000">
  <link rel="canonical" href="{url}">
  <meta property="og:type" content="product">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="VMORDEKAI®">
  <meta property="og:title" content="{nome} | VMORDEKAI®">
  <meta property="og:description" content="{resumo}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{imagem_url}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" type="image/png" sizes="32x32" href="imagens/logo-corpo.png">
  <link rel="apple-touch-icon" href="imagens/logo-corpo.png">

  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages/shop.css">
</head>

<body id="top" class="page-product" data-produto="{slug}">

  <vm-header>
    <a href="index.html">INÍCIO</a>
    <a href="shop.html">SHOP</a>
    <a href="shop.html#catalogo">CATÁLOGO</a>
    <a href="#relacionados">VEJA TAMBÉM</a>
    <a href="https://wa.me/message/LIKDPGYCWU5CF1">CONTATO</a>
  </vm-header>

  <main class="product-page">
    <ol class="breadcrumb">
      <li><a href="shop.html">Shop</a></li>
      <li><a href="shop.html#catalogo">{categoria}s</a></li>
      <li aria-current="page">{nome}</li>
    </ol>

    <div data-product-sheet>
      <noscript>
        <h1>{nome}</h1>
        <p>{ref} · {categoria}</p>
        <img src="{imagem}" alt="{imagem_alt}">
        <p>{descricao}</p>
      </noscript>
    </div>

    <section id="relacionados" class="product-related" aria-labelledby="relacionados-titulo">
      <h2 id="relacionados-titulo">Veja também</h2>
      <div class="shop-grid" data-related></div>
    </section>
  </main>

  <vm-footer></vm-footer>

  <script type="module" src="js/shop/product-page.js"></script>
</body>
</html>
"""


def load() -> dict:
    return json.loads(SOURCE.read_text(encoding="utf-8"))


def validate(data: dict) -> list[str]:
    """Erros bloqueiam a geração; pendências apenas informam dados ainda não definidos."""
    errors: list[str] = []
    refs, slugs = set(), set()
    products = data["produtos"]
    for p in products:
        name = p.get("nome", "?")
        for key in REQUIRED:
            if not p.get(key):
                errors.append(f"{name}: campo obrigatório ausente '{key}'")
        if p.get("ref") in refs:
            errors.append(f"referência duplicada: {p['ref']}")
        if p.get("slug") in slugs:
            errors.append(f"slug duplicado: {p['slug']}")
        refs.add(p.get("ref"))
        slugs.add(p.get("slug"))
        if not re.fullmatch(r"[a-z0-9-]+", p.get("slug", "")):
            errors.append(f"{name}: slug inválido '{p.get('slug')}' (use a-z, 0-9 e hífen)")
        for img in p.get("imagens", []):
            if not (ROOT / img["src"]).exists():
                errors.append(f"{name}: imagem não encontrada {img['src']}")
    for p in products:
        for ref in p.get("complementos", []):
            if ref not in refs:
                errors.append(f"{p['nome']}: complemento inexistente {ref}")
    return errors


def pending(data: dict) -> list[str]:
    return [
        f"{p['ref']} {p['nome']}: " + ", ".join(k for k in OPTIONAL if p.get(k) in (None, ""))
        for p in data["produtos"]
        if any(p.get(k) in (None, "") for k in OPTIONAL)
    ]


def catalog_js(data: dict) -> str:
    body = json.dumps(data, ensure_ascii=False, indent=2)
    return (
        "// GERADO por tools/build_produtos.py a partir de data/produtos.json — não editar à mão.\n"
        f"export const CATALOGO = {body};\n"
    )


def page_html(p: dict) -> str:
    e = lambda v: html.escape(str(v), quote=True)
    first = p["imagens"][0]
    return PAGE.format(
        nome=e(p["nome"]), ref=e(p["ref"]), slug=e(p["slug"]), categoria=e(p["categoria"]),
        descricao=e(p["descricao"]), resumo=e(p["resumo"]),
        url=f"{SITE}produto_{p['slug']}.html",
        imagem=e(first["src"]), imagem_alt=e(first["alt"]), imagem_url=f"{SITE}{first['src']}",
    )


def shop_html(data: dict) -> str:
    current = SHOP.read_text(encoding="utf-8")
    items = "\n".join(
        f'          <li><a href="produto_{p["slug"]}.html">{html.escape(p["nome"])} · {p["ref"]}</a></li>'
        for p in data["produtos"]
    )
    block = (
        "<!-- produtos:inicio · lista gerada por tools/build_produtos.py (sem JavaScript) -->\n"
        f'      <noscript>\n        <ul class="shop-fallback">\n{items}\n        </ul>\n      </noscript>\n'
        "      <!-- produtos:fim -->"
    )
    return re.sub(r"<!-- produtos:inicio.*?<!-- produtos:fim -->", block, current, flags=re.S)


def outputs(data: dict) -> dict[Path, str]:
    files = {CATALOG_JS: catalog_js(data), SHOP: shop_html(data)}
    for p in data["produtos"]:
        files[ROOT / f"produto_{p['slug']}.html"] = page_html(p)
    return files


def main() -> None:
    data = load()
    errors = validate(data)
    if errors:
        raise SystemExit("Erros no catálogo:\n  - " + "\n  - ".join(errors))

    files = outputs(data)
    stale = sorted(
        {path.name for path in ROOT.glob("produto_*.html")} - {path.name for path in files}
    )

    if "--check" in sys.argv:
        outdated = [path.name for path, text in files.items() if not path.exists() or path.read_text(encoding="utf-8") != text]
        if outdated or stale:
            raise SystemExit(f"Desatualizado: {', '.join(outdated + stale)} — rode tools/build_produtos.py")
        print("Catálogo e páginas de produto em dia com data/produtos.json.")
        return

    CATALOG_JS.parent.mkdir(parents=True, exist_ok=True)
    for path, text in files.items():
        path.write_text(text, encoding="utf-8")
    for name in stale:
        (ROOT / name).unlink()
        print(f"removido (produto saiu do catálogo): {name}")
    print(f"gerados: {len(files)} arquivos ({len(data['produtos'])} produtos)")

    gaps = pending(data)
    if gaps:
        print("\nPendências de dados (exibidas como 'Sob consulta' ou omitidas no site):")
        for line in gaps:
            print("  -", line)


if __name__ == "__main__":
    main()
