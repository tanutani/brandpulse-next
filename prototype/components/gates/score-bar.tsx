export function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="score-row">
      <span className="score-label">{label}</span>
      <span className="score-track" aria-hidden="true">
        <span className="score-fill" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} />
      </span>
      <span className="score-value" aria-label={`${label} score ${score} out of 100`}>{score}</span>
    </div>
  );
}
