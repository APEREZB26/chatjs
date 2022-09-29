import jwt from 'jsonwebtoken';

import { Usuario } from '../models/usuario.js';

const validarJWT = async (req, res, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({ msg: 'No hay token en la petición' });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(401).json({ msg: 'El usuario no existe' });
    }

    if (!usuario.estado) {
      return res.status(401).json({ msg: 'Token no valido - usuario desactivado' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token no valido' });
  }
};

export { validarJWT };
