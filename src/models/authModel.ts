const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loginSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  account_type: { type: String, required: true },
  allowed_roles: [{ type: String, required: true, default: "" }],
  password_reset_request: { type: Boolean, default: 0 },
  password_reset_id: { type: String, required: false },
  time: { type: Date, default: Date.now },
  phone: { type: String, required: false, default: "" },
  whatsapp: { type: String, required: false, default: "" },
  address: { type: String, required: false, default: "" },
  country: { type: String, required: false, default: "" },
  childname: { type: String, required: false, default: "" },
  childage: { type: String, required: false, default: "" },
  rollyear: { type: String, required: false, default: "" },
  rollnumber: { type: Number, required: false, unique: true, default: "" },
  rollclass: { type: String, required: false, default: "GSTU" },
  batch: { type: String, required: false, default: "GStudent" },
});

export const LoginSchema =
  mongoose.models.LoginSchema || mongoose.model("LoginSchema", loginSchema);
