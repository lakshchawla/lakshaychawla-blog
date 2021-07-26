const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
var _ = require('lodash');

const app = express();

mongoose.connect("mongodb+srv://admin-lakshay:Lakshay19@cluster0.anyf7.mongodb.net/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const postSchema = {
    title: String,
    blogPost: String,
    authorName: String,
    authorEmail: String
}

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        res.render("main", {
            posts: posts
        })
    })
});

app.get("/new-post", (req, res) => {
    res.render("compose");
})

app.post("/new-post", (req, res) => {

    var post = new Post({
        title: req.body.Title,
        blogPost: req.body.BlogPost,
        authorName: req.body.AuthorName,
        authorEmail: req.body.Email
    })

    post.save();

    res.redirect('/');
})

app.get("/posts/:reqSite", (req, res) => {

    Post.findOne({ _id: req.params.reqSite }, (err, post) => {
        res.render("post", {
            post: post
        })
    })
})

app.get("/posts/edit/:reqSite", (req, res) => {
    Post.findOne({ _id: req.params.reqSite }, (err, post) => {
        res.render("edit", {
            post: post
        })
    })
})

app.post("/posts/edit/:reqSite", (req, res) => {

    var new_title = req.body.Title;
    var new_blogPost = req.body.BlogPost;
    var new_authorName = req.body.AuthorName;
    var new_authorEmail = req.body.Email;

    Post.updateOne({
        _id: "req.params.reqSite"
    }, {
        title: new_title,
        blogPost: new_blogPost,
        authorName: new_authorName,
        authorEmail: new_authorEmail
    }, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Updates docs: ", docs);
        }
    });

    res.redirect('/');
})

app.get("/posts/delete/:reqSite", (req, res) => {
    Post.deleteOne({ _id: req.params.reqSite }, (err, post) => {
        res.redirect("/");
    })
})

app.listen(process.env.PORT || "3000", () => {
    console.log('Server running on port 3000');
})