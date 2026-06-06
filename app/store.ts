import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  VANT: 'vantYo',
  STOCK: 'stockYo',
  TRANZAKSYON: 'tranzaksyonYo',
};

export const saveData = async (
  key: string,
  data: any
) => {
  try {
    await AsyncStorage.setItem(
      key,
      JSON.stringify(data)
    );
  } catch (error) {
    console.log('Erè save:', error);
  }
};

export const loadData = async (
  key: string
) => {
  try {
    const data = await AsyncStorage.getItem(key);

    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log('Erè load:', error);
    return [];
  }
};