import {useState} from "react";

export const getLocalDataFromKey = (key: string) => JSON.parse(localStorage.getItem(key));
export const setLocalDataFromKey = (key: string, value) => localStorage.setItem(key, JSON.stringify(value));
export const useLocalStorage = <T = any>(key: string, defaultValue: T) => {

    const [state, updateState] = useState<T>(getLocalDataFromKey(key) ?? defaultValue);

    const update = (value: T) => {
        setLocalDataFromKey(key, value)
        updateState(value);
    };

    return [state, update] as const
};
