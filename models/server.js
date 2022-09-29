import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';



import { default as routerUsuario } from '../routes/usuarios.routes.js';
import { default as routerAuth } from '../routes/auth.routes.js';
import { default as routerCategorias } from '../routes/categorias.routes.js';
import { default as routerProductos } from '../routes/productos.routes.js';
import { default as routerBuscar } from '../routes/buscar.routes.js';
import { default as routerUploads } from '../routes/uploads.routes.js';
import dbConnection from '../database/config.js';
import { socketController } from '../sockets/controller.js';

import { createServer } from 'http';
import { Server as ServerSocket } from 'socket.io';

class Server {
  constructor() {
    this.app = express(); // corriendo 8080
    this.port = process.env.PORT;

    this.server = createServer(this.app); // 8080
    this.io = new ServerSocket(this.server); // 8080

    this.paths = {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      categorias: '/api/categorias',
      productos: '/api/productos',
      buscar: '/api/buscar',
      uploads: '/api/uploads',
    };

    // Conectar a la BD
    this.conectarDB();

    // Middleware
    this.middlewares();

    // Rutas de aplicación
    this.routes();

    // Sockets
    this.sockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static('public'));

    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.usuarios, routerUsuario);
    this.app.use(this.paths.auth, routerAuth);
    this.app.use(this.paths.categorias, routerCategorias);
    this.app.use(this.paths.productos, routerProductos);
    this.app.use(this.paths.buscar, routerBuscar);
    this.app.use(this.paths.uploads, routerUploads);
  }

  sockets() {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('🚀 Corriendo en el puerto ', this.port);
      console.log('🧩 Conectado a la base de datos');
    });
  }
}

export default Server;
