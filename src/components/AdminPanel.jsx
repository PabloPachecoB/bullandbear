import { useState, useEffect, useRef } from 'react';
import { api } from '../config/api';
import './AdminPanel.css';

function AdminPanel() {
  const [registros, setRegistros] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [sortField, setSortField] = useState('fecha');
  const [sortDir, setSortDir] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [whatsappMenu, setWhatsappMenu] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [stats, setStats] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Modal inscribir
  const [inscribirModal, setInscribirModal] = useState(null);
  const [tipoPago, setTipoPago] = useState('');
  const [comprobantePreview, setComprobantePreview] = useState(null);
  const [comprobanteBase64, setComprobanteBase64] = useState(null);
  const [inscribiendoId, setInscribiendoId] = useState(null);
  // Modal gestionar estudiante
  const [gestionModal, setGestionModal] = useState(null);
  const [gestionTab, setGestionTab] = useState('pago');
  const [gestionEdit, setGestionEdit] = useState({});
  const [gestionComp2Preview, setGestionComp2Preview] = useState(null);
  const [gestionComp2Base64, setGestionComp2Base64] = useState(null);
  const [gestionSaving, setGestionSaving] = useState(false);
  // Lightbox comprobante
  const [lightboxImg, setLightboxImg] = useState(null);
  const dropdownRef = useRef(null);

  const mensajes = [
    { label: 'Bienvenida', icon: '👋', mensaje: (r) => `Hola ${r.nombres}! 👋 Gracias por registrarte en Bull & Bear Trading Academy. Estamos emocionados de que quieras aprender trading con nosotros. ¿Te gustaria recibir mas informacion sobre nuestro programa?` },
    { label: 'Info del programa', icon: '📊', mensaje: (r) => `Hola ${r.nombres}! 📊 Te escribimos de Bull & Bear Trading Academy. Tenemos un programa completo de trading que incluye analisis tecnico, gestion de riesgo y psicologia del trader. ¿Te gustaria conocer los detalles y costos?` },
    { label: 'Invitar a clase', icon: '🎓', mensaje: (r) => `Hola ${r.nombres}! 🎓 Soy de Bull & Bear Academy. Queremos invitarte a una clase gratuita de introduccion al trading. ¿Te interesa participar? Te compartimos los detalles.` },
    { label: 'Seguimiento', icon: '🔄', mensaje: (r) => `Hola ${r.nombres}! 👋 Te escribimos de Bull & Bear Academy. Vimos que te registraste hace unos dias. ¿Tienes alguna duda sobre nuestro programa de trading? Estamos para ayudarte.` },
    { label: 'Promocion', icon: '🔥', mensaje: (r) => `Hola ${r.nombres}! 🔥 En Bull & Bear Academy tenemos una promocion especial para nuevos estudiantes. ¿Te gustaria conocer los detalles? Cupos limitados!` },
  ];

  const formatPhone = (phone) => {
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('591')) return cleaned;
    if (cleaned.length === 8) return '591' + cleaned;
    return cleaned;
  };

  const sendWhatsApp = (reg, mensaje) => {
    const phone = formatPhone(reg.telefono);
    const text = encodeURIComponent(mensaje(reg));
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setWhatsappMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setWhatsappMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadRegistros();
      loadStats();
    }
  }, [isAuthenticated, token]);

  const loadRegistros = async () => {
    setLoading(true);
    try {
      const data = await api.listarRegistros(token);
      setRegistros(data.registros || []);
    } catch (error) {
      console.error('Error cargando registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.estadisticas(token);
      setStats(data);
    } catch (error) {
      console.error('Error cargando stats:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await api.login(username.trim(), password);
      setToken(data.token);
      setIsAuthenticated(true);
    } catch (error) {
      setLoginError(error.message);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUsername('');
    setPassword('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este registro?')) return;
    try {
      await api.eliminarRegistro(token, id);
      setRegistros(prev => prev.filter(r => r.id !== id));
      loadStats();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const openInscribirModal = (reg) => {
    setInscribirModal(reg);
    setTipoPago('');
    setComprobantePreview(null);
    setComprobanteBase64(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setComprobanteBase64(reader.result); setComprobantePreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const confirmarInscripcion = async () => {
    if (!tipoPago) { alert('Selecciona el tipo de pago'); return; }
    setInscribiendoId(inscribirModal.id);
    try {
      const result = await api.cambiarEstado(token, inscribirModal.id, {
        estado: 'inscrito', tipo_pago: tipoPago, comprobante_pago: comprobanteBase64 || null,
      });
      setRegistros(prev => prev.map(r => r.id === inscribirModal.id ? result.registro : r));
      setInscribirModal(null);
      loadStats();
    } catch (error) { alert('Error: ' + error.message); }
    finally { setInscribiendoId(null); }
  };

  const revertirAInteresado = async (id) => {
    if (!window.confirm('Revertir a interesado? Se eliminaran los comprobantes.')) return;
    try {
      const result = await api.cambiarEstado(token, id, { estado: 'interesado' });
      setRegistros(prev => prev.map(r => r.id === id ? result.registro : r));
      loadStats();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const openGestionModal = (reg) => {
    setGestionModal(reg);
    setGestionTab('pago');
    setGestionEdit({
      nombres: reg.nombres, apellidos: reg.apellidos, correo: reg.correo,
      telefono: reg.telefono, ciudad: reg.ciudad, ciudad_zona: reg.ciudad_zona || '',
      edad: reg.edad, cargo: reg.cargo, cedula: reg.cedula || '',
      horario_preferido: reg.horario_preferido || '', observaciones: reg.observaciones || '',
    });
    setGestionComp2Preview(reg.comprobante_pago_2 || null);
    setGestionComp2Base64(null);
  };

  const handleGestionEditChange = (e) => {
    const { name, value } = e.target;
    setGestionEdit(prev => ({ ...prev, [name]: value }));
  };

  const handleComp2FileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setGestionComp2Base64(reader.result); setGestionComp2Preview(reader.result); };
    reader.readAsDataURL(file);
  };

  const guardarGestionPago = async (nuevoTipoPago) => {
    setGestionSaving(true);
    try {
      const payload = {};
      if (nuevoTipoPago) payload.tipo_pago = nuevoTipoPago;
      if (gestionComp2Base64) payload.comprobante_pago_2 = gestionComp2Base64;
      const result = await api.gestionarPago(token, gestionModal.id, payload);
      setRegistros(prev => prev.map(r => r.id === gestionModal.id ? result.registro : r));
      setGestionModal(result.registro);
      setGestionComp2Base64(null);
      loadStats();
    } catch (error) { alert('Error: ' + error.message); }
    finally { setGestionSaving(false); }
  };

  const guardarGestionInfo = async () => {
    setGestionSaving(true);
    try {
      const result = await api.gestionarPago(token, gestionModal.id, gestionEdit);
      setRegistros(prev => prev.map(r => r.id === gestionModal.id ? result.registro : r));
      setGestionModal(result.registro);
      setGestionEdit({
        nombres: result.registro.nombres, apellidos: result.registro.apellidos,
        correo: result.registro.correo, telefono: result.registro.telefono,
        ciudad: result.registro.ciudad, ciudad_zona: result.registro.ciudad_zona || '',
        edad: result.registro.edad, cargo: result.registro.cargo,
        cedula: result.registro.cedula || '', horario_preferido: result.registro.horario_preferido || '',
        observaciones: result.registro.observaciones || '',
      });
    } catch (error) { alert('Error: ' + error.message); }
    finally { setGestionSaving(false); }
  };

  const mercadoLabel = (val) => ({ forex: 'Forex', crypto: 'Crypto', ambos: 'Ambos', ninguno: 'Ninguno' }[val] || val || 'N/A');
  const horarioLabel = (val) => ({ manana: 'Manana (8-12)', tarde: 'Tarde (14-18)', noche: 'Noche (19-22)' }[val] || val || 'N/A');
  const expLabel = (val) => ({ ninguna: 'Nuevo', basico: 'Basico', intermedio: 'Intermedio', avanzado: 'Avanzado' }[val] || 'N/A');

  const timeAgo = (fecha) => {
    if (!fecha) return 'N/A';
    const diff = Date.now() - new Date(fecha).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `hace ${days}d`;
    return new Date(fecha).toLocaleDateString('es-BO');
  };

  const exportCSV = (list) => {
    const headers = ['Nombres', 'Apellidos', 'CI', 'Correo', 'Telefono', 'Ciudad', 'Zona', 'Edad', 'Cargo', 'Nivel', 'Horario', 'Estado', 'Tipo Pago', 'Fecha'];
    const rows = list.map(r => [
      r.nombres, r.apellidos, r.cedula, r.correo, r.telefono, r.ciudad, r.ciudad_zona,
      r.edad, r.cargo, r.nivel_trading || r.experiencia, r.horario_preferido,
      r.estado, r.tipo_pago, new Date(r.fecha).toLocaleDateString('es-BO')
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeSection}_bullandbear_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cities = [...new Set(registros.map(r => r.ciudad).filter(Boolean))];
  const interesados = registros.filter(r => (r.estado || 'interesado') === 'interesado');
  const inscritos = registros.filter(r => r.estado === 'inscrito');

  const getListForSection = () => {
    if (activeSection === 'interesados') return interesados;
    if (activeSection === 'inscritos') return inscritos;
    return [];
  };

  const filteredRegistros = getListForSection()
    .filter(r => {
      const matchSearch = searchTerm === '' ||
        `${r.nombres} ${r.apellidos} ${r.correo} ${r.telefono} ${r.cargo}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCity = filterCity === '' || r.ciudad === filterCity;
      return matchSearch && matchCity;
    })
    .sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (sortField === 'fecha') { valA = new Date(valA).getTime(); valB = new Date(valB).getTime(); }
      if (sortField === 'edad') { valA = Number(valA); valB = Number(valB); }
      if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB.toLowerCase(); }
      return sortDir === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sortIcon = (field) => sortField !== field ? '' : (sortDir === 'asc' ? ' ↑' : ' ↓');

  const navigateTo = (section) => {
    setActiveSection(section);
    setSearchTerm('');
    setFilterCity('');
    setSidebarOpen(false);
  };

  // ─── LOGIN ────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="admin-page">
        <section className="admin-login" aria-label="Inicio de sesion">
          <div className="login-icon">🔐</div>
          <h1>Panel de Administracion</h1>
          <p>Ingresa tus credenciales para acceder</p>
          <form onSubmit={handleLogin} className="login-form">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" autoFocus aria-label="Usuario" required />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contrasena" aria-label="Contrasena" required />
            <label className="show-pass">
              <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
              Mostrar contrasena
            </label>
            {loginError && <div className="login-error">{loginError}</div>}
            <button type="submit">Ingresar</button>
          </form>
        </section>
      </main>
    );
  }

  // ─── Render table/cards (shared between interesados & inscritos) ───
  const renderList = () => {
    const isInscritos = activeSection === 'inscritos';

    return (
      <>
        <section className="admin-filters" aria-label="Filtros">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input type="search" placeholder="Buscar por nombre, correo, telefono..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
          </div>
          <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="filter-select">
            <option value="">Todas las ciudades</option>
            {cities.map(city => (<option key={city} value={city}>{city}</option>))}
          </select>
          <button className="action-btn export" onClick={() => exportCSV(filteredRegistros)} disabled={filteredRegistros.length === 0}>
            <span className="btn-icon">📥</span><span className="btn-text">CSV</span>
          </button>
        </section>

        {loading ? (
          <div className="empty-state"><div className="spinner"></div><p>Cargando...</p></div>
        ) : filteredRegistros.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{isInscritos ? '🎓' : '📭'}</div>
            <p>{getListForSection().length === 0 ? (isInscritos ? 'No hay estudiantes inscritos.' : 'No hay interesados.') : 'Sin resultados.'}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('nombres')}>Nombre{sortIcon('nombres')}</th>
                    <th onClick={() => handleSort('correo')}>Contacto{sortIcon('correo')}</th>
                    <th onClick={() => handleSort('ciudad')}>Ciudad{sortIcon('ciudad')}</th>
                    <th onClick={() => handleSort('edad')}>Edad{sortIcon('edad')}</th>
                    <th onClick={() => handleSort('cargo')}>Cargo{sortIcon('cargo')}</th>
                    <th onClick={() => handleSort('nivel_trading')}>Nivel{sortIcon('nivel_trading')}</th>
                    <th onClick={() => handleSort('horario_preferido')}>Horario{sortIcon('horario_preferido')}</th>
                    {isInscritos && <th>Pago</th>}
                    <th onClick={() => handleSort('fecha')}>Fecha{sortIcon('fecha')}</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistros.map((reg) => (
                    <tr key={reg.id}>
                      <td><div className="cell-name"><strong>{reg.nombres} {reg.apellidos}</strong>{reg.como_se_entero && <span className="cell-source">via {reg.como_se_entero}</span>}</div></td>
                      <td><div className="cell-contact"><a href={`mailto:${reg.correo}`}>{reg.correo}</a><a href={`tel:${reg.telefono}`} className="cell-phone">{reg.telefono}</a></div></td>
                      <td><div className="cell-city"><span>{reg.ciudad}</span>{reg.ciudad_zona && <span className="cell-zona">{reg.ciudad_zona}</span>}</div></td>
                      <td>{reg.edad}</td>
                      <td>{reg.cargo}</td>
                      <td><span className={`badge ${reg.nivel_trading || reg.experiencia || 'ninguna'}`}>{expLabel(reg.nivel_trading || reg.experiencia)}</span></td>
                      <td>{horarioLabel(reg.horario_preferido)}</td>
                      {isInscritos && (
                        <td><div className="cell-pago"><span className={`badge-pago ${reg.tipo_pago}`}>{reg.tipo_pago === 'completo' ? '100%' : '50%'}</span>
                          {reg.comprobante_pago && <button className="ver-comprobante-btn" onClick={() => setLightboxImg(reg.comprobante_pago)} title="Comprobante 1">📎1</button>}
                          {reg.comprobante_pago_2 && <button className="ver-comprobante-btn" onClick={() => setLightboxImg(reg.comprobante_pago_2)} title="Comprobante 2">📎2</button>}
                        </div></td>
                      )}
                      <td><time dateTime={reg.fecha} title={new Date(reg.fecha).toLocaleString('es-BO')}>{timeAgo(reg.fecha)}</time></td>
                      <td className="actions-cell" ref={whatsappMenu === reg.id ? dropdownRef : null}>
                        <div className="action-buttons">
                          {!isInscritos && <button className="inscribir-btn" onClick={() => openInscribirModal(reg)} title="Inscribir">✅</button>}
                          {isInscritos && <button className="gestionar-btn" onClick={() => openGestionModal(reg)} title="Gestionar">⚙️</button>}
                          <button className="wa-btn" onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setMenuPos({ top: rect.bottom + 4, left: Math.min(rect.left, window.innerWidth - 240) }); setWhatsappMenu(whatsappMenu === reg.id ? null : reg.id); }} title="WhatsApp">💬</button>
                          <button className="del-btn" onClick={() => handleDelete(reg.id)} title="Eliminar">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* WhatsApp dropdown */}
            {whatsappMenu && filteredRegistros.find(r => r.id === whatsappMenu) && (() => {
              const reg = filteredRegistros.find(r => r.id === whatsappMenu);
              return (
                <div className="wa-dropdown-fixed" ref={dropdownRef} role="menu" style={{ top: menuPos.top, left: menuPos.left }}>
                  <div className="wa-dropdown-head">Mensaje a {reg.nombres}</div>
                  {mensajes.map((msg, i) => (<button key={i} className="wa-dropdown-item" role="menuitem" onClick={() => sendWhatsApp(reg, msg.mensaje)}><span>{msg.icon}</span> {msg.label}</button>))}
                  <button className="wa-dropdown-item wa-custom" role="menuitem" onClick={() => { window.open(`https://wa.me/${formatPhone(reg.telefono)}`, '_blank'); setWhatsappMenu(null); }}>✏️ Personalizado...</button>
                </div>
              );
            })()}

            {/* Mobile Cards */}
            <div className="cards-list" role="list">
              {filteredRegistros.map((reg) => (
                <article key={reg.id} className={`contact-card ${expandedCard === reg.id ? 'expanded' : ''}`} role="listitem">
                  <div className="card-main" onClick={() => setExpandedCard(expandedCard === reg.id ? null : reg.id)}>
                    <div className={`card-avatar ${reg.estado === 'inscrito' ? 'inscrito' : ''}`}>{reg.nombres.charAt(0)}{reg.apellidos.charAt(0)}</div>
                    <div className="card-info">
                      <h3>{reg.nombres} {reg.apellidos}</h3>
                      <p className="card-meta">{reg.ciudad} · {reg.edad} anos · {reg.cargo}</p>
                    </div>
                    <div className="card-time">
                      <time dateTime={reg.fecha}>{timeAgo(reg.fecha)}</time>
                      {isInscritos ? <span className={`badge-pago ${reg.tipo_pago}`}>{reg.tipo_pago === 'completo' ? '100%' : '50%'}</span>
                        : <span className={`badge ${reg.nivel_trading || reg.experiencia || 'ninguna'}`}>{expLabel(reg.nivel_trading || reg.experiencia)}</span>}
                    </div>
                  </div>
                  {expandedCard === reg.id && (
                    <div className="card-details">
                      <div className="card-detail-row"><span className="detail-label">Correo</span><a href={`mailto:${reg.correo}`}>{reg.correo}</a></div>
                      <div className="card-detail-row"><span className="detail-label">Telefono</span><a href={`tel:${reg.telefono}`}>{reg.telefono}</a></div>
                      {reg.cedula && <div className="card-detail-row"><span className="detail-label">CI</span><span>{reg.cedula}</span></div>}
                      {reg.ciudad_zona && <div className="card-detail-row"><span className="detail-label">Zona</span><span>{reg.ciudad_zona}</span></div>}
                      {reg.horario_preferido && <div className="card-detail-row"><span className="detail-label">Horario</span><span>{horarioLabel(reg.horario_preferido)}</span></div>}
                      {reg.objetivo_curso && <div className="card-detail-row"><span className="detail-label">Objetivo</span><span>{reg.objetivo_curso}</span></div>}
                      {reg.observaciones && <div className="card-detail-row"><span className="detail-label">Obs.</span><span>{reg.observaciones}</span></div>}
                      <div className="card-actions">
                        {!isInscritos && <button className="card-inscribir-btn" onClick={() => openInscribirModal(reg)}>✅ Inscribir</button>}
                        {isInscritos && <button className="card-gestionar-btn" onClick={() => openGestionModal(reg)}>⚙️ Gestionar</button>}
                        <button className="card-wa-btn" onClick={() => setWhatsappMenu(whatsappMenu === reg.id ? null : reg.id)}>💬 WhatsApp</button>
                        <button className="card-del-btn" onClick={() => handleDelete(reg.id)}>🗑 Eliminar</button>
                      </div>
                      {whatsappMenu === reg.id && (
                        <div className="card-wa-menu" ref={dropdownRef} role="menu">
                          {mensajes.map((msg, i) => (<button key={i} role="menuitem" onClick={() => sendWhatsApp(reg, msg.mensaje)}>{msg.icon} {msg.label}</button>))}
                          <button role="menuitem" onClick={() => { window.open(`https://wa.me/${formatPhone(reg.telefono)}`, '_blank'); setWhatsappMenu(null); }}>✏️ Personalizado...</button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  // ─── DASHBOARD CONTENT ────
  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="dash-stats-grid">
        <article className="dash-stat-card total">
          <div className="dash-stat-icon">📊</div>
          <div className="dash-stat-body">
            <span className="dash-stat-value">{stats?.total ?? registros.length}</span>
            <span className="dash-stat-label">Total Registros</span>
          </div>
        </article>
        <article className="dash-stat-card interesados" onClick={() => navigateTo('interesados')} style={{ cursor: 'pointer' }}>
          <div className="dash-stat-icon">📋</div>
          <div className="dash-stat-body">
            <span className="dash-stat-value">{stats?.interesados ?? interesados.length}</span>
            <span className="dash-stat-label">Interesados</span>
          </div>
        </article>
        <article className="dash-stat-card inscritos" onClick={() => navigateTo('inscritos')} style={{ cursor: 'pointer' }}>
          <div className="dash-stat-icon">🎓</div>
          <div className="dash-stat-body">
            <span className="dash-stat-value">{stats?.inscritos ?? inscritos.length}</span>
            <span className="dash-stat-label">Inscritos</span>
          </div>
        </article>
        <article className="dash-stat-card">
          <div className="dash-stat-icon">📅</div>
          <div className="dash-stat-body">
            <span className="dash-stat-value">{stats?.esta_semana ?? 0}</span>
            <span className="dash-stat-label">Esta Semana</span>
          </div>
        </article>
      </div>

      <div className="dash-row">
        <div className="dash-card">
          <h3>Pagos</h3>
          <div className="dash-pago-summary">
            <div className="dash-pago-item"><span className="dash-pago-dot completo"></span><span>Pago Completo</span><strong>{stats?.pago_completo ?? 0}</strong></div>
            <div className="dash-pago-item"><span className="dash-pago-dot parcial"></span><span>Pago 50%</span><strong>{stats?.pago_50 ?? 0}</strong></div>
          </div>
        </div>
        <div className="dash-card">
          <h3>Ciudades principales</h3>
          <div className="dash-city-list">
            {(stats?.por_ciudad || []).slice(0, 5).map((c, i) => (
              <div key={i} className="dash-city-item">
                <span>{c.ciudad}</span>
                <div className="dash-city-bar-wrap">
                  <div className="dash-city-bar" style={{ width: `${Math.min(100, (c.total / (stats?.total || 1)) * 100)}%` }}></div>
                </div>
                <strong>{c.total}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-card">
        <h3>Ultimos registros</h3>
        <div className="dash-recent-list">
          {registros.slice(0, 5).map(r => (
            <div key={r.id} className="dash-recent-item">
              <div className={`dash-recent-avatar ${r.estado === 'inscrito' ? 'inscrito' : ''}`}>{r.nombres.charAt(0)}{r.apellidos.charAt(0)}</div>
              <div className="dash-recent-info">
                <span className="dash-recent-name">{r.nombres} {r.apellidos}</span>
                <span className="dash-recent-meta">{r.ciudad} · {r.cargo}</span>
              </div>
              <div className="dash-recent-right">
                <span className={`badge-estado ${r.estado || 'interesado'}`}>{r.estado === 'inscrito' ? 'Inscrito' : 'Interesado'}</span>
                <time>{timeAgo(r.fecha)}</time>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── MAIN LAYOUT ─────────────────────────────────
  return (
    <main className="admin-page">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo">B&B</span>
          <span className="sidebar-title">Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          <button className={`sidebar-link ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => navigateTo('dashboard')}>
            <span className="sidebar-link-icon">📊</span> Dashboard
          </button>
          <button className={`sidebar-link ${activeSection === 'interesados' ? 'active' : ''}`} onClick={() => navigateTo('interesados')}>
            <span className="sidebar-link-icon">📋</span> Interesados
            <span className="sidebar-badge">{interesados.length}</span>
          </button>
          <button className={`sidebar-link ${activeSection === 'inscritos' ? 'active' : ''}`} onClick={() => navigateTo('inscritos')}>
            <span className="sidebar-link-icon">🎓</span> Estudiantes
            <span className="sidebar-badge green">{inscritos.length}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={() => { loadRegistros(); loadStats(); }}>
            <span className="sidebar-link-icon">🔄</span> Actualizar
          </button>
          <button className="sidebar-link logout" onClick={handleLogout}>
            <span className="sidebar-link-icon">🚪</span> Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <header className="main-topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="topbar-title">
            {activeSection === 'dashboard' && 'Dashboard'}
            {activeSection === 'interesados' && 'Interesados'}
            {activeSection === 'inscritos' && 'Estudiantes Inscritos'}
          </h1>
          <div className="topbar-right">
            <span className="topbar-user">admin</span>
          </div>
        </header>

        <div className="main-content">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'interesados' && renderList()}
          {activeSection === 'inscritos' && renderList()}
        </div>
      </div>

      {/* ═══ MODAL: Confirmar Inscripcion ═══ */}
      {inscribirModal && (
        <div className="modal-overlay" onClick={() => setInscribirModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setInscribirModal(null)}>✕</button>
            <div className="modal-header"><div className="modal-icon">🎓</div><h2>Confirmar Inscripcion</h2><p>Inscribir a <strong>{inscribirModal.nombres} {inscribirModal.apellidos}</strong></p></div>
            <div className="modal-info">
              <div className="modal-info-row"><span>Telefono:</span><span>{inscribirModal.telefono}</span></div>
              <div className="modal-info-row"><span>Ciudad:</span><span>{inscribirModal.ciudad}</span></div>
              <div className="modal-info-row"><span>Horario:</span><span>{horarioLabel(inscribirModal.horario_preferido)}</span></div>
            </div>
            <div className="modal-field">
              <label>Tipo de pago *</label>
              <div className="pago-options">
                <label className={`pago-option ${tipoPago === 'completo' ? 'selected' : ''}`}><input type="radio" name="tipo_pago" value="completo" checked={tipoPago === 'completo'} onChange={(e) => setTipoPago(e.target.value)} /><div className="pago-option-content"><span className="pago-label">Curso Completo</span><span className="pago-desc">100%</span></div></label>
                <label className={`pago-option ${tipoPago === '50' ? 'selected' : ''}`}><input type="radio" name="tipo_pago" value="50" checked={tipoPago === '50'} onChange={(e) => setTipoPago(e.target.value)} /><div className="pago-option-content"><span className="pago-label">50% del Curso</span><span className="pago-desc">Parcial</span></div></label>
              </div>
            </div>
            <div className="modal-field">
              <label>Comprobante de pago</label>
              <div className="upload-area">
                <input type="file" accept="image/*" onChange={handleFileChange} id="comprobante-upload" className="file-input" />
                <label htmlFor="comprobante-upload" className="upload-label">
                  {comprobantePreview ? <img src={comprobantePreview} alt="Preview" className="upload-preview" />
                    : <div className="upload-placeholder"><span className="upload-icon">📷</span><span>Subir imagen</span><span className="upload-hint">JPG, PNG, WebP</span></div>}
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setInscribirModal(null)}>Cancelar</button>
              <button className="modal-confirm" onClick={confirmarInscripcion} disabled={!tipoPago || inscribiendoId === inscribirModal.id}>{inscribiendoId === inscribirModal.id ? 'Inscribiendo...' : 'Confirmar Inscripcion'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: Gestionar Estudiante ═══ */}
      {gestionModal && (
        <div className="modal-overlay" onClick={() => setGestionModal(null)}>
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setGestionModal(null)}>✕</button>
            <div className="modal-header"><div className="modal-icon">⚙️</div><h2>{gestionModal.nombres} {gestionModal.apellidos}</h2><p>Gestionar pago, comprobantes e informacion</p></div>
            <div className="gestion-tabs">
              <button className={`gestion-tab ${gestionTab === 'pago' ? 'active' : ''}`} onClick={() => setGestionTab('pago')}>Estado de Pago</button>
              <button className={`gestion-tab ${gestionTab === 'comprobantes' ? 'active' : ''}`} onClick={() => setGestionTab('comprobantes')}>Comprobantes</button>
              <button className={`gestion-tab ${gestionTab === 'info' ? 'active' : ''}`} onClick={() => setGestionTab('info')}>Editar Info</button>
            </div>

            {gestionTab === 'pago' && (
              <div className="gestion-section">
                <div className="pago-status-card">
                  <div className="pago-status-header"><span className="pago-status-label">Estado del pago</span><span className={`pago-status-badge ${gestionModal.tipo_pago}`}>{gestionModal.tipo_pago === 'completo' ? 'PAGADO 100%' : 'PAGADO 50%'}</span></div>
                  <div className="pago-progress"><div className={`pago-progress-bar ${gestionModal.tipo_pago}`}></div></div>
                  <div className="pago-progress-labels"><span>0%</span><span>50%</span><span>100%</span></div>
                </div>
                {gestionModal.fecha_inscripcion && <div className="pago-detail">Inscrito: <strong>{new Date(gestionModal.fecha_inscripcion).toLocaleDateString('es-BO')}</strong></div>}
                {gestionModal.tipo_pago === '50' && (
                  <div className="pago-pending-section">
                    <h3>Registrar segundo pago</h3>
                    <p>Sube el comprobante del 50% restante.</p>
                    <div className="upload-area">
                      <input type="file" accept="image/*" onChange={handleComp2FileChange} id="comp2-upload" className="file-input" />
                      <label htmlFor="comp2-upload" className="upload-label">{gestionComp2Base64 ? <img src={gestionComp2Base64} alt="Preview" className="upload-preview" /> : <div className="upload-placeholder"><span className="upload-icon">📷</span><span>Subir comprobante</span></div>}</label>
                    </div>
                    <button className="modal-confirm" style={{ marginTop: '1rem' }} onClick={() => guardarGestionPago('completo')} disabled={!gestionComp2Base64 || gestionSaving}>{gestionSaving ? 'Guardando...' : 'Confirmar pago completo'}</button>
                  </div>
                )}
                {gestionModal.tipo_pago === 'completo' && <div className="pago-complete-msg">Pago completo registrado.</div>}
                <div className="pago-manual-section">
                  <h4>Cambiar estado manualmente</h4>
                  <div className="pago-options" style={{ marginTop: '0.5rem' }}>
                    <label className={`pago-option ${gestionModal.tipo_pago === 'completo' ? 'selected' : ''}`}><input type="radio" name="g_pago" value="completo" checked={gestionModal.tipo_pago === 'completo'} onChange={() => guardarGestionPago('completo')} disabled={gestionSaving} /><div className="pago-option-content"><span className="pago-label">100%</span><span className="pago-desc">Completo</span></div></label>
                    <label className={`pago-option ${gestionModal.tipo_pago === '50' ? 'selected' : ''}`}><input type="radio" name="g_pago" value="50" checked={gestionModal.tipo_pago === '50'} onChange={() => guardarGestionPago('50')} disabled={gestionSaving} /><div className="pago-option-content"><span className="pago-label">50%</span><span className="pago-desc">Parcial</span></div></label>
                  </div>
                </div>
                <button className="revertir-full-btn" onClick={() => { revertirAInteresado(gestionModal.id); setGestionModal(null); }}>↩️ Revertir a interesado</button>
              </div>
            )}

            {gestionTab === 'comprobantes' && (
              <div className="gestion-section">
                <div className="comprobantes-grid">
                  <div className="comprobante-card">
                    <h4>Comprobante 1</h4>
                    {gestionModal.comprobante_pago ? <img src={gestionModal.comprobante_pago} alt="Comp 1" className="comprobante-img" onClick={() => setLightboxImg(gestionModal.comprobante_pago)} /> : <div className="comprobante-empty">Sin comprobante</div>}
                  </div>
                  <div className="comprobante-card">
                    <h4>Comprobante 2</h4>
                    {gestionModal.comprobante_pago_2 ? <img src={gestionModal.comprobante_pago_2} alt="Comp 2" className="comprobante-img" onClick={() => setLightboxImg(gestionModal.comprobante_pago_2)} />
                      : gestionModal.tipo_pago === '50' ? (
                        <div className="comprobante-empty">
                          <p>Pendiente</p>
                          <div className="upload-area" style={{ marginTop: '0.8rem' }}>
                            <input type="file" accept="image/*" onChange={handleComp2FileChange} id="comp2-tab" className="file-input" />
                            <label htmlFor="comp2-tab" className="upload-label">{gestionComp2Base64 ? <img src={gestionComp2Base64} alt="Preview" className="upload-preview" /> : <div className="upload-placeholder small"><span className="upload-icon">📷</span><span>Subir</span></div>}</label>
                          </div>
                          {gestionComp2Base64 && <button className="modal-confirm" style={{ marginTop: '0.8rem', width: '100%' }} onClick={() => guardarGestionPago('completo')} disabled={gestionSaving}>{gestionSaving ? 'Guardando...' : 'Guardar y marcar 100%'}</button>}
                        </div>
                      ) : <div className="comprobante-empty">Sin comprobante</div>}
                  </div>
                </div>
              </div>
            )}

            {gestionTab === 'info' && (
              <div className="gestion-section">
                <div className="edit-form">
                  <div className="edit-row"><div className="edit-field"><label>Nombres</label><input type="text" name="nombres" value={gestionEdit.nombres} onChange={handleGestionEditChange} /></div><div className="edit-field"><label>Apellidos</label><input type="text" name="apellidos" value={gestionEdit.apellidos} onChange={handleGestionEditChange} /></div></div>
                  <div className="edit-row"><div className="edit-field"><label>Correo</label><input type="email" name="correo" value={gestionEdit.correo} onChange={handleGestionEditChange} /></div><div className="edit-field"><label>Telefono</label><input type="tel" name="telefono" value={gestionEdit.telefono} onChange={handleGestionEditChange} /></div></div>
                  <div className="edit-row"><div className="edit-field"><label>Ciudad</label><input type="text" name="ciudad" value={gestionEdit.ciudad} onChange={handleGestionEditChange} /></div><div className="edit-field"><label>Zona</label><input type="text" name="ciudad_zona" value={gestionEdit.ciudad_zona} onChange={handleGestionEditChange} /></div></div>
                  <div className="edit-row"><div className="edit-field"><label>Edad</label><input type="number" name="edad" value={gestionEdit.edad} onChange={handleGestionEditChange} /></div><div className="edit-field"><label>CI</label><input type="text" name="cedula" value={gestionEdit.cedula} onChange={handleGestionEditChange} /></div></div>
                  <div className="edit-row"><div className="edit-field"><label>Cargo</label><input type="text" name="cargo" value={gestionEdit.cargo} onChange={handleGestionEditChange} /></div><div className="edit-field"><label>Horario</label><select name="horario_preferido" value={gestionEdit.horario_preferido} onChange={handleGestionEditChange}><option value="">Sin horario</option><option value="manana">Manana (8-12)</option><option value="tarde">Tarde (14-18)</option><option value="noche">Noche (19-22)</option></select></div></div>
                  <div className="edit-field full"><label>Observaciones</label><textarea name="observaciones" value={gestionEdit.observaciones} onChange={handleGestionEditChange} rows="3" /></div>
                  <button className="modal-confirm" style={{ marginTop: '1rem' }} onClick={guardarGestionInfo} disabled={gestionSaving}>{gestionSaving ? 'Guardando...' : 'Guardar cambios'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ LIGHTBOX ═══ */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
            <img src={lightboxImg} alt="Comprobante de pago" />
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminPanel;
