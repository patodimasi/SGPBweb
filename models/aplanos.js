var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var aplanos_schema = new Schema({
    
    PLN_FECHA: {type: String},
    PLN_CODIGO: {type: String},
    PLN_DESCRIPCION: {type: String},
    PLN_NRO_REV: {type: Number},
    PLN_ESTADO: {type:String},
    PLN_USUARIO_ALTA: {type: String},
    PLN_USUARIO_APR: {type: String},
    PLN_FECHA_APR: {type: String},
    PLN_FECHA_REC: {type: String},
    PLN_USUARIO_REC: {type: String}
  
})
    module.exports = mongoose.model("aplanos",aplanos_schema);