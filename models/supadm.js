var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var UseradmsSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    permission: {
        type: String
    },
    active: {
        type: String
    }
});


var Useradms = module.exports = mongoose.model("useradms", UseradmsSchema);
var ObjectId = require("mongodb").ObjectId;

// LISTA USUÁRIOS
module.exports.getallUseradms = function (sortBy, callback) {
    Useradms.find("", callback).sort({ sortBy: 1 });
};

// CADASTRA USUÁRIO
module.exports.createUseradms = function(newUseradms, callback){
    Useradms.findOne({ username:  newUseradms.username}, function(err,  document){
        if(err){
            return console.error(err);
        }else{
            // VERIFICA SE JÁ EXISTE USUÁRIO COM MESMO NOME DE USERNAME
            if(document != null){
                console.log("ja existe");
            }else{
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUseradms.password, salt, function(err, hash) {
                        newUseradms.password = hash;
                        newUseradms.save(callback);
                    });
                });
            }
        }
    });
};

// EXCLUI USUÁRIO
module.exports.deleteUseradms = function (id, callback) {
    Useradms.deleteOne({_id: new ObjectId(id)}, function (err, callback) {
        if (err) throw err;
        console.log("1 registro deletado");
    });
};

// EDITA USUÁRIO, LEVA REGISTROS PARA SEREM EDITADOS
module.exports.editRegUseradms = function (sortBy, id, callback) {
    Useradms.find(new ObjectId(id), callback);
};

module.exports.editUser = function (id, extUseradms, callback) {
    //Useradms.update(new ObjectId(id), extUseradms);
    Useradms.findByIdAndUpdate(id, extUseradms, callback);
};

