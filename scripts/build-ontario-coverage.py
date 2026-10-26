"""Rebuild the Ontario coverage index from saved official municipality/community research."""
import json, re, unicodedata
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def slug(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')
def norm(s): return slug(s).replace('-','')
source=root/'docs/ontario-source-data'
municipalities=json.loads((source/'municipalities.json').read_text())
municipalities=[m for m in municipalities if m['tier']!='Upper Tier']
research=[]
for region in ['west','east','north']: research+=json.loads((source/f'{region}-communities.json').read_text())
aliases={'Adelaide Metcalfe':'Adelaide-Metcalfe','Prince Edward County':'Prince Edward'}
byname={norm(aliases.get(r['municipality'],r['municipality'])):r for r in research}
base_source=(root/'app/area-data.ts').read_text()
base=[{'slug':a,'name':b,'province':'Ontario'} for a,b in re.findall(r'slug: "([^"]+)", name: "([^"]+)"',base_source)]
base+=json.loads((root/'app/national-areas.json').read_text())
existing={norm(x['name']):x for x in base if x['province']=='Ontario'}
used={x['slug'] for x in base}
result=[]
for m in municipalities:
    name=m['name']; r=byname.get(norm(name)); key=norm(name)
    if name=='Hamilton' and m['type']=='Township of':
        name='Hamilton Township';r=None;key=norm(name)
    if name=='Prince Edward': name='Prince Edward County'
    old=existing.get(key)
    place_slug=old['slug'] if old else slug(name)
    if not old and place_slug in used: place_slug+='-ontario'
    assert place_slug not in {x['slug'] for x in result}, place_slug
    used.add(place_slug)
    names=list(dict.fromkeys(r['communities'] if r else []))
    names=[n for n in names if norm(n)!=norm(name)]
    result.append({**m,'name':name,'slug':place_slug,'regionSlug':slug(m['region']),
      'communities':[{'name':n,'id':slug(n)} for n in names],
      'sourceUrls':r['sourceUrls'] if r else [],
      'planningNote':r['planningNote'] if r else ''})
assert len(result)==414
(root/'app/ontario-coverage.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
report={'municipalities':len(result),'communityEntries':sum(len(r['communities']) for r in result),'distinctCommunityNames':len({norm(c['name']) for r in result for c in r['communities']}),'regions':len({r['region'] for r in result}),'newMunicipalPages':sum(r['slug'] not in {x['slug'] for x in base} for r in result),'municipalitySource':'https://data.ontario.ca/dataset/municipalities','retrieved':'2026-10-12','scope':'All 414 lower-/single-tier Ontario municipalities in the official May 2026 list. Named submunicipal communities are a verified selection, not an exhaustive Ontario gazetteer. Municipal coverage includes addresses beyond the named examples. Shared-border communities require exact address confirmation. No local office or branch is implied.'}
(root/'docs/ontario-coverage-audit.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
