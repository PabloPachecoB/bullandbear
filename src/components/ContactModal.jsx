import { useState } from 'react';
import './ContactModal.css';

function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    ciudad: '',
    celular: '',
    empresa: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const departamentos = [
    'La Paz',
    'Santa Cruz',
    'Cochabamba',
    'Oruro',
    'Potosí',
    'Tarija',
    'Chuquisaca',
    'Beni',
    'Pando'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Aquí irá la conexión con Supabase
    // TODO: Conectar con Supabase
    try {
      console.log('Datos del formulario:', formData);
      
      // Simulación de envío (reemplazar con Supabase)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage('¡Gracias! Nos pondremos en contacto contigo pronto.');
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        correo: '',
        ciudad: '',
        celular: '',
        empresa: ''
      });

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
        setSubmitMessage('');
      }, 2000);

    } catch (error) {
      setSubmitMessage('Error al enviar. Por favor intenta nuevamente.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <h2 className="modal-title">Solicitar Información - 91T</h2>
        <p className="modal-subtitle">Completa el formulario y nos pondremos en contacto contigo</p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              placeholder="juan@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">Departamento *</label>
            <select
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un departamento</option>
              {departamentos.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="celular">Número de Celular *</label>
            <input
              type="tel"
              id="celular"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              required
              placeholder="+591 70123456"
              pattern="[0-9+\s]+"
            />
          </div>

          <div className="form-group">
            <label htmlFor="empresa">Nombre de la Empresa</label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              placeholder="Transportes Bolivia S.A."
            />
          </div>

          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
              {submitMessage}
            </div>
          )}

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
