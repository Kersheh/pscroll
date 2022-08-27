// map imported require.context files to key-value map of file name and webpack file path
export function importAllFiles(r: __WebpackModuleApi.RequireContext) {
  return r.keys().reduce((acc, val) => ({ ...acc, [val.replace('./', '')]: r(val).default }), {});
}

export const requireContextMediaDefaults: [boolean, RegExp] = [false, /\.(gif|png|jpe?g|svg|mp4)$/i];

// validate if filename is a supported image type
export const isImage = (file: string) => /\.(gif|png|jpe?g|svg)$/i.test(file);

// validate if filename is a supported video type
export const isVideo = (file: string) => /\.(mp4)$/i.test(file);

// save to local storage
export const setLocalStorage = (key: string, props = {}) => {
  localStorage.setItem('default', JSON.stringify({ [key]: props }));
};

// load from local storage
export const getLocalStorage = (key: string) => {
  return JSON.parse(localStorage.getItem('default') ?? '{}')[key];
};
