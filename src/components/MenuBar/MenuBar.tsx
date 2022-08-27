import { useState } from 'react';

import AutoScrollMenu, { AutoScrollMenuProps } from '../AutoScrollMenu/AutoScrollMenu';
import FileSelectMenu from '../FileSelectMenu/FileSelectMenu';
import styles from './MenuBar.module.scss';

export type SelectedActiveMenu = 'scroll' | 'fileSelect' | null;

interface MenuBarProps {
  autoScrollMenuProps: Pick<AutoScrollMenuProps, 'isScroll' | 'setIsScroll' | 'isOverlayOpen'>;
}
const MenuBar: React.FC<MenuBarProps> = ({ autoScrollMenuProps }) => {
  const [activeMenu, setActiveMenu] = useState<SelectedActiveMenu>(null);

  return (
    <div className={styles.menuBar}>
      <div className={styles.item}>
        <AutoScrollMenu {...autoScrollMenuProps} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>
      <div className={styles.item}>
        <FileSelectMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>
      {/* <div className={styles.item}>Upload Menu</div> */}
    </div>
  );
};

export default MenuBar;
