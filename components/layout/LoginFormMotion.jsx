import { motion } from "framer-motion";
import PasswordInputWithToggle from "../auth/PasswordInputWithToggle";
import { Mail } from "lucide-react";

export default function LoginFormMotion({ error, handleLogin, loginFormData, setLoginFormData, loading ,cardVariants }) {
  return (
    <motion.div  key="login" className="absolute cursor-grab inset-0 p-8 grid content-start justify-items-center rounded-xl bg-white/1 backdrop-blur-sm shadow-lg border border-white/20" variants={cardVariants} initial="inactive" animate="active" exit="inactive" drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.1} style={{ zIndex: 10 }}>
        <article className="text-center mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-sm">Sign in to your account</p>
        </article>
        {error &&(<span className="w-full text-center text-red-700 text-sm">{error}</span>)}
        <form onSubmit={handleLogin} className="w-full space-y-5" noValidate>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email or Username</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input  type="text"  placeholder="Enter your email or username"  autoComplete="username" value={loginFormData.usernameOrEmail} onChange={(e) => setLoginFormData({ ...loginFormData, usernameOrEmail: e.target.value })} className="w-full bg-gray-50/80 h-12 pl-10 pr-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-500 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200" required />
            </div>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <PasswordInputWithToggle password={loginFormData.password} onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })} placeholder="Enter your password" autoComplete="current-password"/>
            </div>
            <button  type="submit"  disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center">{loading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Signing In...</>) : ('Sign In')}</button>
        </form>
    </motion.div>
  );
}
