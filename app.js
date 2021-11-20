import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const port = 5000;
const app = express();
import mongoose from 'mongoose';
// import encryp from 'mongoose-encryption';
import md5 from 'md5';
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// console.log(process.env.SECRET);
// const secret = process.env.SECRET;
mongoose.connect('mongodb://localhost:27017/userDB', {});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// userSchema.plugin(encryp, {
//   secret: process.env.SECRET,
//   encryptedFields: ['password'],
// });

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets');
        }
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server startd on port ${port}`);
});
