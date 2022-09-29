import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { esAdminRole } from '../middlewares/validar-roles.js';
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../controllers/productos.js';
import { existeProductoPorId } from '../helpers/db-validators.js';

const router = Router();

router.get('/', obtenerProductos);

router.get(
  '/:id',
  [check('id', 'No es un ID valido').isMongoId(), existeProductoPorId, validarCampos],
  obtenerProducto
);

router.post('/', [validarJWT, check('nombre', 'El nombre es requerido').not().isEmpty(), validarCampos], crearProducto);

router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    existeProductoPorId,
    validarCampos,
  ],
  actualizarProducto
);

router.delete(
  '/:id',
  [validarJWT, esAdminRole, check('id', 'No es un ID valido').isMongoId(), existeProductoPorId, validarCampos],
  eliminarProducto
);

export default router;
