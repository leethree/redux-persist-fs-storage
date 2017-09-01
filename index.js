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

const noop = () => {};

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
  ) =>
    fs
      .mkdir(baseFolder)
      .then(() => fs.writeFile(pathForKey(key), value, 'utf8'))
      .then(callback || noop)
      .catch(callback || noop);

  const getItem = (
    key: string,
    callback?: ?(error: ?Error, result: ?string) => void,
  ) =>
    fs
      .exists(pathForKey(key))
      .then(exists => (exists ? fs.readFile(pathForKey(key), 'utf8') : null))
      .then(data => (callback ? callback(null, data) : noop()))
      .catch(callback || noop);

  const removeItem = (key: string, callback?: ?(error: ?Error) => void) =>
    fs
      .exists(pathForKey(key))
      .then(exists => (exists ? fs.unlink(pathForKey(key)) : null))
      .then(callback || noop)
      .catch(callback || noop);

  const getAllKeys = (
    callback?: ?(error: ?Error, keys: ?Array<string>) => void,
  ) =>
    fs
      .mkdir(baseFolder)
      .then(() => fs.readDir(baseFolder))
      .then(files =>
        files
          .filter(file => file.isFile())
          .map(file => decodeURIComponent(file.name)),
      )
      .then(files => callback && callback(null, files))
      .catch(callback || noop);

  return {
    setItem,
    getItem,
    removeItem,
    getAllKeys,
  };
};

export default FSStorage;
