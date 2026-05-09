import React, { useState, useEffect } from 'react'
import { CheckCircle2, Clock, Swords } from 'lucide-react'
import { motion } from 'framer-motion'
import API_BASE_URL from '../api'

const MatchCard = ({ match, adminMode, userId }) => {
  const [prediction, setPrediction] = useState({ home: '', away: '' })
  const [submitted, setSubmitted] = useState(false)
  const [adminResult, setAdminResult] = useState({ home: '', away: '' })
  const [pointsWon, setPointsWon] = useState(null)
  const [predictionData, setPredictionData] = useState(null)

  useEffect(() => {
    if (userId && !adminMode) {
      fetch(`${API_BASE_URL}/api/predictions/check?userId=${userId}&matchId=${match.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.id) {
            setSubmitted(true)
            setPrediction({ home: data.predictedHomeScore, away: data.predictedAwayScore })
            setPredictionData(data)
            if (data.pointsWon !== null && data.pointsWon !== undefined) {
              setPointsWon(data.pointsWon)
            }
          }
        })
        .catch(() => {}) 
    }
  }, [userId, match.id, adminMode])

  const getPointsLabel = () => {
    if (pointsWon === null || pointsWon === undefined) return null
    if (pointsWon > 0) {
      // Determine type of hit
      const exactMatch = predictionData &&
        match.homeScore === predictionData.predictedHomeScore &&
        match.awayScore === predictionData.predictedAwayScore
      
      const label = exactMatch ? 'EXACTO' : 'ACIERTO'
      return { label, points: pointsWon, color: 'text-cup-cyan', bg: 'bg-cup-cyan/10 border-cup-cyan/20' }
    }
    return { label: 'SIN ACIERTO', points: 0, color: 'text-gray-500', bg: 'bg-white/5 border-white/10' }
  }

  const handlePredict = () => {
    if (prediction.home !== '' && prediction.away !== '') {
      fetch(`${API_BASE_URL}/api/predictions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { id: userId },
          match: { id: match.id },
          predictedHomeScore: parseInt(prediction.home),
          predictedAwayScore: parseInt(prediction.away)
        })
      }).then(res => {
        if (res.ok) setSubmitted(true)
      })
    }
  }

  const handleSetResult = () => {
    if (adminResult.home !== '' && adminResult.away !== '') {
      fetch(`${API_BASE_URL}/api/matches/${match.id}/result?homeScore=${adminResult.home}&awayScore=${adminResult.away}`, {
        method: 'POST'
      }).then(() => window.location.reload())
    }
  }

  const pointsInfo = getPointsLabel()

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-6 flex flex-col gap-6 relative group border-2 ${adminMode ? 'border-cup-cyan/20' : 'border-white/5'}`}
    >
      <div className="absolute top-0 right-0 bg-white/10 px-4 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:bg-cup-gold group-hover:text-black transition-colors">
        Grupo {match.homeTeam.group}
      </div>

      <div className="flex justify-between items-center text-[10px] text-gray-500 font-black uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          {match.date} • {match.time}
        </div>
        {match.status === 'FINISHED' ? (
          <span className="text-green-400">Finalizado</span>
        ) : (
          <span className="text-cup-gold">Abierto</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-4xl sm:text-5xl drop-shadow-xl">{match.homeTeam.flag}</div>
          <span className="font-black text-[10px] sm:text-xs text-center tracking-tighter uppercase line-clamp-1">{match.homeTeam.name}</span>
        </div>

        <div className="flex flex-col items-center">
          {match.status === 'FINISHED' ? (
            <div className="text-2xl sm:text-4xl font-black bg-white/5 px-3 sm:px-4 py-1 sm:py-2 rounded-xl border border-white/10">
              {match.homeScore} <span className="text-gray-600 text-xl sm:text-2xl mx-1">-</span> {match.awayScore}
            </div>
          ) : (
            <div className="p-3 bg-white/5 rounded-full border border-white/10">
              <Swords size={20} className="text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-4xl sm:text-5xl drop-shadow-xl">{match.awayTeam.flag}</div>
          <span className="font-black text-[10px] sm:text-xs text-center tracking-tighter uppercase line-clamp-1">{match.awayTeam.name}</span>
        </div>
      </div>

      {/* Admin Interface */}
      {adminMode && match.status !== 'FINISHED' && (
        <div className="mt-4 p-4 bg-cup-cyan/5 rounded-xl border border-cup-cyan/20">
          <p className="text-[10px] font-bold text-cup-cyan uppercase mb-3 text-center">Setear Resultado Real (Admin)</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <input type="number" value={adminResult.home} onChange={e => setAdminResult({...adminResult, home: e.target.value})} className="w-10 h-10 bg-black/40 rounded-lg text-center font-bold" />
            <input type="number" value={adminResult.away} onChange={e => setAdminResult({...adminResult, away: e.target.value})} className="w-10 h-10 bg-black/40 rounded-lg text-center font-bold" />
          </div>
          <button onClick={handleSetResult} className="w-full bg-cup-cyan text-black font-black py-2 rounded-lg text-xs uppercase">Finalizar Partido</button>
        </div>
      )}

      {/* User Prediction */}
      {!adminMode && match.status === 'SCHEDULED' && (
        <div className="mt-2">
          {submitted ? (
            <div className="bg-cup-gold/10 border border-cup-gold/30 p-3 rounded-xl flex items-center justify-center gap-2 text-cup-gold text-xs font-bold uppercase">
              <CheckCircle2 size={14} /> Predicción Guardada ({prediction.home} - {prediction.away})
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center gap-4">
                <input 
                  type="number" 
                  value={prediction.home}
                  onChange={(e) => setPrediction({...prediction, home: e.target.value})}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold focus:border-cup-gold outline-none"
                  placeholder="0"
                />
                <span className="text-gray-600 font-bold">X</span>
                <input 
                  type="number" 
                  value={prediction.away}
                  onChange={(e) => setPrediction({...prediction, away: e.target.value})}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold focus:border-cup-gold outline-none"
                  placeholder="0"
                />
              </div>
              <button onClick={handlePredict} className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-cup-gold transition-all text-xs uppercase tracking-widest">Enviar Pronóstico</button>
            </div>
          )}
        </div>
      )}

      {/* Result with real points */}
      {match.status === 'FINISHED' && !adminMode && submitted && (
        <div className={`mt-2 text-center p-3 rounded-xl border ${pointsInfo ? pointsInfo.bg : 'bg-white/5 border-white/10'}`}>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
            Tu Pronóstico: {prediction.home} - {prediction.away}
          </p>
          {pointsInfo ? (
            <p className={`text-lg font-black ${pointsInfo.color}`}>
              {pointsInfo.label} +{pointsInfo.points} PTS
            </p>
          ) : (
            <p className="text-sm font-bold text-gray-400">Procesando puntos...</p>
          )}
        </div>
      )}

      {match.status === 'FINISHED' && !adminMode && !submitted && (
        <div className="mt-2 text-center p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-gray-500 uppercase font-bold">No participaste en este partido</p>
        </div>
      )}
    </motion.div>
  )
}

export default MatchCard

