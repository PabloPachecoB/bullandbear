import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../config/api';
import './RegistrationPage.css';

const ciudadesBolivia = [
  'La Paz',
  'El Alto',
  'Santa Cruz de la Sierra',
  'Cochabamba',
  'Sucre',
  'Oruro',
  'Tarija',
  'Potosi',
  'Trinidad',
  'Cobija',
  'Riberalta',
  'Yacuiba',
  'Montero',
  'Quillacollo',
  'Sacaba',
  'Warnes',
  'Viacha',
  'Camiri',
  'Tupiza',
  'Villazon',
  'Bermejo',
  'Uyuni',
  'Huanuni',
  'Guayaramerin',
  'San Ignacio de Velasco',
  'Otra'
];

const initialForm = {
  nombres: '',
  apellidos: '',
  cedula: '',
  edad: '',
  telefono: '',
  correo: '',
  ciudad: '',
  ciudad_zona: '',
  cargo: '',
  experiencia_previa: '',
  mercados_operados: '',
  nivel_trading: '',
  objetivo_curso: '',
  horario_preferido: '',
  como_se_entero: '',
  observaciones: '',
  acepta_terminos: false,
};

function RegistrationPage() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.acepta_terminos) {
      alert('Debes aceptar los terminos para continuar.');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await api.crearRegistro({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        cedula: formData.cedula || null,
        edad: Number(formData.edad),
        telefono: formData.telefono,
        correo: formData.correo,
        ciudad: formData.ciudad,
        ciudad_zona: formData.ciudad_zona || null,
        cargo: formData.cargo,
        experiencia_previa: formData.experiencia_previa || null,
        mercados_operados: formData.mercados_operados || null,
        nivel_trading: formData.nivel_trading || null,
        objetivo_curso: formData.objetivo_curso || null,
        horario_preferido: formData.horario_preferido || null,
        como_se_entero: formData.como_se_entero || null,
        observaciones: formData.observaciones || null,
        experiencia: formData.nivel_trading || null,
      });

      setSubmitStatus('success');
      setFormData(initialForm);
    } catch (error) {
      console.error('Error al registrar:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="registration-page">
        <div className="registration-container">
          <div className="success-message">
            <div className="success-icon">&#10003;</div>
            <h2>Registro Exitoso</h2>
            <p>Gracias por tu interes en Bull & Bear Trading Academy. Nos pondremos en contacto contigo muy pronto.</p>
            <Link to="/" className="back-button">Volver al Inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="reg-header">
          <h1>Formulario de Bienvenida</h1>
          <p className="reg-subtitle">Curso Introductorio - 1ra Version 2026</p>
          <p>Academia Bull & Bear Trading Academy. Completa el formulario para reservar tu lugar en nuestro programa.</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">

          {/* ─── SECCION 1: DATOS PERSONALES ─── */}
          <fieldset className="form-section">
            <legend>Datos Personales</legend>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombres">Nombre(s) completo(s) *</label>
                <input type="text" id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} required placeholder="Ej: Juan Carlos" />
              </div>
              <div className="form-group">
                <label htmlFor="apellidos">Apellidos *</label>
                <input type="text" id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} required placeholder="Ej: Perez Mamani" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cedula">Cedula de Identidad (CI)</label>
                <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} placeholder="Ej: 12345678" />
              </div>
              <div className="form-group">
                <label htmlFor="edad">Edad *</label>
                <input type="number" id="edad" name="edad" value={formData.edad} onChange={handleChange} required min="16" max="80" placeholder="Ej: 25" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telefono">Celular / WhatsApp *</label>
                <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="+591 70000000" />
              </div>
              <div className="form-group">
                <label htmlFor="correo">Correo Electronico *</label>
                <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required placeholder="tucorreo@ejemplo.com" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ciudad">Ciudad *</label>
                <select id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} required>
                  <option value="">Selecciona tu ciudad</option>
                  {ciudadesBolivia.map(ciudad => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ciudad_zona">Zona / Barrio</label>
                <input type="text" id="ciudad_zona" name="ciudad_zona" value={formData.ciudad_zona} onChange={handleChange} placeholder="Ej: Sopocachi, Plan 3000..." />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cargo">Ocupacion / Profesion *</label>
              <input type="text" id="cargo" name="cargo" value={formData.cargo} onChange={handleChange} required placeholder="Ej: Ingeniero, Estudiante, Empresario..." />
            </div>
          </fieldset>

          {/* ─── SECCION 2: INFORMACION ACADEMICA / INTERES ─── */}
          <fieldset className="form-section">
            <legend>Informacion Academica y de Interes</legend>

            <div className="form-group">
              <label htmlFor="experiencia_previa">Tienes experiencia previa en trading? *</label>
              <select id="experiencia_previa" name="experiencia_previa" value={formData.experiencia_previa} onChange={handleChange} required>
                <option value="">Selecciona una opcion</option>
                <option value="si">Si</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mercados_operados">Que mercados has operado o te interesan?</label>
              <select id="mercados_operados" name="mercados_operados" value={formData.mercados_operados} onChange={handleChange}>
                <option value="">Selecciona una opcion</option>
                <option value="forex">Forex (divisas)</option>
                <option value="crypto">Criptomonedas</option>
                <option value="ambos">Ambos</option>
                <option value="ninguno">Ninguno todavia</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nivel_trading">Cual es tu nivel actual en trading?</label>
              <select id="nivel_trading" name="nivel_trading" value={formData.nivel_trading} onChange={handleChange}>
                <option value="">Selecciona tu nivel</option>
                <option value="ninguna">No se nada, quiero aprender desde cero</option>
                <option value="basico">Se algo, pero nunca he operado</option>
                <option value="intermedio">He operado, pero sin estrategia clara</option>
                <option value="avanzado">Tengo experiencia pero quiero mejorar</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="objetivo_curso">Que esperas lograr con este curso?</label>
              <textarea id="objetivo_curso" name="objetivo_curso" value={formData.objetivo_curso} onChange={handleChange} rows="3" placeholder="Ej: Aprender a generar ingresos con trading, entender los mercados financieros..." />
            </div>
          </fieldset>

          {/* ─── SECCION 3: PREFERENCIAS ─── */}
          <fieldset className="form-section">
            <legend>Preferencias</legend>

            <div className="form-group">
              <label htmlFor="horario_preferido">Horario preferido para clases *</label>
              <select id="horario_preferido" name="horario_preferido" value={formData.horario_preferido} onChange={handleChange} required>
                <option value="">Selecciona un horario</option>
                <option value="manana">Manana (8:00 - 12:00)</option>
                <option value="tarde">Tarde (14:00 - 18:00)</option>
                <option value="noche">Noche (19:00 - 22:00)</option>
              </select>
              <span className="form-hint">Cupos limitados: 15 por horario</span>
            </div>

            <div className="form-group">
              <label htmlFor="como_se_entero">Como te enteraste de nosotros?</label>
              <select id="como_se_entero" name="como_se_entero" value={formData.como_se_entero} onChange={handleChange}>
                <option value="">Selecciona una opcion</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="amigo">Recomendacion de un amigo</option>
                <option value="google">Busqueda en Google</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </fieldset>

          {/* ─── SECCION 4: OBSERVACIONES ─── */}
          <fieldset className="form-section">
            <legend>Observaciones</legend>

            <div className="form-group">
              <label htmlFor="observaciones">Comentarios o preguntas adicionales</label>
              <textarea id="observaciones" name="observaciones" value={formData.observaciones} onChange={handleChange} rows="3" placeholder="Si tienes alguna consulta o comentario, escribelo aqui..." />
            </div>

            <label className="consent-label">
              <input type="checkbox" name="acepta_terminos" checked={formData.acepta_terminos} onChange={handleChange} />
              <span>Acepto que mis datos sean utilizados con fines educativos y de contacto por parte de Bull & Bear Trading Academy.</span>
            </label>
          </fieldset>

          {submitStatus === 'error' && (
            <div className="error-msg">
              Ocurrio un error. Por favor intenta nuevamente.
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Formulario'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
