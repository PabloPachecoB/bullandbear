import { supabase } from './supabase';

export const api = {
  // ─── PUBLICO: Crear registro ─────────────
  async crearRegistro(data) {
    const { data: registro, error } = await supabase
      .from('registros')
      .insert([{ ...data, estado: 'interesado', fecha: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error(error.message || 'Error al registrar');
    return registro;
  },

  // ─── ADMIN AUTH ───────────────────────────
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message || 'Credenciales incorrectas');
    return { token: data.session.access_token, user: data.user };
  },

  async logout() {
    await supabase.auth.signOut();
  },

  // ─── ADMIN: Listar registros ─────────────
  async listarRegistros() {
    const { data, error } = await supabase
      .from('registros')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw new Error(error.message || 'Error al cargar');
    return { registros: data || [] };
  },

  // ─── ADMIN: Eliminar registro ────────────
  async eliminarRegistro(_token, id) {
    const { error } = await supabase
      .from('registros')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message || 'Error al eliminar');
    return true;
  },

  // ─── ADMIN: Cambiar estado ───────────────
  async cambiarEstado(_token, id, data) {
    const updateData = { ...data };

    // Si revertimos a interesado, limpiar datos de pago
    if (data.estado === 'interesado') {
      updateData.tipo_pago = null;
      updateData.comprobante_pago = null;
      updateData.comprobante_pago_2 = null;
    }

    const { data: registro, error } = await supabase
      .from('registros')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Error al cambiar estado');
    return { registro };
  },

  // ─── ADMIN: Gestionar pago / editar info ──
  async gestionarPago(_token, id, data) {
    const { data: registro, error } = await supabase
      .from('registros')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || 'Error al actualizar');
    return { registro };
  },

  // ─── ADMIN: Estadisticas ─────────────────
  async estadisticas() {
    const { data, error } = await supabase
      .from('registros')
      .select('*');

    if (error) throw new Error(error.message || 'Error al cargar stats');

    const registros = data || [];
    const total = registros.length;
    const interesados = registros.filter(r => r.estado === 'interesado').length;
    const inscritos = registros.filter(r => r.estado === 'inscrito').length;

    // Registros de los ultimos 7 dias
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recientes = registros.filter(r => new Date(r.fecha) > weekAgo).length;

    // Ciudades mas frecuentes
    const ciudades = {};
    registros.forEach(r => {
      if (r.ciudad) ciudades[r.ciudad] = (ciudades[r.ciudad] || 0) + 1;
    });

    return {
      total,
      interesados,
      inscritos,
      recientes,
      ciudades,
    };
  },
};
