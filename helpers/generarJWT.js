import jwt from 'jsonwebtoken';
import { Usuario } from '../models/usuario.js';

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          reject('Hubo algun error con el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

const comprobarJWT = async (token = '') => {
  try {
    if (token.length < 10) {
      return null;
    }

    const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const usuario = await Usuario.findById(uid);

    if (usuario) {
      if (usuario.estado) {
        return usuario;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export { generarJWT, comprobarJWT };
