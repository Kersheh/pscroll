import styles from './Spinner.module.scss';

interface SpinnerProps {
  color?: 'default' | 'white';
}
const Spinner = ({ color = 'default' }: SpinnerProps) => {
  return (
    <svg
      className={styles.spinner}
      style={color === 'white' ? { color } : {}}
      viewBox="22 22 44 44"
      data-testid="spinner"
    >
      <circle cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6"></circle>
    </svg>
  );
};

export default Spinner;
