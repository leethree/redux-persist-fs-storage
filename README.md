# Redux Persist FS Storage

[Redux Persist](https://github.com/rt2zz/redux-persist/) storage engine for React Native file system

Inspired by [redux-persist-filesystem-storage](https://github.com/robwalkerco/redux-persist-filesystem-storage), this module works as adapter between [react-native-fs](https://github.com/itinance/react-native-fs) and [redux-persist](https://github.com/rt2zz/redux-persist/). 

### Install

```
yarn add react-native-fs redux-persist-fs-storage
```

This will install `react-native-fs` as dependency. So make sure to link it natively:
```
react-native link react-native-fs
```

See `react-native-fs`'s [documentation](https://github.com/itinance/react-native-fs) for details.

### Usage

```js
import { persistStore } from 'redux-persist'
import FSStorage from 'redux-persist-fs-storage';

const persistor = persistStore(store, {storage: FSStorage()});
```

The default storage location is a folder called `reduxPersist` in the document directory for your app on the device. You can specify folder for persistor:

```js
import { persistStore } from 'redux-persist'
import FSStorage, { CacheDir } from 'redux-persist-fs-storage';

const cachePersistor = persistStore(store, {storage: FSStorage(CacheDir, 'myApp')});
```

This will create `myApp` folder in cache storage for iOS and Android devices. You may create multiple persistors on different directories.
