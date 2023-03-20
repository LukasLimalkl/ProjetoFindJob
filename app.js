const express       = require('express');
const exphbs        = require('express-handlebars');
const path          = require('path')
const app           = express();
const db            = require('./db/connection');
const bodyParser    = require('body-parser');
const PORT = 3000;
const Job           = require('./models/Job');
const Sequelize     = require('sequelize');
const { query } = require('express');
const Op            = Sequelize.Op;



app.listen(PORT, function(){
    console.log('O express esta rodando na porta ' + PORT)
});

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// HANDLE BARS
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine( {defaultLayout: 'main'} ));
app.set('view engine', 'handlebars');

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// db connection
db
   .authenticate()
   .then(()=>{
    console.log('Conectou o banco de dados com sucesso')
   })
   .catch(err =>{
    console.log('deu erro ao conectar')
   })

// routes
app.get('/',(req,res)=>{

    let search = req.query.job;
    let query = ''+search+'%';

    if(!search){

        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            
            res.render('index', {
                jobs
            });
            
        })
        .catch(err => console.log(err));

    } else {

        Job.findAll({
            
            where:{title:{[Op.like]: query}},
            order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            
            console.log(search);
            res.render('index',{
                jobs, search
            });
            
        })
        .catch(err => console.log(err));

    }

  
});

// jobs routes

app.use('/jobs', require('./routes/jobs'));