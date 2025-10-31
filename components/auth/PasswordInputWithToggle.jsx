import {Lock, Eye, EyeOff } from 'lucide-react';
import React, { useState, useCallback } from 'react';
export default function PasswordInputWithToggle ({ password, onChange, placeholder, autoComplete }) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = useCallback(() => {setShowPassword(prev => !prev);}, []);
  return (
    <div className="relative w-full">
      <input  type={showPassword ? "text" : "password"}  value={password}  onChange={onChange}  placeholder={placeholder}  autoComplete={autoComplete}  className="w-full bg-white/90 backdrop-blur-sm h-12 px-10 pr-12 py-3 rounded-xl text-indigo-900 placeholder:text-indigo-900/60 border border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200" required/>
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
      <button  type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-700 cursor-pointer transition-colors duration-200 p-1 rounded" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
    </div>
  );
};