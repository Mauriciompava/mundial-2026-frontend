import React from 'react'
import { User, Bell, Search, LogOut } from 'lucide-react'

const Navbar = ({ user, onLoginClick, onLogout }) => {
  return (
    <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-cup-navy/80">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* ... Logo ... */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cup-gold rounded-lg flex items-center justify-center font-bold text-black text-xl shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            26
          </div>
          <span className="font-bold text-xl tracking-tighter hidden md:block italic">WC2026<span className="text-cup-gold">POLLA</span><span className="text-cup-cyan ml-1 font-black">PRO+</span></span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10 group focus-within:border-cup-gold/50 transition-all">
            <Search size={18} className="text-gray-400 group-focus-within:text-cup-gold" />
            <input 
              type="text" 
              placeholder="Buscar pronóstico..." 
              className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-gray-600"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full relative transition-colors group">
              <Bell size={22} className="text-gray-400 group-hover:text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-cup-gold rounded-full border-2 border-cup-navy"></span>
            </button>
            
            <div className="flex items-center gap-2">
              <div 
                onClick={!user?.id ? onLoginClick : undefined}
                className="flex items-center gap-3 bg-white/5 p-1.5 pr-4 rounded-full border border-white/10 hover:border-cup-gold/50 cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cup-gold to-yellow-600 rounded-full flex items-center justify-center font-black text-black text-xs shadow-lg">
                  {user?.username?.substring(0, 1).toUpperCase() || '?'}
                </div>
                <div className="text-xs">
                  <p className="font-black text-white">{user?.username || 'Ingresar'}</p>
                  <p className="text-cup-gold font-bold">{(user?.totalPoints || 0).toLocaleString()} pts</p>
                </div>
              </div>

              {user?.id && (
                <button 
                  onClick={onLogout}
                  className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
