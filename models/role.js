import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const RoleSchema = new Schema({
  rol: {
    type: String,
    required: [true, 'El rol es obligatorio'],
  },
});

export const Role = model('Role', RoleSchema);
