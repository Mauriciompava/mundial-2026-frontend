import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import TournamentSchedule from './components/TournamentSchedule'
import Leaderboard from './components/Leaderboard'
import ChampionPicker from './components/ChampionPicker'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import UserLogin from './components/UserLogin'
import UserHistory from './components/UserHistory'
import PrizesAndRules from './components/PrizesAndRules'
import PaymentGateway from './components/PaymentGateway'
import { Trophy, Calendar, UserPlus, Settings, Users, ShieldAlert, History, ShieldCheck, CreditCard } from 'lucide-react'
import API_BASE_URL from './api'

function App() {
  const [appMode, setAppMode] = useState(localStorage.getItem('polla_app_mode') || 'public') 
  const [activeTab, setActiveTab] = useState('matches')
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('polla_user')) || null)
  const [showLogin, setShowLogin] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [publicStats, setPublicStats] = useState({ participants: 0, matches: 0, points: 0, finished: 0 })

  useEffect(() => {
    const handleSwitchTab = () => setActiveTab('payment');
    window.addEventListener('switch-to-payments', handleSwitchTab);
    return () => window.removeEventListener('switch-to-payments', handleSwitchTab);
  }, []);

  useEffect(() => {
    localStorage.setItem('polla_app_mode', appMode)
  }, [appMode])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('polla_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('polla_user')
    }
  }, [currentUser])

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const [u, m, p, f] = await Promise.all([
          fetch(`${API_BASE_URL}/api/stats/users`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/stats/matches-count`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/stats/total-points`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/stats/finished-matches`).then(r => r.json())
        ])
        setPublicStats({ participants: u, matches: m, points: p, finished: f })
      } catch (err) {
        console.error("Error fetching public stats:", err)
      }
    }
    fetchPublicStats()
    const interval = setInterval(fetchPublicStats, 30000) 
    return () => clearInterval(interval)
  }, [])

  const handlePickChampion = (team) => {
    setCurrentUser({ ...currentUser, championTeam: team })
    fetch(`${API_BASE_URL}/api/users/${currentUser.id}/champion?teamId=${team.id}`, {
      method: 'POST'
    })
  }

  const handleUserLogin = (user) => {
    setCurrentUser(user)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setAppMode('public')
    localStorage.removeItem('polla_user')
    localStorage.removeItem('polla_app_mode')
    window.location.reload()
  }

  // Admin Module Handlers
  if (appMode === 'admin-login') {
    return <AdminLogin onLogin={() => setAppMode('admin-panel')} onBack={() => setAppMode('public')} />
  }

  if (appMode === 'admin-panel') {
    return <AdminDashboard onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen w-full text-white font-sans bg-cup-navy">
      <Navbar user={currentUser} onLoginClick={() => setShowLogin(true)} onLogout={handleLogout} />
      
      {showLogin && <UserLogin onLogin={handleUserLogin} onCancel={() => setShowLogin(false)} />}
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ... Header ... */}
        <header className="text-center mb-12 animate-fade-in pt-10">
          <div className="inline-block px-4 py-1 bg-cup-gold/20 text-cup-gold rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-cup-gold/30">
            Fase de Grupos - Camino al Mundial 2026
          </div>
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-black mb-4 tracking-tighter leading-none">
            POLLA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cup-gold to-yellow-200">PRO+</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto px-2">
            La plataforma más interactiva para vivir el mundial. Predice, comparte y domina el ranking global.
          </p>
        </header>

        {/* Global Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Participantes', value: publicStats.participants.toLocaleString(), icon: Users },
            { label: 'Partidos Jugados', value: `${publicStats.finished} de ${publicStats.matches}`, icon: Calendar },
            { label: 'Puntos Repartidos', value: publicStats.points.toLocaleString(), icon: Trophy },
            { label: 'Modo Maestro', value: 'Acceso Admin', icon: ShieldAlert, action: () => setAppMode('admin-login') },
          ].map((stat, i) => (
            <div 
              key={i} 
              onClick={stat.action}
              className={`glass-card p-4 flex items-center gap-4 border-white/5 cursor-pointer hover:bg-white/10 transition-all ${stat.label === 'Modo Maestro' ? 'hover:border-cup-gold/50' : ''}`}
            >
              <div className="p-3 bg-white/5 rounded-lg">
                <stat.icon size={20} className={stat.label === 'Modo Maestro' ? 'text-cup-gold' : 'text-gray-400'} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{stat.label}</p>
                <p className="text-lg font-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-4 mb-10">
          {[
            { id: 'matches', label: 'Partidos', icon: Calendar },
            { id: 'leaderboard', label: 'Ranking Global', icon: Trophy },
            { id: 'prizes', label: 'Reglas y Premios', icon: ShieldCheck },
            { id: 'payment', label: 'Activar Cuenta', icon: CreditCard },
            currentUser && { id: 'history', label: 'Mis Movimientos', icon: History },
          ].filter(Boolean).map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-3 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-[10px] sm:text-base ${activeTab === tab.id ? 'bg-white text-black font-bold scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
            >
              <tab.icon size={16} className="sm:w-5 sm:h-5 shrink-0" /> <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Unpaid User Alert CTA */}
        {currentUser && !currentUser.paid && activeTab !== 'payment' && (
          <div className="mb-10 animate-fade-in">
            <button 
              onClick={() => setActiveTab('payment')}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 group hover:scale-[1.02] transition-all"
            >
              <ShieldAlert className="text-white animate-pulse" />
              <div className="text-left">
                <p className="text-white font-black text-sm uppercase tracking-wider">Tu cuenta está inactiva</p>
                <p className="text-white/80 text-[10px] font-bold uppercase">Haz clic aquí para subir tu comprobante de pago y habilitar tus pronósticos</p>
              </div>
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'matches' && (
            <>
              {currentUser && (
                <ChampionPicker 
                  currentChampion={currentUser.championTeam} 
                  onPick={handlePickChampion} 
                />
              )}
              {!currentUser && (
                <div className="glass-card p-4 sm:p-6 text-center mb-8 border-dashed border-cup-gold/30">
                  <Trophy size={48} className="mx-auto text-cup-gold/50 mb-4" />
                  <h3 className="text-xl font-bold mb-2">¡Bienvenido a la Polla Pro+!</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">Ingresa con tu cuenta para empezar a predecir resultados y competir por el primer lugar.</p>
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="bg-cup-gold text-black font-black px-8 py-3 rounded-xl hover:scale-105 transition-all uppercase text-xs tracking-widest"
                  >
                    Ingresar para Participar
                  </button>
                </div>
              )}
              <TournamentSchedule adminMode={false} userId={currentUser?.id} />
            </>
          )}
          
          {activeTab === 'leaderboard' && (
            <Leaderboard key={refreshKey} onUserSelect={(user) => setCurrentUser(user)} />
          )}

          {activeTab === 'history' && currentUser && (
            <UserHistory userId={currentUser.id} />
          )}

          {activeTab === 'prizes' && (
            <PrizesAndRules />
          )}

          {activeTab === 'payment' && (
            currentUser ? (
              <PaymentGateway user={currentUser} onStatusUpdate={(u) => setCurrentUser(u)} />
            ) : (
              <div className="glass-card p-12 text-center border-dashed border-white/10">
                <CreditCard size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Inicia Sesión para Activar</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">Debes estar registrado para poder subir tu comprobante de pago y activar tu cuenta.</p>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="bg-white text-black font-black px-8 py-3 rounded-xl hover:scale-105 transition-all uppercase text-xs tracking-widest"
                >
                  Ingresar Ahora
                </button>
              </div>
            )
          )}
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 mt-20 text-center">
        <div className="flex justify-center gap-8 mb-6">
          <span className="text-gray-600 text-sm hover:text-white cursor-pointer" onClick={() => setAppMode('admin-login')}>Acceso Admin</span>
          <span className="text-gray-600 text-sm hover:text-white cursor-pointer" onClick={() => setActiveTab('prizes')}>Reglas</span>
          <span className="text-gray-600 text-sm hover:text-white cursor-pointer">Soporte</span>
          <span className="text-gray-600 text-sm hover:text-white cursor-pointer">Privacidad</span>
        </div>
        <p className="text-gray-500 text-xs">© 2026 Mundial Polla Pro - Diseñado para Impactar.</p>
      </footer>
    </div>
  )
}

export default App
