import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, AlertTriangle, X, Check } from 'lucide-react'
import { getFlagUrl } from '../utils/flagUtils'

const ConfirmModal = ({ isOpen, title, message, team, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-card p-8 border-cup-gold/30 shadow-2xl shadow-cup-gold/10 overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-cup-gold/10 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cup-gold to-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cup-gold/20 rotate-3 group-hover:rotate-0 transition-transform">
                <Trophy className="text-black" size={40} />
              </div>

              <h2 className="text-2xl font-black mb-2 tracking-tight uppercase italic">{title}</h2>
              <p className="text-gray-400 text-sm mb-8 font-medium leading-relaxed">
                {message}
              </p>

              {/* Selection Preview */}
              {team && (
                <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 flex items-center justify-center gap-4 group">
                  <img 
                    src={getFlagUrl(team)} 
                    alt={team.name}
                    className="w-20 h-14 object-cover rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-cup-gold uppercase tracking-widest">Tu Candidato</p>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{team.name}</h3>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={onConfirm}
                  className="w-full bg-gradient-to-r from-cup-gold to-yellow-500 text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-cup-gold/20 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                >
                  <Check size={18} /> ¡Sí, Confirmar Elección!
                </button>
                
                <button
                  onClick={onCancel}
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-400 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest border border-white/5"
                >
                  <X size={14} /> Corregir Selección
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-red-500/60 font-bold text-[9px] uppercase tracking-tighter">
                <AlertTriangle size={12} />
                Esta acción no se podrá deshacer después
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmModal
