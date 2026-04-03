const API_URL = 'http://localhost:8000/api';

export const api = {
  // ─── PUBLICO ──────────────────────────────
  async crearRegistro(data) {
    const res = await fetch(`${API_URL}/registro/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error al registrar');
    return json;
  },

  // ─── ADMIN AUTH ───────────────────────────
  async login(username, password) {
    const res = await fetch(`${API_URL}/admin/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Credenciales incorrectas');
    return json;
  },

  // ─── ADMIN: Listar ────────────────────────
  async listarRegistros(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/registros/?${query}`, {
      headers: { 'Authorization': `Token ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error al cargar');
    return json;
  },

  // ─── ADMIN: Eliminar ─────────────────────
  async eliminarRegistro(token, id) {
    const res = await fetch(`${API_URL}/admin/registros/${id}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` },
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message || 'Error al eliminar');
    }
    return true;
  },

  // ─── ADMIN: Cambiar estado ────────────────
  async cambiarEstado(token, id, data) {
    const res = await fetch(`${API_URL}/admin/registros/${id}/estado/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error al cambiar estado');
    return json;
  },

  // ─── ADMIN: Gestionar pago ────────────────
  async gestionarPago(token, id, data) {
    const res = await fetch(`${API_URL}/admin/registros/${id}/pago/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error al actualizar pago');
    return json;
  },

  // ─── ADMIN: Stats ────────────────────────
  async estadisticas(token) {
    const res = await fetch(`${API_URL}/admin/stats/`, {
      headers: { 'Authorization': `Token ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error al cargar stats');
    return json;
  },
};
