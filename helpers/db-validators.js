import { Categoria } from '../models/categoria.js';
import { Producto } from '../models/producto.js';
import { Role } from '../models/role.js';
import { Usuario } from '../models/usuario.js';

const esRoleValido = async (rol = '') => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la base de datos`);
  }
};

const existeEmail = async (correo = '') => {
  const existeEmail = await Usuario.findOne({ correo });

  if (existeEmail) {
    throw new Error(`El correo ${correo} ya esta registrado`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El usuario con id ${id} no existe`);
  }
};

const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`La categoria con id ${id} no existe`);
  }
};

const existeProductoPorId = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El producto con id ${id} no existe`);
  }
};

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion);

  if (!incluida) {
    throw new Error(`La coleccion ${coleccion} no es permitida`);
  }

  return true;
};

export {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas,
};
