const express = require("express")
const request = require('postman-request');
const path = require("path")
const bodyParser = require('body-parser');

const hbs = require("hbs")
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
const publicDirectoryPath = path.join(__dirname, '../public');
const partials = path.join(__dirname,"../views/partials")
app.set('view engine','hbs')
hbs.registerPartials(partials)
app.use(express.static(publicDirectoryPath));

  
app.get('',(req,res)=>{
    res.render('index',{
        title: "Weather app",
        name: "Progya",
        des: "This app shows Weather of any places,Happy Searching!"
    })
})
app.get('/about',(req,res)=>{
    res.render('about',{
        title: "About",
          name: "Progya",
           des: "hi, I am Progya ,3rd Year CSE student. Learning Node Js"
    })
})
app.get('/help',(req,res)=>{
    res.render('help',{
        title: "Help",
          name: "Progya",
          des: "Please Check the spelling of the place if you can not find the weather"
    })
})
let city = ""; // Initialize city variable to store the submitted city

// POST route to handle city submission
app.post('/submit-city', (req, res) => {
    city = req.body.city; // Set the city variable to the submitted city from the form
    res.redirect('/Weather'); // Redirect to the /Weather route to display weather information
});

// GET route to display weather information
app.get('/Weather', (req, res) => {
    let h = ""
    let t = ""
    let w = ""
    let p =""
    let c = ""
    let pic = ""
    if (city) {
        let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=82e7c90c7c53900a524412184efb2c8f`;

        request(url, (error, response, body) => {
            if (error) {
                return res.render('Weather', {
                    title: "Weather",
                    name: "Progya",
                    des: "Unable to connect to weather service!"
                });
            }

            const data = JSON.parse(body);

            if (data.cod !== 200) {
                return res.render('Weather', {
                    title: "Weather",
                    name: "Progya",
                    des: "Unable to find location. Please check the city name and try again."
                });
            }

            // Format the message with weather information
            const message = `It is currently ${data.main.temp}°C in ${data.name}. The weather is described as ${data.weather[0].description}. Pressure: ${data.main.pressure} hPa, Humidity: ${data.main.humidity}%, Wind Speed: ${data.wind.speed} m/s`;
             t = data.main.temp
             c = data.name
             pic = data.weather[0].description
             p = data.main.pressure
             h = data.main.humidity
             w = data.wind.speed
            res.render('Weather', {
                title: "Weather",
                name: "Progya",
                des: "Search here",
                temp: t,
                pressure: p,
                humidity: h,
                city: c,
                wind: w,
                im: pic
            });
        });
    } else {
        // Render the Weather template with default message if no city is set
        res.render('Weather', {
            title: "Weather",
            name: "Progya",
            des: "To get the weather, search here",
            temp: "---",
            pressure:  "---",
            humidity:  "---",
            city:  "---",
            wind:  "---",
            im:  "---"
        });
    }
});

app.get('*',(req,res)=>{
res.render("error")
})
console.log(__dirname)
app.use(express.static(path.join(__dirname,"../public")))
app.listen(3000,()=>{
    console.log("start")
})
