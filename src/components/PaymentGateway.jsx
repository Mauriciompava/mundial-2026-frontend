import React, { useState } from 'react'
import { QrCode, Upload, CheckCircle, Clock, ShieldCheck, CreditCard } from 'lucide-react'
import API_BASE_URL from '../api'

const PaymentGateway = ({ user, onStatusUpdate }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState(user?.paymentReceipt ? 'pending' : 'none')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFile(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}/upload-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(file)
      })
      if (response.ok) {
        const updatedUser = await response.json()
        onStatusUpdate(updatedUser)
        setStatus('pending')
      }
    } catch (error) {
      console.error('Error uploading receipt:', error)
    } finally {
      setUploading(false)
    }
  }

  if (user?.paid) {
    return (
      <div className="glass-card p-12 text-center border-cup-gold/30 animate-fade-in">
        <div className="w-20 h-20 bg-cup-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-cup-gold" size={40} />
        </div>
        <h2 className="text-3xl font-black mb-2">¡CUENTA ACTIVADA!</h2>
        <p className="text-gray-400 max-w-md mx-auto">Tu pago ha sido verificado. Ya puedes participar en todos los pronósticos y competir por el premio mayor.</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black mb-2 tracking-tight uppercase">Activa tu Participación</h2>
        <p className="text-gray-400">Sigue los pasos para habilitar tus pronósticos en la Polla Pro+.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Payment */}
        <div className="glass-card p-8 border-white/10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cup-gold text-black rounded-full flex items-center justify-center font-black">1</div>
            <h3 className="text-xl font-bold italic">Realiza tu Pago</h3>
          </div>
          
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Escanea uno de los siguientes códigos QR desde tu app bancaria y transfiere los **$20.000 COP** de tu inscripción.
          </p>

          <div className="flex justify-center mb-8">
            <div className="space-y-3 w-64">
              <div className="bg-white p-0 rounded-3xl aspect-square flex items-center justify-center overflow-hidden border-8 border-white/5 shadow-2xl shadow-pink-500/10 group">
                <img 
                  src="/nequi_qr.png" 
                  alt="QR Nequi" 
                  className="w-full h-full object-cover scale-[1.12] transition-transform duration-500 group-hover:scale-[1.2]" 
                />
              </div>
              <p className="text-center text-sm font-black uppercase text-pink-500 tracking-widest">Nequi</p>
            </div>
          </div>

          <div className="mt-auto p-4 bg-white/5 rounded-xl border border-dashed border-white/20">
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Titular de la cuenta</p>
            <p className="text-xs font-bold text-white">ADMINISTRADOR POLLA PRO+</p>
            <p className="text-[10px] text-cup-gold mt-2">No olvides tomar captura del comprobante.</p>
          </div>
        </div>

        {/* Step 2: Proof */}
        <div className="glass-card p-8 border-white/10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cup-gold text-black rounded-full flex items-center justify-center font-black">2</div>
            <h3 className="text-xl font-bold italic">Sube tu Comprobante</h3>
          </div>

          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Una vez realizado el pago, carga la captura de pantalla aquí. Nuestro equipo verificará tu saldo en máximo 24 horas.
          </p>

          {status === 'pending' ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 bg-cup-gold/5 border border-cup-gold/20 rounded-2xl border-dashed">
              <Clock className="text-cup-gold mb-4 animate-pulse" size={48} />
              <p className="text-sm font-bold text-white">Verificación en Proceso</p>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Espera nuestra aprobación</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-6">
              <label className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-white/5 hover:border-cup-gold/50 cursor-pointer transition-all group">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-gray-500 group-hover:text-cup-gold" size={32} />
                </div>
                <p className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-widest">
                  {file ? 'Archivo Seleccionado' : 'Seleccionar Captura'}
                </p>
                {file && <p className="text-[10px] text-cup-gold mt-2">Imagen cargada correctamente</p>}
              </label>

              <button 
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${file && !uploading ? 'bg-cup-gold text-black hover:scale-105 shadow-lg shadow-cup-gold/20' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
              >
                {uploading ? 'Enviando...' : 'Enviar para Verificación'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security Banner */}
      <div className="glass-card p-6 border-white/5 bg-gradient-to-r from-cup-navy to-cup-navy/50 flex items-center gap-6">
        <div className="p-4 bg-cup-gold/10 rounded-2xl">
          <ShieldCheck className="text-cup-gold" size={32} />
        </div>
        <div>
          <h4 className="font-bold text-sm">Transacción 100% Segura</h4>
          <p className="text-xs text-gray-500">Tus datos están protegidos. El sistema de verificación manual garantiza que no haya cobros adicionales por comisiones bancarias.</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentGateway
