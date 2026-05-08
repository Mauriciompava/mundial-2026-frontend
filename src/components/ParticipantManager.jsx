import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Mail, User, Phone, Lock, CheckCircle2, AlertCircle, Loader2, Edit2, Trash2, X, Save } from 'lucide-react'
import API_BASE_URL from '../api'

const ParticipantManager = ({ onParticipantAdded }) => {
  const [participants, setParticipants] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    entryFee: 20000
  })
  const [status, setStatus] = useState('idle') 
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchParticipants()
  }, [])

  const fetchParticipants = async () => {
    setLoadingList(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`)
      const data = await response.json()
      setParticipants(data)
    } catch (error) {
      console.error("Error fetching participants:", error)
    } finally {
      setLoadingList(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    
    const url = editingUser 
      ? `${API_BASE_URL}/api/users/${editingUser.id}`
      : `${API_BASE_URL}/api/users/register`
    
    const method = editingUser ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('success')
        setMessage(editingUser ? '¡Participante actualizado!' : '¡Participante registrado!')
        setFormData({ username: '', email: '', password: '', entryFee: 20000 })
        setEditingUser(null)
        fetchParticipants()
        if (onParticipantAdded) onParticipantAdded()
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setMessage('Error en la operación. Verifica los datos.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Error de conexión con el servidor.')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      entryFee: user.entryFee || 20000
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar a este participante?')) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchParticipants()
        if (onParticipantAdded) onParticipantAdded()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setFormData({ username: '', email: '', password: '', entryFee: 20000 })
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Form Section */}
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cup-gold/10 blur-3xl -mr-16 -mt-16 rounded-full" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cup-gold/20 rounded-xl">
                {editingUser ? <Edit2 className="text-cup-gold" size={24} /> : <UserPlus className="text-cup-gold" size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-black">{editingUser ? 'Editar Participante' : 'Nuevo Participante'}</h2>
                <p className="text-gray-400 text-sm">Gestiona los integrantes de la polla mundialista.</p>
              </div>
            </div>
            {editingUser && (
              <button 
                onClick={cancelEdit}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Nombre de Usuario</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="juan_p26"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-cup-gold/50 focus:ring-1 focus:ring-cup-gold/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-cup-gold/50 focus:ring-1 focus:ring-cup-gold/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500 tracking-widest ml-1">
                {editingUser ? 'Contraseña (opcional)' : 'Contraseña'}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  name="password"
                  required={!editingUser}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-cup-gold/50 focus:ring-1 focus:ring-cup-gold/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-cup-cyan tracking-widest ml-1">Aporte Inicial (COP)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cup-cyan font-bold">$</span>
                <input
                  type="number"
                  name="entryFee"
                  required
                  placeholder="20000"
                  value={formData.entryFee}
                  onChange={handleChange}
                  className="w-full bg-cup-cyan/5 border border-cup-cyan/20 rounded-xl py-3 pl-12 pr-4 focus:border-cup-cyan outline-none transition-all font-bold text-cup-cyan"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-cup-gold to-yellow-500 text-black font-black py-4 rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <Loader2 className="animate-spin" size={20} />
              ) : editingUser ? (
                <><Save size={20} /> Guardar Cambios</>
              ) : (
                <><UserPlus size={20} /> Registrar Participante</>
              )}
            </button>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-bold">{message}</span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle size={20} />
                  <span className="text-sm font-bold">{message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>

      {/* List Section */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <User className="text-cup-cyan" /> Listado Maestros
          </h3>
          <span className="bg-white/5 px-4 py-1 rounded-full text-xs font-bold text-gray-400">
            {participants.length} integrantes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {loadingList ? (
              <div className="col-span-full py-20 text-center">
                <Loader2 className="animate-spin mx-auto text-cup-gold" size={40} />
                <p className="text-gray-500 mt-4 font-bold">Cargando base de datos...</p>
              </div>
            ) : participants.map((user) => (
              <motion.div 
                key={user.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-5 border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-black text-lg border border-white/10">
                    {user.username ? user.username.substring(0, 2).toUpperCase() : '??'}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="p-2 bg-cup-gold/10 text-cup-gold rounded-lg hover:bg-cup-gold hover:text-black transition-all"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h4 className="font-bold text-lg truncate">{user.username}</h4>
                <p className="text-xs text-gray-500 mb-4 font-mono">ID: #{user.id}</p>
                
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Mail size={14} /> <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-cup-cyan bg-cup-cyan/10 px-2 py-1 rounded">
                    <span>Aporte Polla</span>
                    <span>${(user.entryFee || 0).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ParticipantManager
