export function ProgressRing({ value, size = 92, label }: { value: number; size?: number; label?: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-ring" style={{ width: size, height: size }} aria-label={`${safeValue}% dovršeno`}>
      <svg viewBox="0 0 100 100">
        <circle className="ring-track" cx="50" cy="50" r={radius} />
        <circle className="ring-value" cx="50" cy="50" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - safeValue / 100)} />
      </svg>
      <div className="ring-label"><strong>{safeValue}%</strong>{label && <span>{label}</span>}</div>
    </div>
  );
}
