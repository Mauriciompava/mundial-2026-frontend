import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn, Loader2, AlertCircle, Trophy } from 'lucide-react'
import API_BASE_URL from '../api'

const UserLogin = ({ onLogin, onCancel }) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const user = await response.json()
        onLogin(user)
      } else {
        setError('Email o contraseña incorrectos.')
      }
    } catch (err) {
      setError('Error de conexión con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cup-gold/10 blur-3xl -mr-16 -mt-16 rounded-full" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cup-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cup-gold/30 shadow-lg shadow-cup-gold/10">
            <Trophy className="text-cup-gold" size={32} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">INGRESAR A MI POLLA</h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">Gestiona tus predicciones y mira tu puntaje.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-cup-gold outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:border-cup-gold outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm font-bold">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cup-gold to-yellow-500 text-black font-black py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={20} /> Ingresar Ahora</>}
            </button>
            
            <button 
              type="button"
              onClick={onCancel}
              className="text-gray-500 text-xs font-bold uppercase hover:text-white transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default UserLogin
