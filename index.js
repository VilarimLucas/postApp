const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const Post = require('./models/Post');
const uploadImage = require('./middlewares/uploadImage')
const fs = require('fs');
const { Op } = require('sequelize');

// carregando o cabeçalho do html em outras páginas
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// arquivos estaticos
app.use('/jQuery', express.static('public/js/jquery-3.6.3'));
app.use('/bootstrapStyle', express.static('public/css/bootstrap/css'));
app.use('/bootstrapIcons', express.static('public/css/bootstrap/icons/bootstrap-icons-1.10.5/font'));
app.use('/images', express.static('public/img'));
app.use('/bootstrapScript', express.static('public/css/bootstrap/js'));
app.use('/style', express.static('public/css'));

//rota principal
app.get('/', function (req, res) {
    //o then passa os posts para nossa view
    Post.findAll().then(function (posts) {
        //var nposts=JSON.parse(JSON.stringify(posts))
        //res.render('home',{posts:nposts})
        posts = posts.map((post) => { return post.toJSON() });
        res.render('home', { posts: posts })

    });
});

// app.get('/pesquisa', function (req, res) {
//     //o then passa os posts para nossa view
//     Post.findAll().then(function (posts) {
//         where: {
//             name: {
//               [Op.like]: '%John%'
//             }
//           }
//         })
//         .then((users) => {
//           console.log(users);
//         })
//         .catch((err) => {
//           console.error(err);
//     });
// });

//rota para o cadastro
app.get('/cad', function (req, res) {
    res.render('formulario');
});

//fazendo a inserção no banco
app.post('/add', uploadImage.single('imagem'), function (req, res) {

    Post.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        imagem: req.file.originalname

    }).then(function () {
        //redirecionando para home com o barra
        res.redirect('/')
    }).catch(function (erro) {
        res.send('"Houve um erro: ' + erro);
    });
});

//Inserindo imagem no servidor

// app.post('/upload-image', uploadImage.single('imagem'), async (req, res) => {

//     if (req.file) {
//         return res.json({
//             erro: false,
//             mensagem: "Upload realizado com sucesso!"
//         });
//     }

//     return res.status(400).json({
//         erro: true,
//         mensagem: "ERRO: Upload não realizado com sucesso!"
//     });

// });

//exclusão de dados
app.get('/deletar/:id', function (req, res) {
    Post.destroy({ where: { 'id': req.params.id } }).
        then(function () {
            res.redirect('/');
        }).catch(function (erro) {
            res.send("Estápostagemnãoexiste");
        });
});

//rota para alterar
app.get('/alterar/:id', function (req, res) {
    Post.findAll({ where: { 'id': req.params.id } }).then(function (posts) {
        //varnposts=JSON.parse(JSON.stringify(posts))
        //res.render('home',{posts:nposts})
        posts = posts.map((post) => { return post.toJSON() });
        res.render('alterar', { posts: posts })
    });
});

//fazendo a alteração no banco
app.post('/update', function (req, res) {
    Post.update({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    },
        {
            where: { id: req.body.id }
        }).then(function () {
            res.redirect('/#posts');
        }).catch(function (erro) {
            res.send("Está postagem não existe " + erro);
        });
});


//fazendo a alteração com imagem
app.post('/update2', uploadImage.single('imagem'), function (req, res) {
    Post.update({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo,
        imagem: req.file.originalname
    },
        {
            where: { id: req.body.id }
        }).then(function () {
            res.redirect('/');
        }).catch(function (erro) {
            res.send("Está postagem não existe" + erro);
        });
});




app.get('/pesquisar', async (req, res) => {
    const { termo } = req.query;
    const postagens = await Post.findAll({
        where: {
            titulo: { [Op.like]: `%${termo}%` }
        }
    });
    res.render('resultados-pesquisa', { postagens });
});




app.listen(8081, function () {
    console.log("Servidor Rodando");
});

