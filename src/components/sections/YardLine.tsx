/**
 * Marqueur de yards — séparateur de sections.
 * La page « descend le terrain » : 10, 20, 30… jusqu'à l'en-but (CTA final).
 */
export default function YardLine({ n }: { n: string }) {
  return (
    <div className="sc-yard" aria-hidden="true">
      <span className="sc-yard-hash" />
      <span className="sc-yard-num">{n}</span>
      <span className="sc-yard-hash" />
    </div>
  );
}
