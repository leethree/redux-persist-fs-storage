/* @flow */
import fs from 'react-native-fs';

export const DocumentDir = fs.DocumentDirectoryPath;
export const CacheDir = fs.CachesDirectoryPath;

const resolvePath = (...paths: Array<string>) =>
  paths
    .join('/')
    .split('/')
    .filter(part => part && part !== '.')
    .join('/');

const FSStorage = (
  location?: string = DocumentDir,
  folder?: string = 'reduxPersist',
) => {
  const baseFolder = resolvePath(location, folder);

  const pathForKey = (key: string) =>
    resolvePath(baseFolder, encodeURIComponent(key));

  const setItem = async (
    key: string,
    value: string,
    callback?: ?(error: ?Error) => void,
  ): Promise<void> => {
    try {
      await fs.mkdir(baseFolder);
      await fs.writeFile(pathForKey(key), value, 'utf8');
      callback && callback();
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
    }
  };

  const getItem = async (
    key: string,
    callback?: ?(error: ?Error, result: ?string) => void,
  ): Promise<?string> => {
    try {
      if (await fs.exists(pathForKey(key))) {
        const data = await fs.readFile(pathForKey(key), 'utf8');
        callback && callback(null, data);
        return data;
      }
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
    }
  };

  const removeItem = async (
    key: string,
    callback?: ?(error: ?Error) => void,
  ): Promise<void> => {
    try {
      if (await fs.exists(pathForKey(key))) {
        await fs.unlink(pathForKey(key));
        callback && callback();
      }
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
    }
  };

  const getAllKeys = async (
    callback?: ?(error: ?Error, keys: ?Array<string>) => void,
  ) => {
    try {
      await fs.mkdir(baseFolder);
      const files = await fs.readDir(baseFolder);
      const fileNames = files
        .filter(file => file.isFile())
        .map(file => decodeURIComponent(file.name));
      callback && callback(null, fileNames);
      return fileNames;
    } catch (err) {
      if (callback) {
        callback(err);
      } else {
        throw err;
      }
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
    getAllKeys,
  };
};

export default FSStorage;
