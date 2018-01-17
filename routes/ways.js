var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Useradms = require('../models/supadm');
var User = require('../models/user');

// AUTENTICAÇÃO DE PÁGINA
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','Você não esta logado!');
        res.redirect('/users/login');
    }
}


// GET CLIENTES
router.get('/clientes', ensureAuthenticated, function(req, res){
    res.render('clientes');
});

// GET PRODUTOS
router.get('/produtos', ensureAuthenticated, function(req, res){
    res.render('produtos');
});




/*
   * SUPORTE / ADMINISTRADOR
*/


// GET SUPORTE / ADMIN -> LISTAGEM
router.get('/supadm', ensureAuthenticated, function (req, res) {
    Useradms.getallUseradms("title", function(err, useradms){
        if(err){
            res.render('supadm', { error: err });
        }
        else if(useradms){
            res.render("supadm", { useradms: useradms })
        }
    })
})


// GET CAD_SUPADM -> CRIAR USUÁRIO
router.get('/cad_supadm', ensureAuthenticated, function(req, res){
    res.render('cad_supadm');
});

// POST CAD_SUPADM -> CRIAR USUÁRIO
router.post('/cad_supadm', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var permission = req.body.permission;
    var active = req.body.active;

    // Validation
    req.checkBody('name', 'Nome Obrigatório').notEmpty();
    req.checkBody('email', 'Email Obrigatório').notEmpty();
    req.checkBody('email', 'Email não valido').isEmail();
    req.checkBody('username', 'Nome de usuário requerido').notEmpty();
    req.checkBody('password', 'Senha requerida').notEmpty();
    req.checkBody('password2', 'Senhas não correspondem').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('cad_supadm',{
            errors:errors
        });
    } else {
        var newUseradms = new Useradms({
            name: name,
            email:email,
            username: username,
            password: password,
            permission: permission,
            active: active
        });

        Useradms.createUseradms(newUseradms, function(err, user){
            if(err) throw err;
            console.log(user);
        });


        req.flash('success_msg', 'Usuário cadastrado e ativo!');
        res.redirect('/ways/cad_supadm');
    }
});


// DELETAR USUARIO
router.get('/delete/:id', function(req, res) {
    var id = req.params.id;
    Useradms.deleteUseradms(id);

    req.flash('success_msg', 'Usuário deletado com sucesso!');
    res.redirect('/ways/supadm');
});





// EDITAR USUÁRIO
router.get('/edi_supadm/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;

    Useradms.editRegUseradms("title", id, function(err, useradms){
        if(err){
            res.render('edi_supadm', { error: err });
        }
        else if(useradms){
            res.render("edi_supadm", { useradms: useradms })
        }
    });
});

router.post('/edi_supadm/:id', ensureAuthenticated, function (req, res) {

    id = req.params.id;

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var permission = req.body.permission;
    var active = req.body.active;

    var extUseradms = new Useradms({
        name : name,
        email :email,
        username : username,
        password : password,
        permission : permission,
        active : active
    });

    Useradms.editUser();


    return res.redirect('/ways/supadm');

});







// GET MEUS DADOS
router.get('/meusdados', ensureAuthenticated, function(req, res){
    res.render('meusdados');
});

module.exports = router;