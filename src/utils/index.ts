// map imported require.context files to key-value map of file name and webpack file path
export function importAllFiles(r: __WebpackModuleApi.RequireContext) {
  return r.keys().reduce((acc, val) => ({ ...acc, [val.replace('./', '')]: r(val).default }), {});
}

export const isImage = (file: string) => /\.(gif|png|jpe?g|svg)$/i.test(file);
export const isVideo = (file: string) => /\.(mp4)$/i.test(file);
