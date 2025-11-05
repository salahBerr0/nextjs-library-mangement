"use client";
import {createContext, useContext, useState, useEffect} from 'react';

const ThemeContext=createContext();

export function ThemeProvider({children}){
    const [isDarkMode, setIsDarkMode]=useState(true);
    useEffect(()=>{
        const savedTheme=localStorage.getItem('theme');
        if(savedTheme){setIsDarkMode(savedTheme ==='dark');}
    }, []);

    useEffect(()=>{
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleDarkMode=()=>{
        setIsDarkMode(!isDarkMode);
    };
    return(
        <ThemeContext.Provider value={{isDarkMode, toggleDarkMode, setIsDarkMode}}>
            {children}
        </ThemeContext.Provider>
    );
}
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
