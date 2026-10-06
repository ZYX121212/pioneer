export function ContentPoints({ text, lang = "zh" }: { text: string; lang?: "zh" | "en" }) {
  const points = Array.from(new Intl.Segmenter(lang, { granularity: "sentence" }).segment(text), item => item.segment.trim()).filter(Boolean);
  return <ul className="content-points">{points.map((point, index) => <li key={index}>{point}</li>)}</ul>;
}
