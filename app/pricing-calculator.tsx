"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { calculateQuantity, convertMeasurement, floorBudget, type MeasurementUnit, type Surface } from "./planning-calculations";

type Benchmark = { id: string; name: string; region: string; scope: string; range: string; includes: string; url: string };
export function PricingCalculator({ locale = "en", quoteHref, benchmarks = [] }: { locale?: "en" | "fr"; quoteHref: string; benchmarks?: Benchmark[] }) {
  const fr = locale === "fr", id = useId();
  const [unit, setUnit] = useState<MeasurementUnit>("ft");
  const [mode, setMode] = useState<"dimensions" | "area">("dimensions");
  const [surfaces, setSurfaces] = useState<Surface[]>([{ length: "", width: "" }]);
  const [area, setArea] = useState("");
  const [waste, setWaste] = useState("10");
  const [boxCoverage, setBoxCoverage] = useState("");
  const [source, setSource] = useState(benchmarks[0]?.id || "");
  const [result, setResult] = useState<ReturnType<typeof calculateQuantity> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const areaUnit = unit === "m" ? "m²" : fr ? "pi²" : "sq. ft.";
  const lengthUnit = unit === "m" ? "m" : fr ? "pi" : "ft";
  const format = (n: number) => new Intl.NumberFormat(fr ? "fr-CA" : "en-CA", { maximumFractionDigits: 2 }).format(n);
  const money = (n: number) => new Intl.NumberFormat(fr ? "fr-CA" : "en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
  function changeUnit(next: MeasurementUnit) {
    setSurfaces(surfaces.map(s => ({ length: convertMeasurement(s.length, unit, next), width: convertMeasurement(s.width, unit, next) })));
    setArea(convertMeasurement(area, unit, next, true));
    setBoxCoverage(convertMeasurement(boxCoverage, unit, next, true));
    setUnit(next); setResult(null);
  }
  function calculate(event: FormEvent) {
    event.preventDefault();
    setResult(calculateQuantity({ mode, unit, surfaces, area, waste, boxCoverage }));
    // Focus follows the deliberate Calculate action, never an individual keystroke.
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  const valid = result && !("error" in result) ? result : null;
  const benchmark = benchmarks.find(item => item.id === source);
  const budget = valid && benchmark ? floorBudget(valid.areaSqFt, benchmark.id) : null;
  let plannedQuoteHref = quoteHref;
  if (valid) {
    const [path, query = ""] = quoteHref.split("?");
    const params = new URLSearchParams(query);
    params.set("calc_area", String(Number(valid.areaSqFt.toFixed(6))));
    params.set("calc_waste", String(valid.waste)); params.set("calc_unit", unit);
    plannedQuoteHref = path + "?" + params.toString();
  }
  const errors = fr ? {
    area: "Indiquez une superficie positive, jusqu’à 1 000 000 pi² (environ 92 903 m²).",
    dimensions: "Indiquez une longueur et une largeur positives pour chaque surface (maximum 1 000 par dimension).",
    waste: "Indiquez une marge de pertes entre 0 et 30 %.", box: "Indiquez la couverture positive d’une boîte, ou laissez ce champ vide.",
  } : {
    area: "Enter a positive area, up to 1,000,000 sq. ft. (about 92,903 m²).",
    dimensions: "Enter a positive length and width for every surface (maximum 1,000 per dimension).",
    waste: "Enter a cutting allowance between 0 and 30%.", box: "Enter a positive coverage per box, or leave it blank.",
  };
  return <section className="pricing-calculator section-pad" id="project-calculator" aria-labelledby={id + "-title"}>
    <p className="section-kicker">{fr ? "Vos mesures, votre préparation" : "Measure and plan"}</p>
    <h2 id={id + "-title"}>{fr ? "Calculez la quantité de carreaux." : "Work out how much tile you need."}</h2>
    <p className="guide-lead">{fr ? "Mesurez chaque plancher ou mur séparément, puis ajoutez une marge pour les coupes. Pour un escalier, comptez chaque marche, contremarche et palier. Ce calcul ne vérifie ni le calepinage ni la compatibilité des produits." : "Measure each floor or wall separately, then allow for cuts. For stairs, count each tread, riser and landing. This calculator does not check the tile layout or product suitability."}</p>
    <div className="calculator-layout">
      <form className="calculator-form" onSubmit={calculate}>
        <div className="calculator-pair">
          <label>{fr ? "Unités" : "Units"}<select value={unit} onChange={e => changeUnit(e.target.value as MeasurementUnit)}><option value="ft">{fr ? "Pieds / pieds carrés" : "Feet / square feet"}</option><option value="m">{fr ? "Mètres / mètres carrés" : "Metres / square metres"}</option></select></label>
          <label>{fr ? "Méthode de mesure" : "Measurement method"}<select value={mode} onChange={e => { setMode(e.target.value as "dimensions" | "area"); setResult(null); }}><option value="dimensions">{fr ? "Longueur × largeur" : "Length × width"}</option><option value="area">{fr ? "Superficie totale connue" : "I know the total area"}</option></select></label>
        </div>
        {mode === "dimensions" ? <>
          {surfaces.map((surface, index) => <fieldset className="calculator-surface" key={index}><legend>{fr ? "Surface" : "Surface"} {index + 1}</legend><div className="calculator-pair">
            <label>{fr ? "Longueur" : "Length"} ({lengthUnit})<input inputMode="decimal" maxLength={16} value={surface.length} onChange={e => { setSurfaces(surfaces.map((s, i) => i === index ? { ...s, length: e.target.value } : s)); setResult(null); }} placeholder={fr ? "Ex. 12" : "e.g. 12"}/></label>
            <label>{fr ? "Largeur / hauteur" : "Width / height"} ({lengthUnit})<input inputMode="decimal" maxLength={16} value={surface.width} onChange={e => { setSurfaces(surfaces.map((s, i) => i === index ? { ...s, width: e.target.value } : s)); setResult(null); }} placeholder={fr ? "Ex. 10" : "e.g. 10"}/></label>
          </div>{surfaces.length > 1 && <button className="calculator-text-button" type="button" onClick={() => { setSurfaces(surfaces.filter((_, i) => i !== index)); setResult(null); }}>{fr ? `Retirer la surface ${index + 1}` : `Remove surface ${index + 1}`}</button>}</fieldset>)}
          {surfaces.length < 10 && <button className="calculator-text-button" type="button" onClick={() => { setSurfaces([...surfaces, { length: "", width: "" }]); setResult(null); }}>{fr ? "+ Ajouter une surface" : "+ Add another surface"}</button>}
        </> : <label>{fr ? "Superficie totale" : "Total area"} ({areaUnit})<input inputMode="decimal" maxLength={16} value={area} onChange={e => { setArea(e.target.value); setResult(null); }}/></label>}
        <div className="calculator-pair">
          <label>{fr ? "Marge pour les coupes (%)" : "Cutting allowance (%)"}<input inputMode="decimal" maxLength={8} value={waste} onChange={e => { setWaste(e.target.value); setResult(null); }} aria-describedby={id + "-allowance"}/></label>
          <label>{fr ? "Couverture par boîte" : "Coverage per box"} ({areaUnit})<span className="calculator-optional">{fr ? "Facultatif — voir l’étiquette" : "Optional — check the carton"}</span><input inputMode="decimal" maxLength={16} value={boxCoverage} onChange={e => { setBoxCoverage(e.target.value); setResult(null); }}/></label>
        </div>
        <p className="calculator-note" id={id + "-allowance"}>{fr ? "Les 10 % affichés sont un point de départ modifiable, pas une prescription. Confirmez les pertes, les motifs et la réserve de réparation avec votre installateur avant de commander." : "The starting 10% is adjustable, not a specification. Confirm cuts, patterns and spare repair stock with your installer before ordering."}</p>
        {benchmarks.length > 0 && <label>{fr ? "Repère de budget à comparer" : "Budget benchmark to compare"}<select value={source} onChange={e => setSource(e.target.value)}>{benchmarks.map(b => <option value={b.id} key={b.id}>{b.name} · {b.region} · {b.range}</option>)}</select></label>}
        <button className="button button-primary" type="submit">{fr ? "Calculer" : "Calculate"}</button>
      </form>
      <div className="calculator-result" ref={resultRef} tabIndex={-1} aria-live="polite" aria-atomic="true">
        {!result && <><h3>{fr ? "Votre calcul apparaîtra ici." : "Your calculation will appear here."}</h3><p>{fr ? "Ajoutez vos mesures, puis choisissez Calculer. Le calcul est effectué dans votre navigateur. Vous pourrez vérifier le résumé sur la page de demande avant de l’envoyer." : "Add your measurements, then choose Calculate. Calculations run in your browser. You can review the summary on the quote page before submitting it."}</p></>}
        {result && "error" in result && <p role="alert">{errors[result.error!]}</p>}
        {valid && <>
          <h3>{fr ? "Votre quantité indicative" : "Your planning quantity"}</h3>
          <dl><div><dt>{fr ? "Surface mesurée" : "Measured surface"}</dt><dd>{format(valid.area)} {areaUnit}</dd></div><div><dt>{fr ? `Avec ${format(valid.waste)} % de pertes` : `With ${format(valid.waste)}% allowance`}</dt><dd>{format(valid.orderArea)} {areaUnit}</dd></div>{valid.cartons !== null && <div><dt>{fr ? "Boîtes complètes à prévoir" : "Full boxes to allow for"}</dt><dd>{valid.cartons}</dd></div>}</dl>
          <p className="calculator-note">{fr ? "La quantité avec pertes concerne l’achat des carreaux. La surface de pose reste la surface mesurée. L’affichage est arrondi; le nombre de boîtes est calculé avant cet arrondi." : "The allowance applies to tile purchasing. The installation area stays at the measured surface. Displayed areas are rounded; box counts use the unrounded calculation."}</p>
          {budget && benchmark && <div className="calculator-budget"><h3>{fr ? "Exemple de budget pour cette portée" : "Budget example for this scope"}</h3><strong>{money(budget.low)}–{money(budget.high)}</strong><p>{benchmark.scope}</p><p>{benchmark.includes}</p><p className="calculator-note">{format(valid.areaSqFt)} {fr ? "pi²" : "sq. ft."} × {benchmark.range.replace(/\.$/, "")}. {fr ? "Calcul sur la surface posée, sans ajouter les pertes à la main-d’œuvre. Les frais minimaux peuvent augmenter le total d’un petit chantier." : "Calculated on installed area, without adding cutting waste to labour. Minimum charges can increase a small project's total."}</p><p><a href={benchmark.url} target="_blank" rel="noopener noreferrer">{fr ? "Source" : "Source"}: {benchmark.name} · {benchmark.region} ↗</a></p></div>}
          <p className="calculator-disclaimer">{fr ? "Calcul de planification uniquement. Il ne s’agit ni d’un tarif ni d’une soumission de Tiling.ca. Faites confirmer les mesures, la portée, les exclusions et les taxes." : "Planning arithmetic only. This is not a Tiling.ca rate or quote. Confirm measurements, scope, exclusions and taxes for your project."}</p>
          <a className="button button-primary" href={plannedQuoteHref}>{fr ? "Joindre ces mesures à ma demande" : "Use these measurements in my quote request"}</a>
        </>}
      </div>
    </div>
    <noscript><p>{fr ? "Le calculateur interactif nécessite JavaScript. Sans celui-ci : multipliez longueur × largeur pour chaque surface, additionnez les surfaces, puis multipliez par 1 + la marge de pertes / 100. Divisez par la couverture d’une boîte et arrondissez au nombre entier supérieur." : "The interactive calculator needs JavaScript. Without it: multiply length × width for each surface, add the areas, then multiply by 1 + allowance / 100. Divide by carton coverage and round up to a whole box."}</p></noscript>
  </section>;
}
