const express = require('express');
const app = express();
const port = 3000;//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');

app.engine('hbs', handlebars({
	layoutsDir: __dirname + '/views/layouts',
	extname: 'hbs',
	defaultLayout: 'planB',
	partialsDir: __dirname + '/views/partials'
	})
);
app.use(express.static('public'))

//I would like to use a real api but let's use this for the sake of //the simplicity of the article
fakeApi = () => {
  return [
    {
      name: 'Katarina',
      lane: 'midlaner'
    },
    {
      name: 'Jayce',
      lane: 'toplaner'
    },
    {
      name: 'Heimerdinger',
      lane: 'toplaner'
    },
    {
      name: 'Zed',
      lane: 'midlaner'
    },
    {
      name: 'Azir',
      lane: 'midlaner'
    }
  ];
}

app.get('/', (req, res) => {
	res.render('main', {layout: 'index', suggestedChamps: fakeApi(), listExists: true});
});

app.listen(port, () => console.log(`App listening to port ${port}`));