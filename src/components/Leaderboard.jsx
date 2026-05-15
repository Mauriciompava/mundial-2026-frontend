import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Medal, ArrowUp, Minus, Star, Loader2, Mail, Phone, Trophy } from 'lucide-react'
import API_BASE_URL from '../api'
import { getFlagUrl } from '../utils/flagUtils'

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
        <div className="p-4 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div>
            <h2 className="text-lg sm:text-2xl font-black flex items-center gap-2 sm:gap-3">
              <Medal className="text-cup-gold" size={22} /> Ranking Global
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Los mejores pronosticadores del torneo</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] block mb-1">Actualizado</span>
            <span className="text-[10px] sm:text-xs font-bold text-cup-cyan bg-cup-cyan/10 px-2 sm:px-3 py-1 rounded-full">En Vivo</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {players.length === 0 ? (
            <div className="p-20 text-center text-gray-600 italic">No hay participantes registrados aún.</div>
          ) : (
            players.map((player, index) => (
              <div 
                key={player.id} 
                className="p-3 sm:p-5 flex items-center gap-3 sm:gap-5 hover:bg-white/[0.03] transition-all group"
              >
                {/* Rank Number */}
                <div className="relative shrink-0 w-8 text-center">
                  <span className={`text-xl sm:text-2xl font-black ${getRankColor(index)}`}>
                    {index + 1}
                  </span>
                  {index < 3 && (
                    <Star className="absolute -top-1 -right-1 text-cup-gold fill-cup-gold animate-pulse" size={10} />
                  )}
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-black text-sm sm:text-2xl border border-white/10 shadow-inner overflow-hidden">
                    {player.championTeam ? (
                      <img 
                        src={getFlagUrl(player.championTeam, 80)} 
                        alt={player.championTeam.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      player.username?.substring(0, 1).toUpperCase() || '?'
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-cup-navy border border-white/10 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  </div>
                </div>

                {/* Info - takes remaining space */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm sm:text-base font-bold truncate">{player.username}</p>
                    {player.championTeam && (
                      <span className="inline-flex items-center gap-1 bg-cup-gold/10 px-2 py-0.5 rounded text-[9px] sm:text-[10px] text-cup-gold border border-cup-gold/20 font-black uppercase shrink-0">
                        <Trophy size={10} />
                        {player.championTeam.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Points - always visible */}
                <div className="text-right shrink-0">
                  <p className="text-lg sm:text-2xl font-black text-white tracking-tighter leading-none">{player.totalPoints.toLocaleString()}</p>
                  <p className="text-[8px] sm:text-[10px] text-cup-cyan font-black uppercase tracking-wider">Puntos</p>
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
