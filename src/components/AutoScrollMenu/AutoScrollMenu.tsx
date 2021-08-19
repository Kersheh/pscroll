import { useState, useEffect, useRef, Dispatch, SetStateAction, useCallback } from 'react';
import { map } from 'lodash';

import { SCROLL_SPEEDS } from 'src/utils/constants';
import IconArrowDown from 'src/components/icons/IconArrowDown';
import IconClose from 'src/components/icons/IconClose';
import IconSlow from 'src/components/icons/IconSlow';
import IconSlowFilled from 'src/components/icons/IconSlowFilled';
import IconFast from 'src/components/icons/IconFast';
import IconFastFilled from 'src/components/icons/IconFastFilled';
import IconRadioUnchecked from 'src/components/icons/IconRadioUnchecked';
import IconRadioChecked from 'src/components/icons/IconRadioChecked';
import styles from './AutoScrollMenu.module.scss';

type ScrollSpeed = keyof typeof SCROLL_SPEEDS;

interface AutoScrollMenuProps {
  isScroll: boolean;
  setIsScroll: Dispatch<SetStateAction<boolean>>;
  isOverlayOpen: boolean;
}
const AutoScrollMenu = ({ isScroll, setIsScroll, isOverlayOpen }: AutoScrollMenuProps) => {
  const scrollMenuRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed, setScrollSpeed] = useState(SCROLL_SPEEDS.m);
  const [showScrollSpeed, setShowScrollSpeed] = useState(false);

  // handle mouseover to display scroll speed menu
  useEffect(() => {
    const ref = scrollMenuRef.current;
    setShowScrollSpeed(true);

    if (isScroll && ref) {
      const mouseEnterHandler = () => setShowScrollSpeed(true);
      const mouseLeaveHandler = () => setShowScrollSpeed(false);

      ref.addEventListener('mouseenter', mouseEnterHandler);
      ref.addEventListener('mouseleave', mouseLeaveHandler);

      return () => {
        ref.removeEventListener('mouseenter', mouseEnterHandler);
        ref.removeEventListener('mouseleave', mouseLeaveHandler);
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

  // increment/decrement scroll speed
  const changeScrollSpeed = useCallback(
    (change: 'faster' | 'slower') => {
      const scrollSpeedsArray = map(SCROLL_SPEEDS, (speed) => speed);
      const activeIndex = scrollSpeedsArray.findIndex((src) => src === scrollSpeed);

      if (change === 'faster' && activeIndex < Object.keys(SCROLL_SPEEDS).length - 1) {
        setScrollSpeed(scrollSpeedsArray[activeIndex + 1]);
      }

      if (change === 'slower' && activeIndex > 0) {
        setScrollSpeed(scrollSpeedsArray[activeIndex - 1]);
      }
    },
    [scrollSpeed]
  );

  // handle keyboard shortcut features
  const onKeyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Escape':
          setIsScroll(false);
          break;
        case 'KeyS':
          setIsScroll(!isScroll);
          break;
        case 'KeyD':
          isScroll && changeScrollSpeed('faster');
          break;
        case 'KeyA':
          isScroll && changeScrollSpeed('slower');
          break;
      }
    },
    [isScroll, setIsScroll, changeScrollSpeed]
  );

  // attach keyboard auto scroll menu
  useEffect(() => {
    window.addEventListener('keydown', onKeyDownHandler);

    return () => {
      window.removeEventListener('keydown', onKeyDownHandler);
    };
  }, [onKeyDownHandler]);

  const ScrollSpeedBtn = ({ speed }: { speed: ScrollSpeed }) => {
    const isActive = scrollSpeed.px === SCROLL_SPEEDS[speed].px;
    return (
      <button
        type="button"
        className={isActive ? styles.active : ''}
        onClick={() => setScrollSpeed(SCROLL_SPEEDS[speed])}
        tabIndex={isOverlayOpen ? -1 : undefined}
      >
        {speed === 'vs' && (isActive ? <IconSlowFilled /> : <IconSlow />)}
        {speed === 'vf' && (isActive ? <IconFastFilled /> : <IconFast />)}
        {speed !== 'vs' && speed !== 'vf' && (isActive ? <IconRadioChecked /> : <IconRadioUnchecked />)}
      </button>
    );
  };

  return (
    <div className={styles.autoScrollMenu} ref={scrollMenuRef}>
      <button
        type="button"
        className={styles.scrollBtn}
        onClick={() => setIsScroll(!isScroll)}
        tabIndex={isOverlayOpen ? -1 : 1}
      >
        {isScroll ? <IconClose /> : <IconArrowDown />}
      </button>

      <div className={`${styles.scrollSpeed} ${!isScroll || !showScrollSpeed ? styles.scrollSpeedCollapsed : ''}`}>
        {map(SCROLL_SPEEDS, (_, key: ScrollSpeed) => (
          <ScrollSpeedBtn key={key} speed={key} />
        ))}
      </div>
    </div>
  );
};

export default AutoScrollMenu;
