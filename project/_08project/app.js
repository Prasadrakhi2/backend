const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("./models/user");
const postModel = require("./models/post");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/register", async (req, res) => {
  let { username, name, email, password, age } = req.body;

  //   check if user already exists
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("user already exists");

  //   encrypt password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async function (err, hash) {
      let user = await userModel.create({
        username,
        name,
        email,
        password: hash,
        age,
      });
      const token = jwt.sign({ email: user.email, userid: user._id }, "secret");
      res.cookie("token", token);
      res.redirect('/login');
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });

  if (!user) return res.status(400).send("user not found");

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (!result) return res.status(400).send("something went wrong");
    else {
      const token = jwt.sign({ email: user.email, userid: user._id }, "secret");
      res.cookie("token", token);
      res.redirect("/profile");
    }
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({email : req.user.email}).populate("posts")
  console.log(user)
   //populate("posts") => becouse the posts in user collection are just the ids of the posts so for the data we need to populate it with the post collection
  console.log(user.posts)
  res.render("profile", {user});
});


app.post("/post", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({email : req.user.email})
  let {content} = req.body;
  let post = await postModel.create({
    user : user._id,
    content
  })

  user.posts.push(post._id)
  await user.save()
 
  res.redirect("/profile")
});

// miiddleware to check if user is logged in for protected routes
function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") res.redirect("login");
  else {
    let data = jwt.verify(req.cookies.token, "secret");

    req.user = data;
    next();
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is running [http://localhost:${PORT}]`);
});
