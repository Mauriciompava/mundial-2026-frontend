import React, { useState, useEffect } from 'react'
import { Trophy, Check, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import API_BASE_URL from '../api'
import { getFlagUrl } from '../utils/flagUtils'

const ChampionPicker = ({ currentChampion, onPick }) => {
  const [teams, setTeams] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/teams`)
      .then(res => res.json())
      .then(data => {
        setTeams(data)
        setLoading(false)
      })
  }, [])

  const filteredTeams = searchTerm 
    ? teams.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : teams.slice(0, 24) // Show more default suggestions

  return (
    <div className="glass-card p-4 sm:p-6 mb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cup-gold/10 rounded-full blur-3xl"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-cup-gold to-yellow-600 rounded-xl sm:rounded-2xl shadow-lg shadow-cup-gold/20">
            <Trophy className="text-black" size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black tracking-tight">
              {currentChampion ? 'CANDIDATO ELEGIDO' : 'ELEGIR CAMPEÓN'}
            </h2>
            <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest">
              {currentChampion ? 'Elección bloqueada e inmutable' : 'Todos los equipos clasificados 2026'}
            </p>
          </div>
        </div>

        {!currentChampion && (
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cup-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar país..." 
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 w-full md:w-64 focus:bg-white/10 focus:border-cup-gold outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearching(true)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {!currentChampion && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
          {loading ? (
            Array(12).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse"></div>
            ))
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredTeams.map(team => (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  key={team.id}
                  onClick={() => onPick(team)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border-2 transition-all relative group border-white/5 bg-white/5 hover:border-white/20 hover:scale-105`}
                >
                  <img 
                    src={getFlagUrl(team)} 
                    alt={team.name}
                    className="w-12 h-8 object-cover rounded-sm shadow-sm transition-transform group-hover:scale-110" 
                  />
                  <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-white truncate w-full px-1 text-center">
                    {team.name}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      )}

      {currentChampion && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 sm:p-8 bg-gradient-to-r from-cup-gold/30 via-cup-gold/10 to-transparent rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center gap-4 sm:gap-8 border border-cup-gold/20 shadow-2xl relative overflow-hidden text-center sm:text-left"
        >
          <div className="absolute top-2 right-2 sm:top-0 sm:right-0 sm:p-4">
             <Check className="text-cup-gold" size={24} opacity={0.2} />
          </div>
          <div className="relative shrink-0">
            <img 
              src={getFlagUrl(currentChampion)} 
              alt={currentChampion.name}
              className="w-20 h-14 sm:w-32 sm:h-24 object-cover rounded-xl shadow-2xl border-4 border-white/10" 
            />
            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-cup-gold text-black p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
              <Trophy size={14} fill="currentColor" />
            </div>
          </div>
          <div>
            <p className="text-[9px] sm:text-xs uppercase font-black tracking-[0.2em] sm:tracking-[0.3em] text-cup-gold mb-1 sm:mb-2">Mi Campeón Mundial</p>
            <h3 className="text-2xl sm:text-5xl font-black italic tracking-tighter text-white drop-shadow-lg">{currentChampion.name.toUpperCase()}</h3>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 sm:mt-4 text-green-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 border border-green-500/20">
              <Check size={12} /> Elección Confirmada
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ChampionPicker
