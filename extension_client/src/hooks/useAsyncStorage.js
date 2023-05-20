import { useEffect, useState } from 'react';
import browser from 'webextension-polyfill';

const useAsyncStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(initialValue);

    useEffect(() => {
        const fetchStoredValue = async () => {
            try {
                const result = await browser.storage.local.get(key);
                if (result[key] !== undefined) {
                    setStoredValue(result[key]);
                } else {
                    await browser.storage.local.set({ [key]: initialValue });
                    setStoredValue(initialValue);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchStoredValue();
    }, [key, initialValue]);

    const setValue = async (value) => {
        try {
            await browser.storage.local.set({ [key]: value });
            setStoredValue(value);
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export default useAsyncStorage;
