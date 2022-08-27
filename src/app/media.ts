import { importAllFiles } from 'src/utils';

const folder1: Record<string, string> = importAllFiles(
  require.context('../../media/folder1', false, /\.(gif|png|jpe?g|svg|mp4)$/i)
);
const folder2: Record<string, string> = importAllFiles(
  require.context('../../media/folder2', false, /\.(gif|png|jpe?g|svg|mp4)$/i)
);
const folder3: Record<string, string> = importAllFiles(
  require.context('../../media/folder3', false, /\.(gif|png|jpe?g|svg|mp4)$/i)
);

export const importedMediaMap = {
  folder1,
  folder2,
  folder3
};
