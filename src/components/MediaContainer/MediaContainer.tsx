import { useState } from 'react';

import { isImage, isVideo } from 'src/utils';
import Spinner from 'src/components/Spinner/Spinner';
import styles from './MediaContainer.module.scss';

interface MediaContainerProps {
  src: string;
}
const MediaContainer = ({ src }: MediaContainerProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={styles.mediaContainer}>
      {isImage(src) && (
        <img
          style={loading ? { display: 'none' } : {}}
          onLoad={() => setLoading(false)}
          alt={src}
          src={src}
          className={styles.media}
          data-testid="img"
        />
      )}

      {isVideo(src) && (
        <video
          className={styles.media}
          style={loading ? { display: 'none' } : {}}
          onLoadedData={() => setLoading(false)}
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
          data-testid="video"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {loading && <Spinner color="white" />}
    </div>
  );
};

export default MediaContainer;
