// var fs = require('fs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const User = require('../models/User');
// const Team = require('../models/Team');
// const Robot = require('../models/Robot');
// const Member = require('../models/Member');
const usersCtrl = {};

usersCtrl.signup = async (req, res) => {
    const {email, password, role='Normal', verified=false} = req.body;
    const emailUser = await User.findOne({email: email});
    
    // validaciones
    if(emailUser){
        req.flash('error', 'El correo ya esta asociado con otra cuenta');
        res.redirect('/#tab4');
    } else{
        const newUser = new User({email, password, role, verified});
        newUser.password = await newUser.encript(password);
        await newUser.save();
        var user = newUser._id;
        var url = 'http://localhost:4000/users/verified/'+user;

        // verificacion
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'brolisdom99@gmail.com',
                pass: ''
            }
        });
        const handlebarOptions = {
            viewEngine: {
                partialsDir: './src/views/emails/',
                layoutsDir: './src/views/emails/',
                defaultLayout: 'mail',
            },
            viewPath: './src/views/emails/',
        };
        transporter.use('compile', hbs(handlebarOptions));
        var mailOptions = {
            from: 'brolisdom99@gmail.com',
            to: email,
            subject: 'Correo de verificacion',
            // text: 'Verifica aqui tu correo: '+url,
            html: '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@200;400;700&display=swap" rel="stylesheet"></head><body style="font-family: "Exo 2", Open Sans, Arial;"><div class="container" style="background: #F6F6F6; width: 700px; display: block; margin: auto; border-bottom-left-radius: 70px;"><div class="header" style="background: #5D2ABC; display: block; width: 700px; margin: auto; margin-top: 20px; position: relative;"><h3 style="display: block; width: 90%; margin: auto; text-align: center; padding-bottom: 20px; padding-top: 20px; color: white; font-weight: 400; text-transform: uppercase; font-size: 16px;">    Rama Estidiantil IEEE UPIITA-IPN | Instituto Polit&eacute;cnico Nacional</h3><h3 style="display: block; width: 65%; margin: auto; text-align: center; color: white; font-weight: 400; text-transform: uppercase; font-size: 40px;">    GUERRA DE ROBOTS</h3><h3 style="display: block; width: 70%; margin: auto; text-align: center; padding-bottom: 20px; color: white; font-weight: 400; text-transform: uppercase; font-size: 16px;">    El torneo de r&oacute;botica internacional m&aacute;s importante de m&eacute;xico</h3></div><div class="content" style="width: 700px; display: block; margin: auto; margin-top: 40px; margin-bottom: 40px;"><h3 style="font-weight: 600; text-align: center; color: #9E7FD7; font-size: 40px; margin-bottom: 10px;">    '+ email +'</h3><h4 class="welcome" style="font-weight: 600; margin-bottom: 20px; font-size: 26px; color: #2E155E; text-align: center;">    Gracias por registrarte y se bienvenid&#64; a este gran evento</h4><h4 style="text-align: center; font-weight: 400; font-size: 20px;">    Para continuar con esta aventura porfavor verifica tu correo electronico haciendo click en el siguiente botón</h4><a href="'+ url +'" class="button" style="display: block; width: 200px; text-align: center; height: 50px; margin: auto; margin-top: 30px; margin-bottom: 30px; background: #5D2ABC; line-height: 45px; text-decoration: none; color: #DFD4F2; font-size: 16px; border-bottom-left-radius: 20px;">    Verifica mi cuenta</a><h4 style="text-align: center; font-weight: 400; font-size: 20px;">O copia y pega el siguiente link en el navegador para confirmar tu cuenta</h4> <br><a class="link" style="margin: auto; width: 70%; display: block; text-align: center; color: #5D2ABC;font-size: 15px;">    '+ url +'</a><br><br></div><div class="footer" style="background: #2E155E; color: #DFD4F2; text-align: center; padding: 20px; margin-bottom: 20px; border-bottom-left-radius: 70px;"><h5 class="info" style="font-weight: 100; font-size: 16px;">Si no reconoces esta solicitud o tu no la has hecho, ignora este correo y porfavor ponte en contacto con nosotros: <b>correo@guerraderobots.mx</b></h5><h5>Guerra de Robots | &copy; 2020 Rama Estudiantil IEEE UPIITA-IPN</h5><h5><a href="#" style="text-decoration: none; color: #DFD4F2;">www.guerraderobots.mx</a></h5></div></div></body></html>'
            // template: 'mail'
        };
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        // respuesta
        req.flash('exito', 'Registro exitoso, verifique su correo para poder ingresar');
        res.redirect('/#tab4');
    }
}

usersCtrl.verified = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {verified:true}, function(err,res){
        if(err){
            req.flash('error', 'Tu correo no ha sido verificado');
        } else{
            req.flash('exito', 'Tu correo ha sido verificado con exito');
        }
    });
    res.redirect('/#tab4');
}

usersCtrl.login = passport.authenticate('local', {
    failureRedirect: '/#tab4',
    successRedirect: '/home',
    failureFlash: true
})

usersCtrl.facebook = passport.authenticate('facebook', { scope : ['email'] });

usersCtrl.callback = passport.authenticate('facebook', { //cambiar
    failureRedirect: '/#tab4',
    successRedirect: '/home',
    failureFlash: true
})

usersCtrl.google = passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
})

usersCtrl.enter = passport.authenticate('google', { //cambiar
    failureRedirect: '/#tab4',
    successRedirect: '/home',
    failureFlash: true
})

usersCtrl.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

module.exports = usersCtrl;
