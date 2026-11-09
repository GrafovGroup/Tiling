"""Build the small server-side housing reference from StatCan table 98-10-0041-01.

Usage: python3 scripts/import-local-housing.py /absolute/path/98100041-eng.zip
Download: https://www150.statcan.gc.ca/n1/tbl/csv/98100041-eng.zip
Reads the total-household column by position, retaining its own suppression symbol.
Never treats suppressed cells as zero. No remote requests at page-render time.
"""
import csv
import hashlib
import io
import json
from pathlib import Path
import re
import sys
import unicodedata
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PROVINCES = {"ON":"35","BC":"59","AB":"48","MB":"46","SK":"47","QC":"24","NS":"12","NB":"13","PE":"11","NL":"10","YT":"60","NT":"61","NU":"62"}
# Reviewed exceptions: identical municipality names, combined service areas,
# historical names, and clearly labelled wider-area references.
OVERRIDES = {
    "hamilton":["2021A00053525005"], "hamilton-township":["2021A00053514019"],
    "mattice-val-ca-ta":["2021A00053556077"], "tarbutt":["2021A00053557014"],
    "the-nation-municipality":["2021A00053502025"], "quebec-city":["2021A00052423027"],
    "moncton":["2021A00051307022"], "north-york":["2021A00053520005"],
    "langley":["2021A00055915001","2021A00055915002"],
    "north-vancouver":["2021A00055915046","2021A00055915051"],
    "fort-mcmurray":["2021A00054816037"], "sydney":["2021A00051217030"],
}
KEYS = ["total","detached","semi","row","duplex","lowrise","highrise","other","movable"]
CATEGORIES = ["Total - Structural type of dwelling","Single-detached house","Semi-detached house","Row house","Apartment or flat in a duplex","Apartment in a building that has fewer than five storeys","Apartment in a building that has five or more storeys","Other single-attached house","Movable dwelling"]

def normalize(value):
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", value).encode("ascii", "ignore").decode().lower())

municipalities = json.loads((ROOT / "app/ontario-coverage.json").read_text())
national = json.loads((ROOT / "app/national-areas.json").read_text())
original = [dict(slug=s,name=n,provinceCode="ON") for s,n in re.findall(r'slug: "([^"]+)", name: "([^"]+)"', (ROOT / "app/area-data.ts").read_text())]
areas = {item["slug"]:item for item in municipalities}
areas.update({item["slug"]:item for item in original + national})
archive = Path(sys.argv[1])
with zipfile.ZipFile(archive) as zipped:
    reader = csv.reader(io.TextIOWrapper(zipped.open("98100041.csv"), encoding="utf-8-sig"))
    header = next(reader)
    assert header[5] == "Household size (8):Total - Household size[1]" and header[6] == "Symbol"
    records = {}
    for row in reader:
        if len(row) < 7 or not row[2].startswith("2021A0005"):
            continue
        assert row[0] == "2021"
        record = records.setdefault(row[2], {"name":row[1], "counts":{}})
        key = KEYS[CATEGORIES.index(row[3])]
        record["counts"][key] = int(row[5]) if row[5].isdigit() and not row[6] else None

output = {}
for slug, area in areas.items():
    province = PROVINCES[area.get("provinceCode", "ON")]
    ids = OVERRIDES.get(slug, [dg for dg,r in records.items() if dg[9:11] == province and normalize(r["name"]) == normalize(area["name"])])
    assert len(ids) == (2 if slug in ["langley","north-vancouver"] else 1), (slug, ids)
    assert all(dg[9:11] == province for dg in ids), slug
    counts = {}
    for key in KEYS:
        values = [records[dg]["counts"][key] for dg in ids]
        counts[key] = sum(values) if all(v is not None for v in values) else None
    output[slug] = {"geographies":[{"dguid":dg,"name":records[dg]["name"]} for dg in ids], "counts":counts}

(ROOT / "app/local-housing.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
audit = {"table":"98-10-0041-01","year":2021,"retrieved":"2026-11-08","download":"https://www150.statcan.gc.ca/n1/tbl/csv/98100041-eng.zip","sha256":hashlib.sha256(archive.read_bytes()).hexdigest(),"locations":len(output),"suppressed":[s for s,r in output.items() if r["counts"]["total"] is None],"reviewedMappings":OVERRIDES,"method":"Exact normalized municipality name and province, plus reviewed exceptions. Counts for Langley and North Vancouver sum two CSDs; wider Toronto, Wood Buffalo and Cape Breton references are labelled in the UI. 2021 boundaries; published counts are rounded. These data do not establish building condition, tenure, service availability or local pricing."}
(ROOT / "docs/local-housing-audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"locations":len(output),"suppressed":audit["suppressed"]}))
