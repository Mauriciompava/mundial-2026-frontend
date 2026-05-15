import React, { useState, useEffect } from 'react'
import { CheckCircle2, Clock, Swords, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import API_BASE_URL from '../api'
import { getFlagUrl } from '../utils/flagUtils'

const MatchCard = ({ match, adminMode, user }) => {
  const userId = user?.id;
  const [prediction, setPrediction] = useState({ home: '', away: '' })
  const [submitted, setSubmitted] = useState(false)
  const [adminResult, setAdminResult] = useState({ home: '', away: '' })
  const [pointsWon, setPointsWon] = useState(null)
  const [predictionData, setPredictionData] = useState(null)
  const [userPaid, setUserPaid] = useState(false)

  useEffect(() => {
    if (userId && !adminMode) {
      // Use the paid status from the passed user object
      setUserPaid(!!user?.paid);

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
  }, [userId, match.id, adminMode, user?.paid])

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

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas resetear este partido? Esto revertirá los puntos de todos los usuarios.')) {
      fetch(`${API_BASE_URL}/api/matches/${match.id}/reset`, {
        method: 'POST'
      })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text || 'Error en el servidor') });
        }
        window.location.reload();
      })
      .catch(err => {
        alert('Error al resetear el partido: ' + err.message);
        console.error(err);
      });
    }
  }

  const pointsInfo = getPointsLabel()
  const isFinal = match.stage === 'Final'

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileHover={isFinal ? { scale: 1.02, y: -5 } : { scale: 1.01 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-6 flex flex-col gap-6 relative group border-2 transition-all duration-500 ${
        isFinal 
          ? 'border-cup-gold/60 shadow-[0_0_50px_rgba(212,175,55,0.2)] bg-gradient-to-br from-cup-gold/10 via-transparent to-cup-gold/5' 
          : adminMode ? 'border-cup-cyan/20' : 'border-white/5'
      } ${isFinal ? 'md:col-span-2 lg:col-span-3 py-12' : ''}`}
    >
      {isFinal && (
        <>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cup-gold to-yellow-600 text-black px-10 py-2 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-cup-gold/40 z-20 flex items-center gap-2">
            <Trophy size={16} fill="currentColor" /> Gran Final 2026
          </div>
        </>
      )}

      <div className={`absolute top-0 right-0 ${isFinal ? 'bg-cup-gold text-black' : 'bg-white/10 text-gray-400'} px-4 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest group-hover:bg-cup-gold group-hover:text-black transition-colors z-10`}>
        {match.stage}
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

      <div className={`flex items-center justify-between gap-4 ${isFinal ? 'py-12 px-4 sm:px-12' : 'py-4'}`}>
        <div className="flex flex-col items-center gap-3 flex-1">
          <img 
            src={getFlagUrl(match.homeTeam)} 
            alt={match.homeTeam.name}
            className={`${isFinal ? 'w-24 h-16 sm:w-40 sm:h-28' : 'w-12 h-8 sm:w-16 sm:h-10'} object-cover rounded-md sm:rounded-xl shadow-2xl border-2 sm:border-4 border-white/10 transition-transform group-hover:scale-110 duration-500`} 
          />
          <span className={`font-black uppercase text-center tracking-tighter ${isFinal ? 'text-sm sm:text-xl text-cup-gold' : 'text-[10px] sm:text-xs text-white'} line-clamp-1`}>
            {match.homeTeam.name}
          </span>
        </div>

        <div className="flex flex-col items-center">
          {match.status === 'FINISHED' ? (
            <div className={`font-black bg-white/5 px-6 sm:px-10 py-3 sm:py-6 rounded-2xl sm:rounded-[2rem] border-2 border-cup-gold/30 shadow-2xl shadow-cup-gold/10 flex flex-col items-center ${isFinal ? 'text-4xl sm:text-7xl' : 'text-2xl sm:text-4xl'}`}>
              <div className="flex items-center gap-4 sm:gap-8">
                {match.homeScore} <span className="text-cup-gold opacity-50 text-2xl sm:text-5xl">VS</span> {match.awayScore}
              </div>
              {isFinal && <Trophy className="text-cup-gold mt-4 animate-bounce" size={isFinal ? 40 : 24} />}
            </div>
          ) : (
            <div className={`${isFinal ? 'p-6 sm:p-10' : 'p-3'} bg-gradient-to-br from-cup-gold/20 to-transparent rounded-full border-2 border-cup-gold/30 shadow-inner animate-pulse`}>
              <Swords size={isFinal ? 40 : 20} className="text-cup-gold" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 flex-1">
          <img 
            src={getFlagUrl(match.awayTeam)} 
            alt={match.awayTeam.name}
            className={`${isFinal ? 'w-24 h-16 sm:w-40 sm:h-28' : 'w-12 h-8 sm:w-16 sm:h-10'} object-cover rounded-md sm:rounded-xl shadow-2xl border-2 sm:border-4 border-white/10 transition-transform group-hover:scale-110 duration-500`} 
          />
          <span className={`font-black uppercase text-center tracking-tighter ${isFinal ? 'text-sm sm:text-xl text-cup-gold' : 'text-[10px] sm:text-xs text-white'} line-clamp-1`}>
            {match.awayTeam.name}
          </span>
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

      {adminMode && match.status === 'FINISHED' && (
        <div className="mt-4">
          <button 
            onClick={handleReset} 
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold py-2 rounded-lg text-xs uppercase transition-colors"
          >
            Resetear Partido
          </button>
        </div>
      )}

      {/* User Prediction Logic */}
      {!adminMode && match.status === 'SCHEDULED' && (
        <div className="mt-2">
          {/* CASE 1: Not Logged In - Show inputs but disable action (demonstration) */}
          {!userId ? (
            <div className="flex flex-col gap-3 opacity-60">
              <div className="flex items-center justify-center gap-4">
                <input type="number" disabled className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold" placeholder="0" />
                <span className="text-gray-600 font-bold">X</span>
                <input type="number" disabled className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold" placeholder="0" />
              </div>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="w-full bg-white/10 text-gray-400 font-black py-3 rounded-xl text-xs uppercase tracking-widest cursor-pointer hover:bg-white hover:text-black transition-all"
              >
                Ingresar para Participar
              </button>
            </div>
          ) : (
            /* CASE 2: Logged In - Check payment status */
            <>
              {!userPaid ? (
                /* Subcase: Logged in but UNPAID - Show Inactive box (as in your image) */
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center space-y-3 animate-fade-in">
                  <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Cuenta Inactiva</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">Debes activar tu cuenta para poder realizar pronósticos.</p>
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('switch-to-payments'))}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-[10px] font-black uppercase transition-all border border-white/10"
                  >
                    Ir a Pagos
                  </button>
                </div>
              ) : submitted ? (
                /* Subcase: Paid and Already Submitted */
                <div className="bg-cup-gold/10 border border-cup-gold/30 p-3 rounded-xl flex items-center justify-center gap-2 text-cup-gold text-xs font-bold uppercase">
                  <CheckCircle2 size={14} /> Predicción Guardada ({prediction.home} - {prediction.away})
                </div>
              ) : (
                /* Subcase: Paid and Ready to Predict */
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
            </>
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

