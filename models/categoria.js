import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CategoriaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },

  estado: {
    type: Boolean,
    default: true,
    required: true,
  },

  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
});

export const Categoria = model('Categoria', CategoriaSchema);
