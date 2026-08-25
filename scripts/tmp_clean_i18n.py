#!/usr/bin/env python3
"""Remover chaves i18n orfas da seccao indice removida (one-shot)."""
import re

path = '/home/roger/van-manual/js/translations.js'
with open(path) as f:
    lines = f.readlines()

before = len(lines)
pat = re.compile(r'^\s*"(index\.(title|intro|cards\.[a-z]+)|nav\.manualIndex)":')
kept = [l for l in lines if not pat.match(l)]

with open(path, 'w') as f:
    f.writelines(kept)

print(f'removidas {before - len(kept)} linhas ({before} -> {len(kept)})')
text = ''.join(kept)
for key in ['index.title', 'nav.manualIndex', 'index.cards.', 'index.intro']:
    print(f'{key}: {text.count(key)} restantes')
for lang in ['pt', 'en', 'fr', 'es', 'de']:
    m = re.search(lang + r':\s*\{(.*?)\n  \}', text, re.S)
    if m:
        n = len(re.findall(r'"[^"]+":', m.group(1)))
        print(f'{lang}: {n} chaves')
