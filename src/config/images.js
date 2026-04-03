// Configuración centralizada de imágenes de alta calidad
// Parámetros de Unsplash:
// - w: ancho (2400px para pantallas 4K)
// - q: calidad (95 = alta calidad)
// - auto=format: optimización automática del formato (WebP cuando sea compatible)
// - fit=crop: recorte optimizado

export const images = {
  hero: {
    url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=2400&q=95&auto=format&fit=crop',
    alt: 'Starlink internet satelital en Bolivia',
    lowQuality: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=50&q=10&blur=50'
  },
  conexion: {
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=2400&q=95&auto=format&fit=crop',
    alt: 'Buses de turismo con internet Starlink',
    lowQuality: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=50&q=10&blur=50'
  },
  ventajas: {
    url: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=2400&q=95&auto=format&fit=crop',
    alt: 'Pasajeros disfrutando de WiFi en bus',
    lowQuality: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=50&q=10&blur=50'
  },
  instalacion: {
    url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=2400&q=95&auto=format&fit=crop',
    alt: 'Instalación de antena Starlink en vehículo',
    lowQuality: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=50&q=10&blur=50'
  },
  planes: {
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=2400&q=95&auto=format&fit=crop',
    alt: 'Flota de buses con Starlink',
    lowQuality: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=50&q=10&blur=50'
  },
  tecnologia: {
    url: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=2400&q=95&auto=format&fit=crop',
    alt: 'Tecnología satelital Starlink by SpaceX',
    lowQuality: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=50&q=10&blur=50'
  }
};

// Función helper para obtener diferentes tamaños de imagen
export const getImageUrl = (imageKey, width = 2400, quality = 95) => {
  const baseUrl = images[imageKey]?.url?.split('?')[0];
  if (!baseUrl) return '';
  return `${baseUrl}?w=${width}&q=${quality}&auto=format&fit=crop`;
};

// Función para precargar imágenes críticas
export const preloadCriticalImages = () => {
  const criticalImages = [images.hero.url];
  
  criticalImages.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};
