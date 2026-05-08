import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Medal, ArrowUp, Minus, Star, Loader2, Mail, Phone, Trophy } from 'lucide-react'
import API_BASE_URL from '../api'

const Leaderboard = ({ onUserSelect }) => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => b.totalPoints - a.totalPoints)
        setPlayers(sorted)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching users:", err)
        setLoading(false)
      })
  }, [])

  const getRankColor = (rank) => {
    if (rank === 0) return 'text-cup-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]'
    if (rank === 1) return 'text-gray-300'
    if (rank === 2) return 'text-orange-400'
    return 'text-gray-500'
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="animate-spin text-cup-gold" size={40} />
      <p className="text-gray-500 font-bold animate-pulse">Analizando rendimiento...</p>
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="glass-card overflow-hidden border-white/5 shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Medal className="text-cup-gold" size={28} /> Ranking Global
            </h2>
            <p className="text-gray-500 text-sm mt-1">Los mejores pronosticadores del torneo</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] block mb-1">Actualizado</span>
            <span className="text-xs font-bold text-cup-cyan bg-cup-cyan/10 px-3 py-1 rounded-full">En Vivo</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {players.length === 0 ? (
            <div className="p-20 text-center text-gray-600 italic">No hay participantes registrados aún.</div>
          ) : (
            players.map((player, index) => (
              <div 
                key={player.id} 
                className="p-6 flex items-center justify-between hover:bg-white/[0.03] transition-all group relative"
              >
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="relative">
                    <span className={`text-3xl font-black w-10 block text-center ${getRankColor(index)}`}>
                      {index + 1}
                    </span>
                    {index < 3 && (
                      <Star className="absolute -top-2 -right-2 text-cup-gold fill-cup-gold animate-pulse" size={14} />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="relative group/avatar">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-black text-xl sm:text-2xl border border-white/10 group-hover:border-cup-gold/50 transition-colors shadow-lg">
                        {player.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cup-navy border-2 border-white/10 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-base sm:text-xl font-bold tracking-tight">{player.fullName || player.username}</p>
                        {player.championTeam && (
                          <div className="flex items-center gap-2 bg-cup-gold/10 px-3 py-1 rounded-lg text-[10px] text-cup-gold border border-cup-gold/20 font-black uppercase tracking-tighter">
                            <Trophy size={12} />
                            {player.championTeam.name}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={12} /> {player.email}
                        </p>
                        {player.phoneNumber && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 border-l border-white/10 pl-4">
                            <Phone size={12} /> {player.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="text-right">
                    <p className="text-2xl sm:text-4xl font-black text-white tracking-tighter">{player.totalPoints.toLocaleString()}</p>
                    <p className="text-[10px] text-cup-cyan font-black uppercase tracking-[0.2em]">Puntos</p>
                  </div>
                  
                  <button 
                    onClick={() => onUserSelect(player)}
                    className="opacity-0 group-hover:opacity-100 bg-white text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
                  >
                    Apostar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Leaderboard
