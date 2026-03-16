import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'fitboss-local-storage',
  encryptionKey: 'fitboss-secure-key' // In prod, this should use react-native-keychain
});

export const getStorageData = <T>(key: string): T | null => {
  const value = storage.getString(key);
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  return null;
};

export const setStorageData = <T>(key: string, value: T): void => {
  storage.set(key, JSON.stringify(value));
};

export const removeStorageData = (key: string): void => {
  storage.delete(key);
};
