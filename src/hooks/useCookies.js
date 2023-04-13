import React from "react";

export const useCookies = (keyName, defaultValue) => {
    const [storedValue, setStoredValue] = React.useState(() => {
        try {
            const value = window.Cookies.get(keyName);
            if (value) {
                return JSON.parse(value);
            } else {
            
                window.Cookies.set(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });
    
    const setValue = (newValue) => {
        try {
            window.Cookies.set(keyName, JSON.stringify(newValue));
        } catch (err) {}
            setStoredValue(newValue);
    };
    return [storedValue, setValue];
}