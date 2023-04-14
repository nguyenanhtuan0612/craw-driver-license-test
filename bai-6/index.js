'use strict';
const express = require('express');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');

const app = express();
const port = 3000;

Handlebars.registerHelper('isNotNull', function (val) {
  return val != null;
});

//app.use
app.use(express.static('public'));

//Template engine
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/:id(\\d+$)', (req, res) => {
  const id = req.params.id;
  const data = require(`./test/Đề ${id}.json`);
  res.render('dethi', { data });
});

app.get('*', (req, res) => {
  const arr = [];
  for (let i = 1; i <= 35; i++) {
    arr.push(i);
  }
  res.render('home', { arr });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
