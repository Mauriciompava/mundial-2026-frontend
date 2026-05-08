import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, ShieldCheck, ArrowRight, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'

const AdminLogin = ({ onLogin, onBack }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // In a real app, this would be a backend call to /api/auth/login
    // For this demonstration, we'll simulate a secure check
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin2026') {
        onLogin(true)
      } else {
        setError('Credenciales de administrador inválidas.')
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cup-navy px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cup-gold/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cup-cyan/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-10 relative z-10 border-white/5"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-cup-gold/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <ShieldCheck className="text-cup-gold" size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">ADMIN <span className="text-cup-gold">PORTAL</span></h1>
          <p className="text-gray-500 text-sm">Ingresa tus credenciales para gestionar la polla.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">Usuario Admin</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cup-gold transition-colors" size={20} />
              <input 
                type="text" 
                required
                placeholder="Usuario maestro"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-cup-gold/50 focus:ring-1 focus:ring-cup-gold/50 outline-none transition-all placeholder:text-gray-700 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cup-gold transition-colors" size={20} />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-cup-gold/50 focus:ring-1 focus:ring-cup-gold/50 outline-none transition-all placeholder:text-gray-700"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm font-bold"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <div className="flex flex-col gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cup-gold to-yellow-500 text-black font-black py-4 rounded-xl hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Acceder al Panel
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={onBack}
              className="w-full bg-white/5 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group border border-white/10"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform text-gray-400" size={20} />
              Volver al Inicio
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-600 text-xs italic">
            Este acceso está restringido únicamente a personal autorizado del Mundial 2026.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
