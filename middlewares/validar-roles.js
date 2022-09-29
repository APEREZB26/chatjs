import { response } from 'express';

const esAdminRole = (req, res, next) => {
  if (!req.usuario) {
    return res.status(500).json({ msg: 'Primero se debe verificar el token' });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== 'ADMIN_ROLE') {
    return res.status(401).json({ msg: `${nombre} no es administrador - No puede realizar la acción` });
  }

  next();
};

const tieneRole = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ msg: `Se debe verigicar el role sin enviar token` });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({ msg: `El servicio requiere uno de estos roles ${roles}` });
    }

    next();
  };
};

export { esAdminRole, tieneRole };
