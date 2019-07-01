var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usuarios_schema = new Schema({
    USR_CODIGO:{type: String},
    USR_NOMBRE:{type:String},
    USR_APELLIDO:{type: String},
    USR_LOGON:{type: String},
    USR_PASS:{type: String},
    USR_INICIAL: {type: String},
});

module.exports = mongoose.model("usuarios",usuarios_schema);