const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// initilizes the application
//
const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public/');
// created if the name of the views directory is a different name
// this is set up the same way as the original path
//
const viewsPath = path.join(__dirname, '../templates/views')
// Partials using hbs
//
const partialsPath = path.join(__dirname, '../templates/partials');

// app.set used to set a value for a given express setting
// a key which is the setting name and value we want to set for the value
//
// Setup handlebars engine and views location
app.set('view engine', 'hbs')
// How you would call the path that is used
//
app.set('views', viewsPath)
// Setting up the partials directory
hbs.registerPartials(partialsPath);

// app.use is used to customize the server
//
// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    // render can be used to render one of our views
    // you must have an argument that matchs the precise name of the file you are rendering
    //
    res.render('index', {
        title: 'Weather',
        name: 'Waleed Saleh',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Waleed Saleh',
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'How may we assist you?',
        name: 'Waleed Saleh'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address must be provided.'
        })
    }

    geocode(req.query.address, (err, { latitude, longitude, location } = {}) => {
        if (err) {
            return res.send({ err });
        }
        forecast(latitude, longitude, (err, forecastData) => {
            if (err) {
                return res.send({ err })
            }
            console.log(req.query)
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address,
            })
        })
    })
});



app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        });
    }
    console.log(req.query.search)
    res.send({
        products: [],
    })
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Waleed Saleh',
        errorMessage: 'Help article not found.'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Waleed Saleh',
        errorMessage: 'Page not found.'
    });
});

// These are our routes.
//
// app.com
// app.com/help
// app.com/about




// To start the server up
//
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});
