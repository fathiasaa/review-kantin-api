
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Review Kantin API',
    version: '1.0.0',
  },

  servers: [
    { url: 'http://localhost:3000' },
  ],

  // Konfigurasi autentikasi JWT
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Masukkan Bearer diikuti spasi dan token JWT',
    },
  },

  definitions: {
    // Input untuk membuat warung
    StallInput: {
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: '',
    },

    // Input registrasi pengguna
    RegisterInput: {
      $name: 'Pengguna Baru',
      $email: 'pengguna@example.com',
      $password: 'ContohPassword123',
    },

    // Input login pengguna
    LoginInput: {
      $email: 'pengguna@example.com',
      $password: 'ContohPassword123',
    },
  },
};

const outputFile = './swagger-output.json';

const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
