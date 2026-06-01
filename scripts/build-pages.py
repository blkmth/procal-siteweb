#!/usr/bin/env python3
"""Génère les pages services et les redirections depuis l'ancienne structure."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SERVICES = {
    'etalonnage': {
        'title': 'Étalonnage des Instruments de Mesure',
        'desc': 'Un instrument mal étalonné fausse vos décisions, compromet vos audits et engage votre responsabilité. Nous rétablissons la précision et la traçabilité de vos équipements.',
        'icon': 'fa-gauge-high',
        'slides': ['calibrage', 'controle', 'etalonnage'],
        'alts': ['Étalonnage industriel', 'Contrôle métrologique', 'Instruments de mesure'],
    },
    'controle': {
        'title': 'Contrôle Métrologique',
        'desc': 'Vérification périodique et conformité de vos équipements de mesure selon les normes en vigueur.',
        'icon': 'fa-clipboard-check',
        'slides': ['controle', 'calibrage', 'detecteurs'],
        'alts': ['Contrôle métrologique', 'Calibration', 'Inspection'],
    },
    'detecteurs': {
        'title': 'Détecteurs de Métaux Industriels',
        'desc': 'Validation et contrôle de performance de vos détecteurs pour garantir la sécurité alimentaire et industrielle.',
        'icon': 'fa-magnet',
        'slides': ['detecteurs', 'controle', 'calibrage'],
        'alts': ['Détecteur de métaux', 'Contrôle qualité', 'Calibration'],
    },
    'aimants': {
        'title': 'Aimants & Séparateurs Magnétiques',
        'desc': 'Contrôle et maintenance de vos équipements magnétiques pour une séparation efficace des contaminants ferreux.',
        'icon': 'fa-industry',
        'slides': ['aimants', 'detecteurs', 'controle'],
        'alts': ['Séparateurs magnétiques', 'Sécurité industrielle', 'Contrôle'],
    },
    'metrologie-medicale': {
        'title': 'Métrologie Médicale',
        'desc': 'Étalonnage et contrôle de vos dispositifs biomédicaux pour la sécurité des patients et la conformité réglementaire.',
        'icon': 'fa-heartbeat',
        'slides': ['medical', 'calibrage', 'controle'],
        'alts': ['Métrologie médicale', 'Étalonnage biomédical', 'Contrôle technique'],
    },
    'maintenance': {
        'title': 'Maintenance & Assistance Technique',
        'desc': 'Interventions sur site, dépannage et accompagnement technique pour vos instruments de mesure.',
        'icon': 'fa-screwdriver-wrench',
        'slides': ['maintenance', 'calibrage', 'controle'],
        'alts': ['Maintenance sur site', 'Assistance technique', 'Contrôle équipements'],
    },
}

HEAD = '''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} — PROCESS CALIBRATION</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Source+Serif+4:wght@300;400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <link rel="stylesheet" href="../../assets/css/main.css" />
</head>
<body data-base="../../" data-home="index.html">
  <div id="site-nav"></div>
'''

FOOT = '''
  <div id="site-footer"></div>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
  <script type="module" src="../../assets/js/main.js"></script>
</body>
</html>
'''

def slides_html(slides, alts):
    lines = []
    for i, (s, alt) in enumerate(zip(slides, alts)):
        active = ' active' if i == 0 else ''
        lines.append(f'''      <div class="hero-slide{active}" style="background-image: url('../../assets/images/services/{s}.webp');"></div>''')
    return '\n'.join(lines)

def dots_html(n):
    return '\n'.join(
        f'      <span class="carousel-dot{" active" if i == 0 else ""}" data-slide="{i}" role="button" tabindex="0" aria-label="Slide {i+1}"></span>'
        for i in range(n)
    )

def build_service(slug, data):
    content = HEAD.format(title=data['title'])
    content += f'''
  <section class="hero-section hero-section--service" data-carousel>
    <div class="hero-carousel" aria-hidden="true">
{slides_html(data['slides'], data['alts'])}
    </div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="service-hero-icon"><i class="fas {data['icon']}"></i></div>
      <h1 class="hero-title">{data['title']}</h1>
      <p class="hero-subtitle">{data['desc']}</p>
      <div class="hero-buttons">
        <a href="../../devis.html" class="btn-primary"><i class="fas fa-file-invoice"></i> Demander un devis</a>
        <a href="../../index.html#services" class="btn-secondary"><i class="fas fa-arrow-left"></i> Tous les services</a>
      </div>
    </div>
    <div class="hero-carousel-dots">
{dots_html(len(data['slides']))}
    </div>
  </section>

  <section class="service-details">
    <div class="container">
      <p class="about-paragraph">Contactez PROCESS CALIBRATION pour un devis personnalisé ou une intervention sur site. Réponse sous 24 heures.</p>
      <a href="../../devis.html" class="btn-primary"><i class="fas fa-file-invoice"></i> Demander un devis</a>
    </div>
  </section>
'''
    content += FOOT
    out = ROOT / 'pages' / 'services' / f'{slug}.html'
    out.write_text(content, encoding='utf-8')
    print('Wrote', out)

    # Redirect ancien fichier
    old = ROOT / f'service-{slug}.html'
    redirect = f'''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=pages/services/{slug}.html" />
  <link rel="canonical" href="pages/services/{slug}.html" />
  <title>Redirection…</title>
</head>
<body>
  <p><a href="pages/services/{slug}.html">Continuer vers {data['title']}</a></p>
</body>
</html>'''
    old.write_text(redirect, encoding='utf-8')

for slug, data in SERVICES.items():
    build_service(slug, data)

PY