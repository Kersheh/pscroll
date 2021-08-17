import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { shuffle, fill } from 'lodash';
import useBreakpoint from 'use-breakpoint';

import { importAllFiles } from 'src/utils';
import { BREAKPOINTS, BREAKPOINT_COLUMNS, SCROLL_SPEEDS } from 'src/utils/constants';
import { ReactComponent as ArrowDownIcon } from 'src/styles/icons/arrow-down.svg';
import { ReactComponent as CloseIcon } from 'src/styles/icons/close.svg';
import MediaContainer from 'src/components/MediaContainer/MediaContainer';
import styles from './App.module.scss';
import MediaOverlayContainer from 'src/components/MediaOverlayContainer/MediaOverlayContainer';

// import gallery of media directly from project; TODO: enable user to select folder from UI
const importedMedia: Record<string, string> = importAllFiles(
  require.context('../img', false, /\.(gif|png|jpe?g|svg|mp4)$/i)
);

const App = () => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'lg');
  const [mediaSrcs, setMediaSrcs] = useState<Array<string>>([]);
  const [isScroll, setIsScroll] = useState(false);
  const [wasScroll, setWasScroll] = useState(false);
  const [activeOverlayMediaSrc, setActiveOverlayMediaSrc] = useState<string | null>(null);
  const [scrollSpeed, setScrollSpeed] = useState(SCROLL_SPEEDS.m);
  const [showScrollSpeed, setShowScrollSpeed] = useState(false);
  const scrollMenuRef = useRef<HTMLDivElement>(null);

  // set media srcs from imported media and randomize order
  useEffect(() => importedMedia && setMediaSrcs(shuffle(importedMedia)), []);

  // setup columns for UI; TODO: consider memoizing different breakpoints to prevent re-calc on repeated resize adjustment
  const columns = useMemo(() => {
    const columnCount = BREAKPOINT_COLUMNS[breakpoint] ?? 1;
    const columns = fill(Array(columnCount), []);

    return columns.map((_, i) =>
      mediaSrcs
        .map((_, j: number) => {
          const splitIndex = j * columnCount + i;
          return mediaSrcs[splitIndex];
        })
        .filter((media) => !!media)
    );
  }, [mediaSrcs, breakpoint]);

  // handle autoscroll based on active scroll speed when enabled
  useEffect(() => {
    const appRef = document.getElementById('app');

    if (isScroll && appRef) {
      const interval = setInterval(() => {
        appRef.scrollBy({ top: scrollSpeed.px, behavior: 'smooth' });
      }, scrollSpeed.t);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isScroll, scrollSpeed]);

  // set media to next/previous overlay option
  const changeOverlayMedia = useCallback(
    (direction: 'left' | 'right') => {
      const activeIndex = mediaSrcs.findIndex((src) => src === activeOverlayMediaSrc);

      if (direction === 'left' && activeIndex > 0) {
        setActiveOverlayMediaSrc(mediaSrcs[activeIndex - 1]);
      }

      if (direction === 'right' && activeIndex < mediaSrcs.length - 1) {
        setActiveOverlayMediaSrc(mediaSrcs[activeIndex + 1]);
      }
    },
    [activeOverlayMediaSrc]
  );

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

  return (
    <div id="app" className={styles.app}>
      <div className={styles.appWrapper}>
        {columns.map((column, i) => (
          <div key={i} className={styles.column}>
            {column.map((mediaSrc) => (
              <div key={mediaSrc} className={styles.mediaWrapper}>
                {mediaSrc && (
                  <button
                    className={styles.mediaBtn}
                    onClick={() => {
                      if (isScroll) {
                        setWasScroll(true);
                        setIsScroll(false);
                      }

                      setActiveOverlayMediaSrc(mediaSrc);
                    }}
                  >
                    <MediaContainer src={mediaSrc} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={scrollMenuRef}>
        <button type="button" className={styles.scrollBtn} onClick={() => setIsScroll(!isScroll)}>
          {isScroll ? <CloseIcon /> : <ArrowDownIcon />}
        </button>

        <div className={`${styles.scrollSpeed} ${!isScroll && !showScrollSpeed ? styles.scrollSpeedCollapsed : ''}`}>
          <button
            type="button"
            className={scrollSpeed.px === SCROLL_SPEEDS.vs.px ? styles.active : ''}
            onClick={() => setScrollSpeed(SCROLL_SPEEDS.vs)}
          >
            vs
          </button>
          <button
            type="button"
            className={scrollSpeed.px === SCROLL_SPEEDS.s.px ? styles.active : ''}
            onClick={() => setScrollSpeed(SCROLL_SPEEDS.s)}
          >
            s
          </button>
          <button
            type="button"
            className={scrollSpeed.px === SCROLL_SPEEDS.m.px ? styles.active : ''}
            onClick={() => setScrollSpeed(SCROLL_SPEEDS.m)}
          >
            m
          </button>
          <button
            type="button"
            className={scrollSpeed.px === SCROLL_SPEEDS.f.px ? styles.active : ''}
            onClick={() => setScrollSpeed(SCROLL_SPEEDS.f)}
          >
            f
          </button>
          <button
            type="button"
            className={scrollSpeed.px === SCROLL_SPEEDS.vf.px ? styles.active : ''}
            onClick={() => setScrollSpeed(SCROLL_SPEEDS.vf)}
          >
            vf
          </button>
        </div>
      </div>

      {activeOverlayMediaSrc && (
        <MediaOverlayContainer
          key={activeOverlayMediaSrc}
          src={activeOverlayMediaSrc}
          wasScroll={wasScroll}
          setWasScroll={setWasScroll}
          setIsScroll={setIsScroll}
          setActiveOverlayMediaSrc={setActiveOverlayMediaSrc}
          setMedia={changeOverlayMedia}
        />
      )}
    </div>
  );
};

export default App;
