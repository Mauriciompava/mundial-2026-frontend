import React, { useState, useEffect, useRef } from 'react'
import { Shield, FileText, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LegalTerms = ({ onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState('privacy')
  const topRef = useRef(null)

  // Scroll exactly to the "Centro Legal" title
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const sections = {
    privacy: {
      title: 'Política de Privacidad',
      icon: Shield,
      content: [
        {
          title: '1. Información que recopilamos',
          text: 'Recopilamos información básica de los usuarios como nombre, correo electrónico y predicciones realizadas dentro de la plataforma. Adicionalmente, se pueden registrar aportes económicos relacionados con la participación en la polla.'
        },
        {
          title: '2. Uso de la información',
          text: 'La información recopilada se utiliza exclusivamente para: Gestionar la participación de los usuarios, registrar aportes económicos, calcular resultados y rankings, y contactar a los participantes en caso necesario.'
        },
        {
          title: '3. Manejo de información financiera',
          text: 'La plataforma no almacena información bancaria sensible (como números de tarjeta o cuentas). Los pagos se realizan por medios externos como transferencias electrónicas o en efectivo.'
        },
        {
          title: '4. Compartición de datos',
          text: 'No compartimos la información personal con terceros, salvo cuando sea estrictamente necesario para el funcionamiento técnico del sitio.'
        },
        {
          title: '5. Seguridad',
          text: 'Se aplican medidas razonables para proteger la información de los usuarios. Sin embargo, el usuario comprende que ningún sistema es completamente seguro.'
        },
        {
          title: '6. Uso de cookies',
          text: 'La plataforma puede utilizar cookies o tecnologías similares para mejorar la experiencia de usuario.'
        },
        {
          title: '7. Aceptación',
          text: 'El uso de la plataforma implica la aceptación de esta Política de Privacidad.'
        }
      ]
    },
    terms: {
      title: 'Términos y Condiciones',
      icon: FileText,
      content: [
        { title: '1. Naturaleza de la actividad', text: 'La plataforma corresponde a una actividad privada, recreativa y de entretenimiento entre participantes. No constituye una casa de apuestas ni una actividad oficial regulada.' },
        { title: '2. Participación', text: 'Para participar, los usuarios deben registrarse y realizar un aporte económico fijo previamente definido por los organizadores.' },
        { title: '3. Fondo común', text: 'El dinero aportado por los participantes se reúne en un fondo común destinado a la entrega de premios.' },
        { title: '4. Distribución del premio', text: 'El 60% del fondo acumulado será entregado al participante ganador. El porcentaje restante será destinado a la administración y sostenimiento de la plataforma.' },
        { title: '5. Administración del dinero', text: 'El dinero es administrado por el organizador, Mauricio Muñoz Pava, quien se encarga de su gestión y correcta distribución.' },
        { title: '6. Método de pago de premios', text: 'Los premios se entregarán mediante transferencia electrónica o pago en efectivo.' },
        { title: '7. Responsabilidad de la plataforma', text: 'Actúa como medio de registro y visualización. No se garantiza continuidad del servicio ni ausencia de errores técnicos.' },
        { title: '8. Restricción de edad', text: 'Solo pueden participar personas mayores de 18 años.' },
        { title: '9. Aceptación de riesgo', text: 'El participante reconoce que la actividad implica un componente de azar y acepta voluntariamente su participación.' },
        { title: '11. Aceptación de términos', text: 'El uso de la plataforma implica la aceptación total de estos términos.' },
        { title: '12. Modificaciones', text: 'El organizador se reserva el derecho de modificar estos términos en cualquier momento.' }
      ]
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div ref={topRef} className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase italic">
            Centro <span className="text-cup-gold">Legal</span>
          </h2>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setActiveSubTab('privacy')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSubTab === 'privacy' ? 'bg-cup-gold text-black' : 'text-gray-500'}`}
          >
            Privacidad
          </button>
          <button 
            onClick={() => setActiveSubTab('terms')}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeSubTab === 'terms' ? 'bg-cup-gold text-black' : 'text-gray-500'}`}
          >
            Términos
          </button>
        </div>
      </div>

      <div className="glass-card p-6 sm:p-10 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          {activeSubTab === 'privacy' ? <Shield size={200} /> : <FileText size={200} />}
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-black text-cup-gold uppercase tracking-widest mb-8 flex items-center gap-3">
            {sections[activeSubTab].icon === Shield ? <Shield size={24} /> : <FileText size={24} />}
            {sections[activeSubTab].title}
          </h3>

          <div className="space-y-8">
            {sections[activeSubTab].content.map((item, index) => (
              <div key={index} className="group">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-1 bg-cup-gold/10 rounded group-hover:bg-cup-gold/20 transition-colors">
                    <ChevronRight size={14} className="text-cup-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase mb-1 tracking-wide">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.2em]">
              Organizado por Mauro Pava • Polla Mundialista 2026
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LegalTerms
