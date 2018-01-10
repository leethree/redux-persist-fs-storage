/* @flow */
import fs from 'react-native-fs';

export const DocumentDir = fs.DocumentDirectoryPath;
export const CacheDir = fs.CachesDirectoryPath;

const resolvePath = (...paths: Array<string>) =>
  '/' +
  paths
    .join('/')
    .split('/')
    .filter(part => part && part !== '.')
    .join('/');

// Wrap function to support both Promise and callback
async function withCallback<R>(
  callback?: ?(error: ?Error, result: R | void) => void,
  func: () => Promise<R>,
): Promise<R | void> {
  try {
    const result = await func();
    if (callback) {
      callback(null, result);
    }
    return result;
  } catch (err) {
    if (callback) {
      callback(err);
    } else {
      throw err;
    }
  }
}

const FSStorage = (
  location?: string = DocumentDir,
  folder?: string = 'reduxPersist',
) => {
  const baseFolder = resolvePath(location, folder);

  const pathForKey = (key: string) =>
    resolvePath(baseFolder, encodeURIComponent(key));

  const setItem = (
    key: string,
    value: string,
    callback?: ?(error: ?Error) => void,
  ): Promise<void> =>
    withCallback(callback, async () => {
      await fs.mkdir(baseFolder);
      await fs.writeFile(pathForKey(key), value, 'utf8');
    });

  const getItem = (
    key: string,
    callback?: ?(error: ?Error, result: ?string) => void,
  ): Promise<?string> =>
    withCallback(callback, async () => {
      if (await fs.exists(pathForKey(key))) {
        const data = await fs.readFile(pathForKey(key), 'utf8');
        return data;
      }
    });

  const removeItem = (
    key: string,
    callback?: ?(error: ?Error) => void,
  ): Promise<void> =>
    withCallback(callback, async () => {
      if (await fs.exists(pathForKey(key))) {
        await fs.unlink(pathForKey(key));
      }
    });

  const getAllKeys = (
    callback?: ?(error: ?Error, keys: ?Array<string>) => void,
  ) =>
    withCallback(callback, async () => {
      await fs.mkdir(baseFolder);
      const files = await fs.readDir(baseFolder);
      const fileNames = files
        .filter(file => file.isFile())
        .map(file => decodeURIComponent(file.name));
      return fileNames;
    });

  return {
    setItem,
    getItem,
    removeItem,
    getAllKeys,
  };
};

export default FSStorage;
