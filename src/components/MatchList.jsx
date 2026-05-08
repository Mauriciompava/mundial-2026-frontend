import React, { useState, useEffect } from 'react'
import MatchCard from './MatchCard'
import API_BASE_URL from '../api'

const MatchList = ({ adminMode }) => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/matches`)
      .then(res => res.json())
      .then(data => {
        // Transform backend data to match UI needs if necessary
        const formattedData = data.map(m => ({
          id: m.id,
          homeTeam: { name: m.homeTeam.name, flag: m.homeTeam.flagUrl, group: m.homeTeam.groupName },
          awayTeam: { name: m.awayTeam.name, flag: m.awayTeam.flagUrl, group: m.awayTeam.groupName },
          date: new Date(m.matchDate).toLocaleDateString(),
          time: new Date(m.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: m.status,
          homeScore: m.homeScore,
          awayScore: m.awayScore
        }))
        setMatches(formattedData)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching matches:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cup-gold"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map(match => (
        <MatchCard key={match.id} match={match} adminMode={adminMode} />
      ))}
    </div>
  )
}

export default MatchList
