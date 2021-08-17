import { useEffect, useState, useMemo } from 'react';
import { shuffle, fill } from 'lodash';
import useBreakpoint from 'use-breakpoint';

import { importAllFiles, isImage, isVideo } from 'src/utils';
import { ReactComponent as ArrowDownIcon } from 'src/styles/icons/arrow-down.svg';
import { ReactComponent as CloseIcon } from 'src/styles/icons/close.svg';
import { ReactComponent as LaunchIcon } from 'src/styles/icons/launch.svg';
import styles from './App.module.scss';

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
  const [activeOverlayMedia, setActiveOverlayMedia] = useState<string | null>(null);

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

  // handle close overlay and re-enable scroll if previously scrolling
  const closeOverlay = () => {
    if (wasScroll) {
      setWasScroll(false);
      setIsScroll(true);
    }

    setActiveOverlayMedia(null);
  };

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

                      setActiveOverlayMedia(mediaSrc);
                    }}
                  >
                    {isImage(mediaSrc) && <img alt={mediaSrc} src={mediaSrc} className={styles.media} />}

                    {isVideo(mediaSrc) && (
                      <video className={styles.media} preload="metadata" autoPlay muted loop>
                        <source src={mediaSrc} type="video/mp4" />
                      </video>
                    )}
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

      {activeOverlayMedia && (
        <div className={styles.overlay} onClick={closeOverlay}>
          <div className={styles.mediaWrapper}>
            {isImage(activeOverlayMedia) && (
              <img
                alt={activeOverlayMedia}
                src={activeOverlayMedia}
                className={styles.media}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {isVideo(activeOverlayMedia) && (
              <video
                className={styles.media}
                onClick={(e) => e.stopPropagation()}
                preload="metadata"
                autoPlay
                muted
                loop
                controls
              >
                <source src={activeOverlayMedia} type="video/mp4" />
              </video>
            )}

            <button className={styles.closeBtn} onClick={closeOverlay}>
              <CloseIcon />
            </button>

            <button
              className={styles.openNewTabBtn}
              onClick={(e) => {
                e.stopPropagation();
                window.open(activeOverlayMedia, '_blank');
              }}
            >
              <LaunchIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
