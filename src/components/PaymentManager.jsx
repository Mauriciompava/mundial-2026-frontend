import React, { useState, useEffect } from 'react'
import { Check, X, Eye, User, CreditCard, Search, ExternalLink } from 'lucide-react'
import API_BASE_URL from '../api'

const PaymentManager = () => {
  const [pendingUsers, setPendingUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  useEffect(() => {
    fetchPendingPayments()
  }, [])

  const fetchPendingPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`)
      const data = await response.json()
      // Filter users who uploaded a receipt but haven't been marked as paid yet
      const pending = data.filter(u => u.paymentReceipt && !u.paid)
      setPendingUsers(pending)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching pending payments:', error)
      setLoading(false)
    }
  }

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/toggle-payment?status=true`, {
        method: 'POST'
      })
      if (response.ok) {
        setPendingUsers(pendingUsers.filter(u => u.id !== userId))
      }
    } catch (error) {
      console.error('Error approving payment:', error)
    }
  }

  const handleReject = async (userId) => {
    if (window.confirm('¿Estás seguro de rechazar este pago? El usuario deberá subir el comprobante nuevamente.')) {
      try {
        await fetch(`${API_BASE_URL}/api/users/${userId}/upload-receipt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(null)
        })
        fetchPendingPayments()
      } catch (error) {
        console.error('Error rejecting payment:', error)
      }
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Cargando pagos pendientes...</div>

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-cup-gold/5 to-transparent">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Comprobantes Pendientes</p>
          <div className="flex items-center gap-4">
            <h3 className="text-3xl font-black">{pendingUsers.length}</h3>
            <span className="text-[10px] bg-cup-gold/20 text-cup-gold px-2 py-1 rounded-md font-bold">POR REVISAR</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="glass-card border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-white/5">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Correo</th>
              <th className="px-6 py-4">Comprobante</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pendingUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-gray-600 text-sm italic">
                  No hay pagos pendientes por verificar. ¡Todo al día!
                </td>
              </tr>
            ) : (
              pendingUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-cup-gold font-bold text-xs uppercase">
                        {u.username.substring(0, 2)}
                      </div>
                      <span className="font-bold text-sm">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedReceipt(u.paymentReceipt)}
                      className="flex items-center gap-2 text-cup-cyan hover:text-white transition-colors text-xs font-bold uppercase"
                    >
                      <Eye size={14} /> Ver Imagen
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleReject(u.id)}
                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                        title="Rechazar"
                      >
                        <X size={18} />
                      </button>
                      <button 
                        onClick={() => handleApprove(u.id)}
                        className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg font-black text-[10px] uppercase hover:scale-105 transition-all"
                      >
                        <Check size={14} /> Aprobar Pago
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-md animate-fade-in">
          <button 
            onClick={() => setSelectedReceipt(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <X size={24} />
          </button>
          <div className="max-w-4xl max-h-full overflow-hidden bg-white rounded-2xl shadow-2xl">
            <img 
              src={selectedReceipt} 
              alt="Comprobante de Pago" 
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentManager
