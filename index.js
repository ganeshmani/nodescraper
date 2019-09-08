const cheerio = require('cheerio');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.engine('handlebars', exphbs({ defaultLayout : 'main'}));
app.set('view engine','handlebars');

app.get('/', (req, res) => res.render('index', { layout: 'main' }));

app.get('/search',async (req,res) => {
    
    const { tag } = req.query;

    let datas = [];

    request(`https://medium.com/search?q=${tag}`,(err,response,html) => {

     if(response.statusCode === 200){
        const $ = cheerio.load(html);

        $('.js-block').each((i,el) => {

            const title = $(el).find('h3').text();
            const article = $(el).find('.postArticle-content').find('a').attr('href');
            
            let data = {
                title,
                article
            }
            
            datas.push(data);
           
        })  
     }

     
    console.log(datas);
    
    res.render('list',{ datas })

    })
})



app.listen(9878,() => {
    console.log("server is running on port 9878");
})