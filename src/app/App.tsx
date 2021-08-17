import { useEffect, useState, useMemo } from 'react';
import { shuffle, fill } from 'lodash';
import useBreakpoint from 'use-breakpoint';

import { importAllFiles } from 'src/utils';
import { ReactComponent as ArrowDownIcon } from 'src/styles/icons/arrow-down.svg';
import { ReactComponent as CloseIcon } from 'src/styles/icons/close.svg';
import MediaContainer from 'src/components/MediaContainer/MediaContainer';
import styles from './App.module.scss';
import MediaOverlayContainer from 'src/components/MediaOverlayContainer/MediaOverlayContainer';
import { useCallback } from 'react';

// import gallery of media directly from project; TODO: enable user to select folder from UI
const importedMedia: Record<string, string> = importAllFiles(
  require.context('../img', false, /\.(gif|png|jpe?g|svg|mp4)$/i)
);

const BREAKPOINTS = { sm: 0, md: 600, lg: 1280, xl: 1920 };
const BREAKPOINT_COLUMNS = { sm: 1, md: 2, lg: 3, xl: 4 };

const App = () => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'lg');
  const [mediaSrcs, setMediaSrcs] = useState<Array<string>>([]);
  const [isScroll, setIsScroll] = useState(false);
  const [wasScroll, setWasScroll] = useState(false);
  const [activeOverlayMediaSrc, setActiveOverlayMediaSrc] = useState<string | null>(null);

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

  // handle autoscroll; TODO: add more speed variations
  useEffect(() => {
    const appRef = document.getElementById('app');

    if (isScroll && appRef) {
      const interval = setInterval(() => {
        appRef.scrollBy({ top: 12, behavior: 'smooth' });
      }, 32);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isScroll]);

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

      <button type="button" className={styles.scroll} onClick={() => setIsScroll(!isScroll)}>
        {isScroll ? <CloseIcon /> : <ArrowDownIcon />}
      </button>

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
