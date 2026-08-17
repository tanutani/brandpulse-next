export function ScoreBar({
  label,
  score,
  weakest = false,
}: {
  label: string;
  score: number;
  weakest?: boolean;
}) {
  return (
    <div className={`gate-meter${weakest ? " is-weakest" : ""}`}>
      <span className="gate-meter-label">{label}</span>
      <span className="gate-meter-track" aria-hidden="true">
        <span
          className="gate-meter-fill"
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </span>
      <span className="gate-meter-value" aria-label={`${label} score ${score} out of 100`}>
        {score}
      </span>
    </div>
  );
}
