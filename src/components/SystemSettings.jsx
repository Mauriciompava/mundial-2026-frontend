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
  const [seeding, setSeeding] = useState(false)
  const [success, setSuccess] = useState(false)
  const [seedMessage, setSeedMessage] = useState('')
  const [rawSql, setRawSql] = useState('')
  const [importing, setImporting] = useState(false)

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

  const handleSeed = () => {
    if (!window.confirm("¿Estás seguro? Esto cargará los equipos y partidos iniciales. Solo debes hacerlo una vez.")) return
    
    setSeeding(true)
    fetch(`${API_BASE_URL}/api/admin/seed`, { method: 'POST' })
      .then(res => res.text())
      .then(msg => {
        setSeedMessage(msg)
        setSeeding(false)
        setTimeout(() => setSeedMessage(''), 5000)
      })
      .catch(err => {
        console.error("Error seeding:", err)
        setSeeding(false)
        alert("Error al inicializar datos.")
      })
  }

  const handleRawSql = () => {
    if (!rawSql.trim()) return
    if (!window.confirm("¡CUIDADO! Esto modificará la base de datos directamente. ¿Deseas continuar?")) return
    
    setImporting(true)
    fetch(`${API_BASE_URL}/api/admin/seed-raw`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: rawSql
    })
      .then(res => res.text())
      .then(msg => {
        setSeedMessage(msg)
        setImporting(false)
        setRawSql('')
      })
      .catch(err => {
        console.error("Error importing SQL:", err)
        setImporting(false)
        alert("Error al importar SQL.")
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

      {seedMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cup-cyan/10 border border-cup-cyan/20 text-cup-cyan p-4 rounded-xl flex items-center gap-3 font-bold"
        >
          <Database size={18} /> {seedMessage}
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

            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={handleSeed}
                disabled={seeding}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-cup-cyan/20 border border-white/10 hover:border-cup-cyan/50 p-3 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
              >
                {seeding ? <RefreshCw className="animate-spin" size={14} /> : <Database size={14} />}
                {seeding ? 'Inicializando...' : 'Inicializar Mundial 2026'}
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
          {/* ... stats ... */}
        </div>

        {/* Master SQL Import Section */}
        <div className="glass-card p-8 col-span-full space-y-4 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
            <Database className="text-red-500" size={20} />
            <h3 className="font-bold uppercase tracking-widest text-sm text-red-500">Herramienta de Importación Maestra (SQL)</h3>
          </div>
          <p className="text-xs text-gray-500 mb-2">Pega aquí el contenido de tu archivo .sql para actualizar toda la base de datos de una vez.</p>
          <textarea 
            value={rawSql}
            onChange={(e) => setRawSql(e.target.value)}
            placeholder="Pega el contenido del script.sql aquí..."
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 min-h-[150px] font-mono text-xs focus:border-red-500 outline-none transition-all"
          />
          <button 
            onClick={handleRawSql}
            disabled={importing || !rawSql}
            className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 p-4 rounded-xl transition-all font-black uppercase tracking-widest disabled:opacity-30"
          >
            {importing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            {importing ? 'Ejecutando Script...' : 'Importar Base de Datos (Modo Dios)'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings
