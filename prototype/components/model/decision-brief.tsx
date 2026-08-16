export function DecisionBrief({
  deciding,
  considered,
  changed,
  continuation,
}: {
  deciding: string;
  considered: string;
  changed: string;
  continuation: string;
}) {
  const items = [
    ["What you are deciding", deciding],
    ["What the model considered", considered],
    ["What changed", changed],
    ["Why you can continue", continuation],
  ];

  return (
    <section className="decision-brief" aria-label="Decision explained in plain language">
      {items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
    </section>
  );
}
