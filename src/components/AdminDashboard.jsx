import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, Trophy, Settings, LogOut, ShieldCheck, Database, ChevronRight, Home } from 'lucide-react'
import ParticipantManager from './ParticipantManager'
import TournamentSchedule from './TournamentSchedule'
import SystemSettings from './SystemSettings'
import API_BASE_URL from '../api'

const AdminDashboard = ({ onLogout }) => {
  const [activeView, setActiveView] = useState(localStorage.getItem('admin_active_view') || 'dashboard')
  const [stats, setStats] = useState({ users: 0, predictions: 0, income: 0 })

  useEffect(() => {
    localStorage.setItem('admin_active_view', activeView)
  }, [activeView])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const uRes = await fetch(`${API_BASE_URL}/api/stats/users`)
        const pRes = await fetch(`${API_BASE_URL}/api/stats/predictions`)
        const iRes = await fetch(`${API_BASE_URL}/api/stats/income`)
        const userCount = await uRes.json()
        const predCount = await pRes.json()
        const totalIncome = await iRes.json()
        
        setStats({
          users: userCount,
          predictions: predCount,
          income: totalIncome
        })
      } catch (err) {
        console.error("Error fetching stats:", err)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 10000) // Update every 10s
    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard, description: 'Resumen general' },
    { id: 'users', label: 'Participantes', icon: Users, description: 'CRUD de integrantes' },
    { id: 'matches', label: 'Resultados', icon: Trophy, description: 'Actualizar marcadores' },
    { id: 'system', label: 'Sistema', icon: Settings, description: 'Configuración global' },
  ]

  const getViewTitle = () => {
    return menuItems.find(item => item.id === activeView)?.label || 'Panel'
  }

  // Counter Component for Interactive Stats
  const AnimatedNumber = ({ value, prefix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0)
    
    useEffect(() => {
      let start = displayValue
      const end = parseInt(value)
      if (start === end) return
      
      const duration = 1000
      const range = end - start
      let startTime = null
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        setDisplayValue(Math.floor(progress * range + start))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, [value])
    
    return (
      <span className="inline-block tabular-nums font-mono tracking-tight">
        {prefix}{displayValue.toLocaleString()}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-cup-navy text-white flex overflow-hidden">
      {/* Sidebar ... */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-cup-gold" size={24} />
            <h1 className="font-black text-xl tracking-tighter">ADMIN <span className="text-cup-gold">PRO</span></h1>
          </div>
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Panel de Control Maestro</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group ${activeView === item.id ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-[1.02]' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <item.icon size={20} className={activeView === item.id ? 'text-black' : 'group-hover:text-white transition-colors'} />
              <div className="text-left">
                <p className="font-bold text-sm">{item.label}</p>
                <p className={`text-[10px] ${activeView === item.id ? 'text-gray-600' : 'text-gray-600 group-hover:text-gray-400'}`}>{item.description}</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center gap-3 p-3 text-gray-400 hover:text-white transition-all text-xs font-bold"
          >
            <Home size={16} /> Ver Aplicativo Público
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-sm shadow-lg shadow-red-500/5"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cup-gold/5 via-transparent to-transparent flex flex-col">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/10 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
              <button 
                onClick={() => setActiveView('dashboard')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <LayoutDashboard size={14} />
                Panel
              </button>
              <ChevronRight size={14} />
              <span className="text-cup-gold uppercase tracking-widest">{getViewTitle()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">DB: Online</span>
            </div>
            <div className="h-8 w-px bg-white/5" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold">Super Admin</p>
                <p className="text-[10px] text-gray-500 font-medium">Control Total</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-cup-gold to-yellow-600 rounded-xl flex items-center justify-center text-black font-black shadow-lg shadow-cup-gold/20">
                SA
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 flex-1">
          <AnimatePresence mode="wait">
            {activeView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Usuarios Activos', value: stats.users, delta: '+Real', icon: Users, color: 'text-blue-500' },
                    { label: 'Apuestas Realizadas', value: stats.predictions, delta: '+Real', icon: Trophy, color: 'text-cup-gold' },
                    { label: 'Ingresos Simulados', value: stats.income, delta: '+Real', icon: Database, color: 'text-green-500', prefix: '$' },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card p-8 border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <stat.icon size={80} />
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.label}</p>
                      <div className="flex items-end gap-4">
                        <h3 className="text-4xl font-black">
                          <AnimatedNumber value={stat.value} prefix={stat.prefix} />
                        </h3>
                        <span className={`text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-md mb-2`}>{stat.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card p-12 text-center border-dashed border-white/10">
                  <h3 className="text-2xl font-black mb-4">Bienvenido al Centro de Mando</h3>
                  <p className="text-gray-400 max-w-2xl mx-auto mb-8">Selecciona una opción en el menú lateral para comenzar a gestionar los participantes, los resultados del mundial o la configuración técnica del sistema.</p>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => setActiveView('users')} className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all">Gestionar Usuarios</button>
                    <button onClick={() => setActiveView('matches')} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all">Ver Fixture</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 transition-all">
                    <Home size={20} />
                  </button>
                  <h2 className="text-2xl font-black italic">GESTIÓN DE <span className="text-cup-gold">PARTICIPANTES</span></h2>
                </div>
                <ParticipantManager />
              </motion.div>
            )}

            {activeView === 'matches' && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="space-y-8">
                  <div className="glass-card p-8 bg-gradient-to-r from-cup-gold/10 to-transparent border-white/5 flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black mb-2">Gestión de Marcadores</h2>
                      <p className="text-gray-400">Actualiza los resultados oficiales para procesar los puntos automáticamente.</p>
                    </div>
                    <button 
                      onClick={() => setActiveView('dashboard')}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl font-bold transition-all"
                    >
                      <Home size={18} /> Volver al Inicio
                    </button>
                  </div>
                  <TournamentSchedule adminMode={true} />
                </div>
              </motion.div>
            )}

            {activeView === 'system' && (
              <motion.div
                key="system"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-end">
                  <button 
                    onClick={() => setActiveView('dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-xs font-bold"
                  >
                    <Home size={14} /> Volver al Menú Principal
                  </button>
                </div>
                <SystemSettings />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
