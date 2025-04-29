const express = require("express");
const path = require("path");
const userModel = require("./models/user");
const postModel = require("./models/post");

const app = express();

app.get("/", (req, res) => {
  res.send("helo");
});

app.get("/post/create", async (req, res) => {
  let post = await postModel.create({
    postdata : 'hello kese',
    user : "68112282bd7e2969ae64d37e"
  })

  let user = await userModel.findOne({_id : "68112282bd7e2969ae64d37e"})
  user.posts.push(post._id)
  await user.save()
  res.send({post, user})
});

app.get("/create", async (req, res) => {
  let user = await userModel.create({
    username: 'sourabh',
    email: 'sourabh@gmail.com',
    age: 21
  });

  res.send(user)
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server is running [http://localhost:${PORT}]`);
});
