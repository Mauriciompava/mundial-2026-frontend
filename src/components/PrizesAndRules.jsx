import React from 'react'
import { Trophy, ShieldCheck, DollarSign, Target, Clock, AlertCircle } from 'lucide-react'

const PrizesAndRules = () => {
  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header Sección */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black mb-2 tracking-tight">REGLAMENTO Y PREMIOS</h2>
        <p className="text-gray-400">Todo lo que necesitas saber para competir por el gran premio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lógica de Premios */}
        <div className="glass-card p-8 border-cup-gold/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign size={120} className="text-cup-gold" />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cup-gold/20 rounded-xl text-cup-gold">
              <Trophy size={24} />
            </div>
            <h3 className="text-xl font-bold">Plan de Premios</h3>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <div>
                <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-1">Costo de Inscripción</p>
                <p className="text-3xl font-black text-white">$20.000<span className="text-sm font-normal text-gray-500 ml-2">COP</span></p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mb-1">Inscripciones</p>
                <p className="text-xl font-bold text-cup-gold">Hasta Junio 9, 2026</p>
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <p className="text-cup-gold font-bold text-sm uppercase tracking-widest mb-2">🏆 PREMIO ÚNICO</p>
              <h4 className="text-2xl font-black mb-2">GANADOR ABSOLUTO</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                El usuario que ocupe el **1er lugar en el Ranking Global** al finalizar el mundial recibirá el **60% del pozo total acumulado**. ¡Entre más participantes, más grande será tu premio!
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <AlertCircle className="text-blue-400 shrink-0" size={20} />
              <p className="text-xs text-blue-100/70 leading-relaxed">
                El pozo final depende del número total de inscritos. Entre más personas invites, ¡más grande será el premio!
              </p>
            </div>
          </div>
        </div>

        {/* Sistema de Puntuación */}
        <div className="glass-card p-8 border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/10 rounded-xl text-gray-300">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold">Sistema de Puntos</h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Marcador Exacto', pts: '+5', desc: 'Aciertas el resultado exacto del partido.', color: 'text-cup-gold' },
              { label: 'Ganador (Tendencia)', pts: '+3', desc: 'Aciertas quién gana, pero no el marcador exacto.', color: 'text-white' },
              { label: 'Empate (Tendencia)', pts: '+1', desc: 'Aciertas que hay empate, pero no el marcador exacto.', color: 'text-gray-400' },
              { label: 'Campeón Anticipado', pts: '+100', desc: 'Si eliges al equipo que termina siendo campeón al inicio.', color: 'text-cup-cyan' },
            ].map((rule, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                <div>
                  <p className="font-bold text-sm">{rule.label}</p>
                  <p className="text-xs text-gray-500">{rule.desc}</p>
                </div>
                <div className={`text-xl font-black ${rule.color}`}>{rule.pts}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 p-4 border border-dashed border-white/20 rounded-xl">
            <Clock className="text-gray-500" size={20} />
            <p className="text-xs text-gray-400">
              Las apuestas cierran **1 hora antes** del inicio programado de cada partido.
            </p>
          </div>
        </div>

      </div>

      {/* Reglamento General */}
      <div className="glass-card p-8 border-white/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white/10 rounded-xl text-gray-300">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold">Reglas de Juego Limpio</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="text-cup-gold text-xs font-black uppercase tracking-widest">01. Inscripción</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Para participar oficialmente y aparecer en el ranking, el usuario debe haber realizado el pago y enviado el comprobante al administrador.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-cup-gold text-xs font-black uppercase tracking-widest">02. Pronóstico Final</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Para garantizar la transparencia, una vez enviado tu pronóstico para un partido, este queda bloqueado y **no podrá ser modificado**. Revisa bien antes de confirmar.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-cup-gold text-xs font-black uppercase tracking-widest">03. Empates</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              En caso de empate en puntos al final del mundial, el premio se dividirá en partes iguales entre los usuarios empatados en la primera posición.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrizesAndRules
