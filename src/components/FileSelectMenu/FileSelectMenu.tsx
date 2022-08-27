import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/store/store';
import { SelectedActiveMenu } from '../MenuBar/MenuBar';
import styles from './FileSelectMenu.module.scss';
import { selectFolderAction } from './sliceReducer';

interface FileSelectProps {
  activeMenu: SelectedActiveMenu;
  setActiveMenu: Dispatch<SetStateAction<SelectedActiveMenu>>;
}
const FileSelect: React.FC<FileSelectProps> = ({ activeMenu, setActiveMenu }) => {
  const dispatch = useDispatch();
  const { selectedFolders, folderOptions } = useSelector((state: RootState) => state.fileSelect);
  const [isFileSelectMenuOpen, setIsFileSelectMenuOpen] = useState(false);

  useEffect(() => {
    if (activeMenu !== 'fileSelect') {
      setIsFileSelectMenuOpen(false);
    }
  }, [activeMenu]);

  return (
    <div className={styles.fileSelectMenu}>
      <button
        type="button"
        className={styles.fileSelectMenuBtn}
        onClick={() => {
          setIsFileSelectMenuOpen(!isFileSelectMenuOpen);

          if (!isFileSelectMenuOpen) {
            setActiveMenu('fileSelect');
          } else {
            setActiveMenu(null);
          }
        }}
      >
        Select
      </button>

      {activeMenu === 'fileSelect' && (
        <div className={styles.fileSelectDrawer}>
          <h4>Select Menu</h4>
          <div className={styles.folderOptions}>
            {folderOptions.map((opt) => (
              <div className={styles.option} key={opt}>
                <input
                  type="checkbox"
                  id={opt}
                  value={opt}
                  checked={selectedFolders.includes(opt)}
                  // @ts-ignore
                  onClick={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(
                      selectFolderAction(
                        selectedFolders.includes(e.target.value)
                          ? selectedFolders.filter((i) => i !== e.target.value)
                          : [...selectedFolders, e.target.value]
                      )
                    );
                  }}
                />
                <label htmlFor={opt}>{opt}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSelect;
