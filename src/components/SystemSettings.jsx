import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Bell, ShieldCheck, Database, Globe, Clock, Zap } from 'lucide-react'
import API_BASE_URL from '../api'

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    pointsExact: '3',
    pointsWinner: '2',
    pointsDraw: '1',
    pointsChampion: '10',
    maintenanceMode: 'false',
    globalAnnouncement: '¡Bienvenidos a la Polla Pro 2026!',
    registrationOpen: 'true'
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }))
        }
      })
      .catch(err => console.error("Error loading settings:", err))
  }, [])

  const handleSave = () => {
    setSaving(true)
    fetch(`${API_BASE_URL}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    .then(() => {
      setSaving(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    })
    .catch(err => {
      console.error("Error saving settings:", err)
      setSaving(false)
    })
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black">Configuración del <span className="text-cup-gold">Sistema</span></h2>
          <p className="text-gray-500">Control global de la plataforma y reglas del juego.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-cup-gold text-black px-6 py-3 rounded-xl font-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl flex items-center gap-3 font-bold"
        >
          <Zap size={18} /> Configuración actualizada correctamente.
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rules Section */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
            <ShieldCheck className="text-cup-gold" size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm">Reglas de Puntuación</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Marcador Exacto</p>
                <p className="text-[10px] text-gray-500">Acierto total de goles</p>
              </div>
              <input 
                type="number" 
                value={settings.pointsExact}
                onChange={(e) => setSettings({...settings, pointsExact: e.target.value})}
                className="w-14 bg-white/5 border border-white/10 rounded-lg py-1.5 text-center font-black focus:border-cup-gold outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Ganador</p>
                <p className="text-[10px] text-gray-500">Acierto de tendencia (Victoria)</p>
              </div>
              <input 
                type="number" 
                value={settings.pointsWinner}
                onChange={(e) => setSettings({...settings, pointsWinner: e.target.value})}
                className="w-14 bg-white/5 border border-white/10 rounded-lg py-1.5 text-center font-black focus:border-cup-gold outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">Empate</p>
                <p className="text-[10px] text-gray-500">Acierto de tendencia (Igualdad)</p>
              </div>
              <input 
                type="number" 
                value={settings.pointsDraw}
                onChange={(e) => setSettings({...settings, pointsDraw: e.target.value})}
                className="w-14 bg-white/5 border border-white/10 rounded-lg py-1.5 text-center font-black focus:border-cup-gold outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <p className="font-bold text-sm text-cup-cyan">Campeón Final</p>
                <p className="text-[10px] text-gray-500">Acierto del equipo campeón</p>
              </div>
              <input 
                type="number" 
                value={settings.pointsChampion}
                onChange={(e) => setSettings({...settings, pointsChampion: e.target.value})}
                className="w-14 bg-cup-cyan/10 border border-cup-cyan/30 text-cup-cyan rounded-lg py-1.5 text-center font-black focus:border-cup-cyan outline-none"
              />
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
            <Database className="text-cup-cyan" size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm">Estado de la Plataforma</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Inscripciones Abiertas</p>
                <p className="text-xs text-gray-500">Permitir nuevos registros de usuarios</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, registrationOpen: settings.registrationOpen === 'true' ? 'false' : 'true'})}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.registrationOpen === 'true' ? 'bg-green-500' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.registrationOpen === 'true' ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Modo Mantenimiento</p>
                <p className="text-xs text-gray-500">Desactivar acceso público temporalmente</p>
              </div>
              <button 
                onClick={() => setSettings({...settings, maintenanceMode: settings.maintenanceMode === 'true' ? 'false' : 'true'})}
                className={`w-12 h-6 rounded-full relative transition-colors ${settings.maintenanceMode === 'true' ? 'bg-red-500' : 'bg-gray-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode === 'true' ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Announcement Section */}
        <div className="glass-card p-8 col-span-full space-y-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
            <Bell className="text-yellow-500" size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm">Anuncio Global</h3>
          </div>
          <textarea 
            value={settings.globalAnnouncement}
            onChange={(e) => setSettings({...settings, globalAnnouncement: e.target.value})}
            placeholder="Escribe un mensaje para todos los usuarios..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 min-h-[100px] focus:border-cup-gold outline-none transition-all"
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-full">
          {[
            { label: 'Uptime', value: '99.9%', icon: Clock, color: 'text-green-500' },
            { label: 'Región', value: 'Global / AWS', icon: Globe, color: 'text-blue-500' },
            { label: 'Versión', value: 'v2.0.4-stable', icon: Zap, color: 'text-cup-gold' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-6 flex items-center gap-4">
              <div className={`p-3 bg-white/5 rounded-xl ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500">{item.label}</p>
                <p className="text-lg font-black">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SystemSettings
