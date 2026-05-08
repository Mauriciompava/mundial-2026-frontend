import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, TrendingUp, CheckCircle2, XCircle, Clock, Info } from 'lucide-react'
import API_BASE_URL from '../api'

const UserHistory = ({ userId }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetch(`${API_BASE_URL}/api/predictions/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          setHistory(data)
          setLoading(false)
        })
        .catch(err => {
          console.error("Error fetching history:", err)
          setLoading(false)
        })
    }
  }, [userId])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cup-gold"></div>
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cup-cyan/20 rounded-xl">
            <History className="text-cup-cyan" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">MIS MOVIMIENTOS</h2>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Historial de predicciones y puntos</p>
          </div>
        </div>
        <div className="bg-white/5 px-6 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
          <TrendingUp className="text-green-500" size={18} />
          <span className="text-xl font-black">{history.length} <span className="text-xs text-gray-500 uppercase">Apuestas</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.length > 0 ? (
          history.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
              className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 border-white/5 hover:border-cup-cyan/30 transition-all group"
            >
              <div className="flex items-center gap-6 flex-1 w-full">
                <div className="text-xs font-black text-gray-600 bg-white/5 px-3 py-1 rounded-lg uppercase">
                  {new Date(item.match.matchDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </div>
                <div className="flex items-center gap-4 flex-1 justify-center md:justify-start">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{item.match.homeTeam.flagUrl}</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">{item.match.homeTeam.name}</span>
                  </div>
                  <div className="flex flex-col items-center px-4 py-2 bg-black/20 rounded-xl border border-white/5 min-w-[80px]">
                    <span className="text-lg font-black text-cup-gold">
                      {item.predictedHomeScore} - {item.predictedAwayScore}
                    </span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Mi Pronóstico</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{item.match.awayTeam.flagUrl}</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">{item.match.awayTeam.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
                <div className="flex flex-col items-center">
                  <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Resultado Real</p>
                  {item.match.status === 'FINISHED' ? (
                    <div className="text-xl font-black text-white px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                      {item.match.homeScore} - {item.match.awayScore}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-gray-600 font-bold text-xs uppercase italic">
                      <Clock size={12} /> Pendiente
                    </div>
                  )}
                </div>

                <div className="flex-1 md:w-32 flex flex-col items-center md:items-end">
                  <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Puntos Ganados</p>
                  {item.match.status === 'FINISHED' ? (
                    <div className={`flex items-center gap-2 font-black text-2xl ${item.pointsWon > 0 ? 'text-green-500' : 'text-red-400'}`}>
                      {item.pointsWon > 0 ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                      +{item.pointsWon || 0}
                    </div>
                  ) : (
                    <div className="text-2xl font-black text-gray-700">--</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center glass-card border-dashed border-white/10">
            <Info className="mx-auto text-gray-600 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Aún no has realizado movimientos.</p>
            <p className="text-xs text-gray-600 mt-2">Tus predicciones aparecerán aquí en cuanto las realices.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserHistory
