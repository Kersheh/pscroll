import { useEffect, useState, useMemo, useCallback } from 'react';
import { shuffle, fill } from 'lodash';
import useBreakpoint from 'use-breakpoint';

import { importAllFiles } from 'src/utils';
import { BREAKPOINTS, BREAKPOINT_COLUMNS } from 'src/utils/constants';
import MediaContainer from 'src/components/MediaContainer/MediaContainer';
import styles from './App.module.scss';
import MediaOverlayContainer from 'src/components/MediaOverlayContainer/MediaOverlayContainer';
import AutoScrollMenu from 'src/components/AutoScrollMenu/AutoScrollMenu';

// import gallery of media directly from project; TODO: enable user to select folder from UI
const importedMedia: Record<string, string> = importAllFiles(
  require.context('../img', false, /\.(gif|png|jpe?g|svg|mp4)$/i)
);

const App = () => {
  const LOAD_MORE_THRESHOLD = 10;
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'lg');
  const [mediaSrcs, setMediaSrcs] = useState<Array<string>>([]);
  const [isScroll, setIsScroll] = useState(false);
  const [wasScroll, setWasScroll] = useState(false);
  const [activeOverlayMediaSrc, setActiveOverlayMediaSrc] = useState<string | null>(null);
  const [currentLoadThreshold, setCurrentLoadThreshold] = useState(LOAD_MORE_THRESHOLD);

  const columnCount = BREAKPOINT_COLUMNS[breakpoint] ?? 1;

  // set media srcs from imported media and randomize order
  useEffect(() => importedMedia && setMediaSrcs(shuffle(importedMedia)), []);

  // scroll to top on pageload in event client refreshes browser
  useEffect(() => {
    const handleUnload = () => window.scrollTo(0, 0);
    window.addEventListener('beforeunload', handleUnload);

    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // setup columns for UI
  const columns = useMemo(() => {
    const columns = fill(Array(columnCount), []);

    return columns.map((_, i) =>
      mediaSrcs
        .slice(0, currentLoadThreshold)
        .map((_, j: number) => {
          const splitIndex = j * columnCount + i;
          return mediaSrcs[splitIndex];
        })
        .filter((media) => !!media)
    );
  }, [mediaSrcs, columnCount, currentLoadThreshold]);

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

  // disable overflow scroll on body when overlay is open
  useEffect(() => {
    const bodyElement = document.getElementsByTagName('body')[0];

    if (activeOverlayMediaSrc) {
      // @ts-ignore
      bodyElement.style = 'overflow: hidden';
    } else {
      // @ts-ignore
      bodyElement.style = '';
    }
  }, [activeOverlayMediaSrc]);

  // dynamically increases total media load threshold per column at bottom of page
  const onScrollHandler = useCallback(() => {
    const OFFSET = 240;
    if (window.innerHeight + window.scrollY + OFFSET >= document.body.scrollHeight) {
      setCurrentLoadThreshold(currentLoadThreshold + LOAD_MORE_THRESHOLD);
    }
  }, [currentLoadThreshold]);

  // attaches threshold increase handler to document scroll
  useEffect(() => {
    document.addEventListener('scroll', onScrollHandler);

    return () => {
      document.removeEventListener('scroll', onScrollHandler);
    };
  }, [onScrollHandler]);

  return (
    <>
      <div className={styles.appContent}>
        {columns.map((column, i) => (
          <div key={`col-${i}`} className={styles.column}>
            {column.map((mediaSrc, j) => (
              <div key={mediaSrc} className={styles.mediaWrapper}>
                {mediaSrc && (
                  <button
                    tabIndex={!activeOverlayMediaSrc ? j * columnCount + i + 2 : -1}
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

      <AutoScrollMenu isScroll={isScroll} setIsScroll={setIsScroll} isOverlayOpen={!!activeOverlayMediaSrc} />

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
    </>
  );
};

export default App;
