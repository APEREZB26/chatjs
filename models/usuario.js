import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },

  correo: {
    type: String,
    unique: true,
    required: [true, 'El correo es obligatorio'],
  },

  password: {
    type: String,
    required: [true, 'La contraseña es obligatorio'],
  },

  img: {
    type: String,
  },

  rol: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'],
  },

  estado: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
});

// Para eliminar el _v y password
UsuarioSchema.methods.toJSON = function() {
  const {__v, password, _id, ...usuario} = this.toObject();
  usuario.uid = _id;
  return usuario;
}

export const Usuario = model('Usuario', UsuarioSchema);
