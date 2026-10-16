# Regenerates src/data/imageDims.js (width/height for every photo) so <img> tags carry dimensions. Needs Pillow.
import os, json
from PIL import Image
d = {}
for dp, _, fs in os.walk('public/assets'):
    for f in fs:
        if f.lower().endswith(('.jpg', '.jpeg', '.png')) and 'og-' not in f and 'poster' not in f:
            p = os.path.join(dp, f); w, h = Image.open(p).size
            d['/' + os.path.relpath(p, 'public')] = [w, h]
open('src/data/imageDims.js', 'w').write('// Generated: natural width/height of every image under public/assets (stops layout shift). Re-run scripts/image-dims.py after adding photos.\nexport default ' + json.dumps(d, indent=0) + '\n')
