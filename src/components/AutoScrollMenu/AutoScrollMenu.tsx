import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { map } from 'lodash';

import { SCROLL_SPEEDS } from 'src/utils/constants';
import IconArrowDown from 'src/components/icons/IconArrowDown';
import IconClose from 'src/components/icons/IconClose';
import styles from './AutoScrollMenu.module.scss';

type ScrollSpeed = keyof typeof SCROLL_SPEEDS;

interface AutoScrollMenuProps {
  isScroll: boolean;
  setIsScroll: Dispatch<SetStateAction<boolean>>;
}
const AutoScrollMenu = ({ isScroll, setIsScroll }: AutoScrollMenuProps) => {
  const scrollMenuRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed, setScrollSpeed] = useState(SCROLL_SPEEDS.m);
  const [showScrollSpeed, setShowScrollSpeed] = useState(false);

  // handle mouseover to display scroll speed menu
  useEffect(() => {
    const ref = scrollMenuRef.current;
    if (isScroll && ref) {
      const mouseOverHandler = () => setShowScrollSpeed(true);
      const mouseOutHandler = () => setShowScrollSpeed(false);

      ref.addEventListener('mouseover', mouseOverHandler);
      ref.addEventListener('mouseout', mouseOutHandler);

      return () => {
        ref.removeEventListener('mouseover', mouseOverHandler);
        ref.removeEventListener('mouseout', mouseOutHandler);
      };
    } else {
      setShowScrollSpeed(false);
    }
  }, [isScroll]);

  // handle autoscroll based on active scroll speed when enabled
  useEffect(() => {
    if (isScroll) {
      const interval = setInterval(() => {
        window.scrollBy({ top: scrollSpeed.px, behavior: 'smooth' });
      }, scrollSpeed.t);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isScroll, scrollSpeed]);

  const ScrollSpeedBtn = ({ speed }: { speed: ScrollSpeed }) => (
    <button
      type="button"
      className={scrollSpeed.px === SCROLL_SPEEDS[speed].px ? styles.active : ''}
      onClick={() => setScrollSpeed(SCROLL_SPEEDS[speed])}
    >
      {speed}
    </button>
  );

  return (
    <div className={styles.autoScrollMenu} ref={scrollMenuRef}>
      <button type="button" className={styles.scrollBtn} onClick={() => setIsScroll(!isScroll)}>
        {isScroll ? <IconClose /> : <IconArrowDown />}
      </button>

      <div className={`${styles.scrollSpeed} ${!isScroll && !showScrollSpeed ? styles.scrollSpeedCollapsed : ''}`}>
        {map(SCROLL_SPEEDS, (_, key: ScrollSpeed) => (
          <ScrollSpeedBtn key={key} speed={key} />
        ))}
      </div>
    </div>
  );
};

export default AutoScrollMenu;
