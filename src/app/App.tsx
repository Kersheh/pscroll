import { useEffect, useState, useMemo } from 'react';
import { shuffle, fill } from 'lodash';
import useBreakpoint from 'use-breakpoint';

import { ReactComponent as ArrowDownIcon } from '../styles/icons/arrow-down.svg';
import { ReactComponent as CloseIcon } from '../styles/icons/close.svg';
import { ReactComponent as LaunchIcon } from '../styles/icons/launch.svg';
import styles from './App.module.scss';

// map imported require.context files to key-value map of file name and webpack file path
export function importAllFiles(r: __WebpackModuleApi.RequireContext) {
  return r.keys().reduce((acc, val) => ({ ...acc, [val.replace('./', '')]: r(val).default }), {});
}

// import gallery of images directly from project; TODO: enable user to select folder from UI
const importedImages: Record<string, string> = importAllFiles(
  require.context('../img', false, /\.(gif|png|jpe?g|svg)$/i)
);

const BREAKPOINTS = { sm: 0, md: 600, lg: 1280, xl: 1920 };

const App = () => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'lg');
  const [images, setImages] = useState<Array<string>>([]);
  const [isScroll, setIsScroll] = useState(false);
  const [wasScroll, setWasScroll] = useState(false);
  const [openImage, setOpenImage] = useState<string | null>(null);

  useEffect(() => importedImages && setImages(shuffle(importedImages)), []);

  // setup columns for UI; TODO: consider memoizing different breakpoints to prevent re-calc on repeated resize adjustment
  const columns = useMemo(() => {
    const columnCount = (() => {
      switch (breakpoint) {
        case 'xl':
          return 4;
        case 'lg':
          return 3;
        case 'md':
          return 2;
        case 'sm':
        default:
          return 1;
      }
    })();

    const columns = fill(Array(columnCount), []);

    if (images) {
      return columns.map((_, i) =>
        images
          .map((_, j: number) => {
            const splitIndex = j * columnCount + i;

            if (images[splitIndex]) {
              return images[splitIndex];
            } else {
              return null;
            }
          })
          .filter((image) => !!image)
      );
    } else {
      return columns;
    }
  }, [images, breakpoint]);

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

    setOpenImage(null);
  };

  return (
    <div id="app" className={styles.app}>
      <div className={styles.appWrapper}>
        {columns.length > 0 &&
          columns.map((column, i) => (
            <div key={i} className={styles.column}>
              {column.map((image) => (
                <div key={image} className={styles.imageWrapper}>
                  {image && (
                    <button
                      className={styles.imageBtn}
                      onClick={() => {
                        if (isScroll) {
                          setWasScroll(true);
                          setIsScroll(false);
                        }

                        setOpenImage(image);
                      }}
                    >
                      <img alt={image} src={image} className={styles.image} />
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

      {openImage && (
        <div className={styles.overlay} onClick={closeOverlay}>
          <div className={styles.imageWrapper}>
            <img
              key={openImage}
              alt={openImage}
              src={openImage}
              className={styles.image}
              onClick={(e) => e.stopPropagation()}
            />

            <button className={styles.closeBtn} onClick={closeOverlay}>
              <CloseIcon />
            </button>

            <button
              className={styles.openNewTabBtn}
              onClick={(e) => {
                e.stopPropagation();
                window.open(openImage, '_blank');
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
