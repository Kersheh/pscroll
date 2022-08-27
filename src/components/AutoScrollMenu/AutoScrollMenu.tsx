import { useState, useEffect, useRef, Dispatch, SetStateAction, useCallback } from 'react';
import { map } from 'lodash';

import { SCROLL_SPEEDS } from 'src/utils/constants';
import { setLocalStorage, getLocalStorage } from 'src/utils';
import IconArrowDown from 'src/components/icons/IconArrowDown';
import IconClose from 'src/components/icons/IconClose';
import IconSlow from 'src/components/icons/IconSlow';
import IconSlowFilled from 'src/components/icons/IconSlowFilled';
import IconFast from 'src/components/icons/IconFast';
import IconFastFilled from 'src/components/icons/IconFastFilled';
import IconRadioUnchecked from 'src/components/icons/IconRadioUnchecked';
import IconRadioChecked from 'src/components/icons/IconRadioChecked';
import styles from './AutoScrollMenu.module.scss';
import { SelectedActiveMenu } from '../MenuBar/MenuBar';

type ScrollSpeed = keyof typeof SCROLL_SPEEDS;

export interface AutoScrollMenuProps {
  isScroll: boolean;
  setIsScroll: Dispatch<SetStateAction<boolean>>;
  isOverlayOpen: boolean;
  activeMenu: SelectedActiveMenu;
  setActiveMenu: Dispatch<SetStateAction<SelectedActiveMenu>>;
}
const AutoScrollMenu = ({ isScroll, setIsScroll, isOverlayOpen, activeMenu, setActiveMenu }: AutoScrollMenuProps) => {
  const scrollMenuRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed, setScrollSpeed] = useState(getLocalStorage('scrollSpeed') ?? SCROLL_SPEEDS.m);
  const [showScrollSpeed, setShowScrollSpeed] = useState(false);

  // save set scroll speed to local storage
  useEffect(() => {
    setLocalStorage('scrollSpeed', scrollSpeed);
  }, [scrollSpeed]);

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
      const activeIndex = scrollSpeedsArray.findIndex((src) => src.px === scrollSpeed.px);

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

  useEffect(() => {
    if (activeMenu !== 'scroll') {
      setShowScrollSpeed(false);
    }
  }, [activeMenu]);

  const ScrollSpeedBtn = ({ speed }: { speed: ScrollSpeed }) => {
    const isActive = scrollSpeed.px === SCROLL_SPEEDS[speed].px;
    return (
      <button
        type="button"
        className={isActive ? styles.active : ''}
        onClick={() => {
          setScrollSpeed(SCROLL_SPEEDS[speed]);
          setShowScrollSpeed(false);
        }}
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
        onClick={() => {
          setIsScroll(!isScroll);
          setShowScrollSpeed(!isScroll);

          if (!isScroll) {
            setActiveMenu('scroll');
          } else {
            setActiveMenu(null);
          }
        }}
        tabIndex={isOverlayOpen ? -1 : 1}
      >
        {isScroll ? <IconClose /> : <IconArrowDown />}
      </button>

      {activeMenu === 'scroll' && (
        <div className={`${styles.scrollSpeed} ${!isScroll || !showScrollSpeed ? styles.scrollSpeedCollapsed : ''}`}>
          {map(SCROLL_SPEEDS, (_, key: ScrollSpeed) => (
            <ScrollSpeedBtn key={key} speed={key} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoScrollMenu;
