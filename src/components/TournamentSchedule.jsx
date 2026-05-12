import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar as CalendarIcon, ChevronRight } from 'lucide-react'
import MatchCard from './MatchCard'
import API_BASE_URL from '../api'

const TournamentSchedule = ({ adminMode, userId }) => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [phaseFilter, setPhaseFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/matches`)
      .then(res => res.json())
      .then(data => {
        const formattedData = data.map(m => ({
          id: m.id,
          homeTeam: { 
            name: m.homeTeam?.name || 'TBD', 
            flag: m.homeTeam?.flagUrl || '🏳️', 
            group: m.homeTeam?.groupName || '' 
          },
          awayTeam: { 
            name: m.awayTeam?.name || 'TBD', 
            flag: m.awayTeam?.flagUrl || '🏳️', 
            group: m.awayTeam?.groupName || '' 
          },
          date: new Date(m.matchDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
          time: new Date(m.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: m.status,
          stage: m.stage || 'Fase Desconocida',
          homeScore: m.homeScore,
          awayScore: m.awayScore
        }))
        setMatches(formattedData)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching schedule:", err)
        setLoading(false)
      })
  }, [])

  const filteredMatches = matches.filter(m => {
    const stage = m.stage || ''
    const matchesFilter = filter === 'ALL' || m.homeTeam.group === filter
    const matchesPhase = phaseFilter === 'ALL' || 
                         (phaseFilter === 'GROUPS' && stage.includes('Grupo')) ||
                         (phaseFilter === 'KNOCKOUT' && !stage.includes('Grupo'))
    
    const homeName = m.homeTeam?.name?.toLowerCase() || ''
    const awayName = m.awayTeam?.name?.toLowerCase() || ''
    const search = searchTerm.toLowerCase()
    
    const matchesSearch = homeName.includes(search) || awayName.includes(search)
    
    return matchesFilter && matchesPhase && matchesSearch
  })

  const groups = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
  const phases = [
    { id: 'ALL', label: 'Todo' },
    { id: 'GROUPS', label: 'Fase de Grupos' },
    { id: 'KNOCKOUT', label: 'Eliminatorias' }
  ]

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cup-gold"></div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col gap-6 glass-card p-6 border-white/5">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar país o equipo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-cup-gold outline-none transition-all"
            />
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
            {phases.map(p => (
              <button
                key={p.id}
                onClick={() => setPhaseFilter(p.id)}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${phaseFilter === p.id ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {phaseFilter !== 'KNOCKOUT' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-t border-white/5 pt-4">
            <Filter size={16} className="text-gray-500 mr-2 shrink-0" />
            {groups.map(g => (
              <button
                key={g}
                onClick={() => setFilter(g)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${filter === g ? 'bg-cup-gold text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                {g === 'ALL' ? 'Todos los Grupos' : `Grupo ${g}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} adminMode={adminMode} userId={userId} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass-card border-dashed border-white/10">
            <p className="text-gray-500 font-medium">No se encontraron partidos para esta selección.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TournamentSchedule
