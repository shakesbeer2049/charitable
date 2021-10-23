const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path")
const adminRoute = require("./routes/admin");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const mainRoutes = require("./routes/main") 
const QRCode = require('qrcode')
const methodOverride = require("method-override")
app.set('view engine','ejs');
app.use(express.static('public'))


app.use(express.urlencoded({extended:true}))

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    // const collections = Object.keys(mongoose.connection.collections);
    // console.log(collections);
    console.log("Connected to MongoDB");
  }
);
app.get('/favicon.ico', (req, res) => res.status(204));


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//method-override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(adminRoute)
app.use(mainRoutes)
app.use(authRoute);
app.use(userRoute);
app.use(postRoute);






app.listen(8800, () => {
  console.log("Backend server is running!");
});
