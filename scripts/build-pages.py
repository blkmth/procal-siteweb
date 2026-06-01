#!/usr/bin/env python3
"""Génère les pages services complètes (cahier des charges)."""

import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / 'assets' / 'images' / 'services'

# Dossiers d'images par service (sous assets/images/services/)
SLIDE_FOLDERS = {
    'etalonnage': None,
    'controle': 'controle metrologique',
    'detecteurs': 'detecteur de metaux',
    'aimants': 'aimants et separateur',
    'metrologie-medicale': 'metrologie medicale',
    'maintenance': 'maintenance sur site',
}

# Fichiers à la racine de services/ si pas de dossier dédié
SLIDE_FALLBACK = {
    'etalonnage': ['etalonnage.webp', 'calibrage.webp'],
}

SECTION_ICONS = {
    'Domaines': 'fa-layer-group',
    'Prestations': 'fa-clipboard-list',
    'Prestations proposées': 'fa-magnet',
    'Services': 'fa-shield-halved',
    'Applications industrielles': 'fa-industry',
    'Objectifs': 'fa-bullseye',
    'Équipements concernés': 'fa-stethoscope',
}

SERVICES = {
    'etalonnage': {
        'title': 'Étalonnage des Instruments de Mesure',
        'meta': 'Étalonnage et contrôle des instruments de mesure : pression, température, masse, débit, humidité. PROCAL, Bingerville.',
        'icon': 'fa-gauge-high',
        'hero_sub': 'Contrôle et ajustement des instruments afin de garantir la précision et la fiabilité des mesures industrielles et techniques.',
        'sections': [
            {
                'heading': 'Domaines',
                'items': [
                    'Pression',
                    'Température',
                    'Masse',
                    'Débit',
                    'Humidité',
                    'Instruments de laboratoire',
                ],
            },
        ],
    },
    'controle': {
        'title': 'Contrôle Métrologique',
        'meta': 'Vérifications et contrôles métrologiques pour la conformité réglementaire de vos équipements. PROCAL.',
        'icon': 'fa-clipboard-check',
        'hero_sub': 'Nous réalisons les vérifications et contrôles métrologiques nécessaires pour assurer la conformité de vos équipements aux normes et exigences réglementaires.',
        'sections': [
            {
                'heading': 'Prestations',
                'items': [
                    'Vérification périodique',
                    'Contrôle de conformité',
                    'Rapports techniques',
                    'Certificats d\'étalonnage',
                ],
            },
        ],
    },
    'detecteurs': {
        'title': 'Détecteurs de Métaux Industriels',
        'meta': 'Essais et validations métrologiques des détecteurs de métaux industriels. PROCAL, Côte d\'Ivoire.',
        'icon': 'fa-shield-halved',
        'hero_sub': 'PROCESS CALIBRATION assure les essais et validations métrologiques des détecteurs de métaux industriels afin de sécuriser vos lignes de production.',
        'sections': [
            {
                'heading': 'Services',
                'items': [
                    'Tests de sensibilité',
                    'Contrôle Fe / Non-Fe / Inox',
                    'Validation de performance',
                    'Rapports d\'essais',
                    'Certificats de conformité',
                ],
            },
        ],
    },
    'aimants': {
        'title': 'Aimants & Séparateurs Magnétiques',
        'subtitle': 'Contrôle et Vérification des Systèmes Magnétiques Industriels',
        'meta': 'Contrôle et vérification des systèmes magnétiques industriels. PROCAL.',
        'icon': 'fa-magnet',
        'hero_sub': 'PROCESS CALIBRATION propose des prestations spécialisées de contrôle, d\'inspection et de validation des équipements magnétiques utilisés dans les processus industriels.',
        'body_skip_hero': True,
        'intro_extra': [
            'Nos interventions permettent d\'assurer l\'efficacité des systèmes de séparation magnétique et la protection des lignes de production contre les contaminants métalliques.',
        ],
        'sections': [
            {
                'heading': 'Prestations proposées',
                'items': [
                    'Contrôle de puissance magnétique',
                    'Vérification des séparateurs magnétiques',
                    'Inspection des barreaux magnétiques',
                    'Contrôle des plaques magnétiques',
                    'Vérification des grilles magnétiques',
                    'Évaluation des performances de séparation',
                    'Rapports techniques et certificats',
                ],
            },
            {
                'heading': 'Applications industrielles',
                'list_intro': 'Nos services concernent notamment :',
                'items': [
                    'L\'industrie agroalimentaire',
                    'L\'industrie pharmaceutique',
                    'Les mines',
                    'Les cimenteries',
                    'Les industries plastiques',
                    'Les unités de recyclage',
                    'Les lignes de production industrielles',
                ],
                'single_col': True,
            },
            {
                'heading': 'Objectifs',
                'list_intro': 'Garantir :',
                'items': [
                    'La performance des séparateurs',
                    'La réduction des contaminations métalliques',
                    'La conformité qualité',
                    'La sécurité des procédés industriels',
                ],
            },
        ],
    },
    'metrologie-medicale': {
        'title': 'Métrologie Médicale',
        'meta': 'Contrôle et vérification des équipements biomédicaux. Sécurité des patients. PROCAL.',
        'icon': 'fa-heartbeat',
        'subtitle': 'La précision au service de la sécurité des patients.',
        'hero_sub': 'La précision au service de la sécurité des patients.',
        'body_skip_hero': True,
        'intro_extra': [
            'Nous accompagnons les structures médicales et laboratoires dans le contrôle et la vérification des équipements biomédicaux.',
        ],
        'sections': [
            {
                'heading': 'Équipements concernés',
                'items': [
                    'Thermomètres médicaux',
                    'Tensiomètres',
                    'Balances médicales',
                    'Incubateurs',
                    'Autoclaves',
                    'Équipements de laboratoire',
                ],
            },
            {
                'heading': 'Objectifs',
                'items': [
                    'Fiabilité des mesures',
                    'Sécurité des patients',
                    'Conformité réglementaire',
                    'Performance des équipements',
                ],
            },
        ],
    },
    'maintenance': {
        'title': 'Maintenance & Assistance Technique',
        'meta': 'Maintenance préventive et corrective de vos équipements de mesure. PROCAL.',
        'icon': 'fa-screwdriver-wrench',
        'hero_sub': 'Nous proposons des services de maintenance préventive et corrective pour optimiser la durée de vie et les performances de vos équipements.',
        'sections': [],
    },
}


def _natural_sort_key(path: Path) -> list:
    parts = re.split(r'(\d+)', path.name.lower())
    return [int(p) if p.isdigit() else p for p in parts]


def image_url(rel_path: str) -> str:
    """Chemin relatif depuis pages/services/ vers une image (espaces encodés)."""
    encoded = '/'.join(quote(part, safe='') for part in rel_path.split('/'))
    return f"../../assets/images/services/{encoded}"


def discover_slides(slug: str) -> list[str]:
    """Liste les images du dossier service, ou repli sur SLIDE_FALLBACK."""
    folder_name = SLIDE_FOLDERS.get(slug)
    if folder_name:
        folder = IMAGES / folder_name
        if folder.is_dir():
            files = sorted(folder.glob('*.webp'), key=_natural_sort_key)
            if not files:
                files = sorted(folder.glob('*.jpg'), key=_natural_sort_key)
                files += sorted(folder.glob('*.png'), key=_natural_sort_key)
            if files:
                return [f'{folder_name}/{f.name}' for f in files]

    fallback = SLIDE_FALLBACK.get(slug, [])
    existing = [p for p in fallback if (IMAGES / p).exists()]
    if existing:
        return existing

    # Dernier recours : image à la racine nommée comme le slug
    for ext in ('.webp', '.jpg', '.png'):
        p = IMAGES / f'{slug}{ext}'
        if p.exists():
            return [f'{slug}{ext}']
    return ['calibrage.webp']


def slides_html(slide_paths: list[str]) -> str:
    lines = []
    for i, rel in enumerate(slide_paths):
        active = ' active' if i == 0 else ''
        url = image_url(rel)
        lines.append(
            f'      <div class="hero-slide{active}" '
            f'style="background-image: url(\'{url}\');"></div>'
        )
    return '\n'.join(lines)


def dots_html(n):
    return '\n'.join(
        f'      <span class="carousel-dot{" active" if i == 0 else ""}" data-slide="{i}" '
        f'role="button" tabindex="0" aria-label="Slide {i + 1}"></span>'
        for i in range(n)
    )


def intro_html(data) -> str:
    parts = []
    if data.get('subtitle'):
        parts.append(
            f'            <p class="service-intro service-intro--lead">{data["subtitle"]}</p>\n'
        )
    if not data.get('body_skip_hero'):
        parts.append(f'            <p class="service-intro">{data["hero_sub"]}</p>\n')
    if data.get('highlight'):
        parts.append(
            f'            <div class="service-highlight-block"><p>{data["highlight"]}</p></div>\n'
        )
    for extra in data.get('intro_extra', []):
        parts.append(f'            <p class="service-intro">{extra}</p>\n')
    if not parts:
        return ''
    return f'''          <div class="service-details-intro">
{''.join(parts)}          </div>
'''


def sections_html(data) -> str:
    if not data['sections']:
        return ''

    blocks = []
    for sec in data['sections']:
        icon = SECTION_ICONS.get(sec['heading'], 'fa-circle-check')
        col = ' service-offer-grid--col1' if sec.get('single_col') else ''
        intro = sec.get('list_intro', '')
        intro_block = f'            <p class="service-list-intro">{intro}</p>\n' if intro else ''
        chips = '\n'.join(
            f'''            <li>
              <span class="service-offer-chip">
                <i class="fas fa-check" aria-hidden="true"></i>
                <span>{item}</span>
              </span>
            </li>'''
            for item in sec['items']
        )
        blocks.append(f'''        <article class="service-offer-block">
          <header class="service-offer-block__header">
            <span class="service-offer-block__icon" aria-hidden="true">
              <i class="fas {icon}"></i>
            </span>
            <h3 class="service-offer-block__title">{sec["heading"]}</h3>
          </header>
{intro_block}          <ul class="service-offer-grid{col}">
{chips}
          </ul>
        </article>''')

    return f'''          <div class="service-offer-blocks">
{chr(10).join(blocks)}
          </div>
'''


def build_page(slug, data):
    slide_paths = discover_slides(slug)
    n = len(slide_paths)
    body = f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{data["title"]} — PROCESS CALIBRATION</title>
  <meta name="description" content="{data["meta"]}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Source+Serif+4:wght@300;400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="../../assets/css/main.css" />
</head>
<body data-base="../../" data-home="index.html">
  <div id="site-nav"></div>

  <section class="hero-section hero-section--service" data-carousel>
    <div class="hero-carousel" aria-hidden="true">
{slides_html(slide_paths)}
    </div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="service-hero-icon"><i class="fas {data["icon"]}"></i></div>
      <h1 class="hero-title">{data["title"]}</h1>
      <p class="hero-subtitle">{data["hero_sub"]}</p>
      <div class="hero-buttons">
        <a href="../../devis.html" class="btn-primary"><i class="fas fa-file-invoice"></i> Demander un devis</a>
        <a href="../../index.html#services" class="btn-secondary"><i class="fas fa-arrow-left"></i> Tous les services</a>
      </div>
    </div>
    <div class="hero-carousel-dots">
{dots_html(n)}
    </div>
  </section>

  <section class="service-details">
    <div class="container">
      <div class="service-details-grid">
        <div class="service-details-main">
          <span class="section-tag">Nos Services</span>
          <h2 class="section-title">{data["title"]}</h2>
{intro_html(data)}{sections_html(data)}
        </div>
        <aside class="service-details-sidebar">
          <div class="service-cta-card">
            <h3>Besoin d\'un devis ?</h3>
            <p>Obtenez une proposition personnalisée sous 24 heures.</p>
            <a href="../../devis.html" class="btn-primary btn-full">
              <i class="fas fa-file-invoice"></i> Demander un devis
            </a>
          </div>
          <div class="service-info-card">
            <h3>Pourquoi PROCAL ?</h3>
            <ul class="info-list">
              <li><i class="fas fa-check"></i> Expertise métrologique certifiée</li>
              <li><i class="fas fa-check"></i> Interventions sur site</li>
              <li><i class="fas fa-check"></i> Rapports et certificats officiels</li>
              <li><i class="fas fa-check"></i> Réponse sous 24 h</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <div class="cta-content">
        <h2>Un projet ? Parlons-en.</h2>
        <p>Contactez PROCESS CALIBRATION pour planifier une intervention ou obtenir un devis adapté à vos équipements.</p>
        <div class="cta-buttons">
          <a href="../../devis.html" class="btn-primary"><i class="fas fa-file-invoice"></i> Demander un devis</a>
          <a href="../../index.html#contact" class="btn-secondary"><i class="fas fa-envelope"></i> Nous contacter</a>
        </div>
      </div>
    </div>
  </section>

  <div id="site-footer"></div>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  <script type="module" src="../../assets/js/main.js"></script>
</body>
</html>
'''
    out = ROOT / 'pages' / 'services' / f'{slug}.html'
    out.write_text(body, encoding='utf-8')
    print('OK', out.name)


def main():
    for slug, data in SERVICES.items():
        build_page(slug, data)


if __name__ == '__main__':
    main()
