import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Mascota feliz',
  webDir: 'www',
  android: {
    allowMixedContent: true, // Habilita contenido mixto si uso recursos HTTP y HTTPS
    webContentsDebuggingEnabled: true, // Activa la depuración remota del contenido web
  },

  // Habilitar auto-configuración de plataforma para las diferentes plataformas
  bundledWebRuntime: false, // Evita incluir el runtime de Capacitor en el bundle para optimizar tamaño
  
  // Establecer un esquema de Deep Links (si lo usas)
  server: {
    androidScheme: 'https', // Configura el esquema de la URL para Android
    iosScheme: 'https', // Configura el esquema de la URL para iOS
    cleartext: true, // Si permites HTTP (sin HTTPS), ponlo a 'true'
  },

};

export default config;
