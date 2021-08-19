import { useState, useEffect, Dispatch, SetStateAction, KeyboardEvent } from 'react';

import { isImage, isVideo } from 'src/utils';
import Spinner from 'src/components/Spinner/Spinner';
import IconLaunch from 'src/components/icons/IconLaunch';
import IconClose from 'src/components/icons/IconClose';
import styles from './MediaOverlayContainer.module.scss';

// TODO: Prevent refetch of cached image as overlay is a new <img>

interface MediaContainerProps {
  src: string;
  wasScroll: boolean;
  setWasScroll: Dispatch<SetStateAction<boolean>>;
  setIsScroll: Dispatch<SetStateAction<boolean>>;
  setActiveOverlayMediaSrc: Dispatch<SetStateAction<string | null>>;
  setMedia: (media: 'left' | 'right') => void;
}
const MediaContainer = ({
  src,
  wasScroll,
  setWasScroll,
  setIsScroll,
  setActiveOverlayMediaSrc,
  setMedia
}: MediaContainerProps) => {
  const [loading, setLoading] = useState(true);

  // handle close overlay and re-enable scroll if previously scrolling
  const closeOverlay = () => {
    if (wasScroll) {
      setWasScroll(false);
      setIsScroll(true);
    }

    setActiveOverlayMediaSrc(null);
  };

  // attach keyboard controls to overlay
  useEffect(() => {
    const onKeyDownHandler = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          setMedia('left');
          break;
        case 'ArrowRight':
          setMedia('right');
          break;
        case 'Escape':
          closeOverlay();
          break;
      }
    };

    // @ts-ignore
    window.addEventListener('keydown', onKeyDownHandler);

    return () => {
      // @ts-ignore
      window.removeEventListener('keydown', onKeyDownHandler);
    };
  }, []);

  return (
    <div className={styles.mediaOverlayContainer} onClick={closeOverlay}>
      <div className={styles.mediaWrapper}>
        {isImage(src) && (
          <img
            style={loading ? { display: 'none' } : {}}
            onLoad={() => setLoading(false)}
            alt={src}
            src={src}
            className={styles.media}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {isVideo(src) && (
          <video
            className={styles.media}
            style={loading ? { display: 'none' } : {}}
            onLoadedData={() => setLoading(false)}
            onClick={(e) => e.stopPropagation()}
            preload="metadata"
            autoPlay
            muted
            loop
            controls
            playsInline
          >
            <source src={src} type="video/mp4" />
          </video>
        )}

        {loading && <Spinner />}

        {!loading && (
          <>
            <button className={styles.closeBtn} onClick={closeOverlay} tabIndex={1}>
              <IconClose />
            </button>

            <button
              className={styles.openNewTabBtn}
              onClick={(e) => {
                e.stopPropagation();
                window.open(src, '_blank');
              }}
              tabIndex={2}
            >
              <IconLaunch />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaContainer;
