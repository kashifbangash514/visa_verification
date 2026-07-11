import './Spinner.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  tone?: 'navy' | 'light';
}

export default function Spinner({ size = 'medium', tone = 'navy' }: SpinnerProps) {
  return (
    <span
      className={`spinner spinner--${size} spinner--${tone}`}
      role="status"
      aria-label="Loading"
    />
  );
}
