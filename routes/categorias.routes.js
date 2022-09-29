import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import {
  obtenerCategorias,
  obtenerCategoria,
  crearCateogria,
  actualizarCategoria,
  borrarCategoria,
} from '../controllers/categorias.js';
import { existeCategoriaPorId } from '../helpers/db-validators.js';
import { esAdminRole } from '../middlewares/validar-roles.js';

const router = Router();

router.get('/', obtenerCategorias);

router.get(
  '/:id',
  [check('id', 'No es un ID valido').isMongoId(), check('id').custom(existeCategoriaPorId), validarCampos],
  obtenerCategoria
);

router.post(
  '/',
  [validarJWT, check('nombre', 'El nombre es requerido').not().isEmpty(), validarCampos],
  crearCateogria
);

router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria
);

export default router;
