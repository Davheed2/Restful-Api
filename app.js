const express = require ("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

/////server Code Setup////////////
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


////////////////Mongoose Connections////////////////////
const mongodbConnection = async () =>{
  return await mongoose.connect("mongodb://127.0.0.1:27017/restDB", {useNewUrlParser: true});
} 

mongodbConnection().then(() => {
    console.log("connection established");
}).catch((err) => {
    console.log(err);
});

const articleSchema = new mongoose.Schema({
    title : String,
    content : String
});

const Article = mongoose.model("Article", articleSchema);


////////////////////Route Targetting All Articles//////////////////////////
app.route("/articles")
.get((req,res) => {
   Article.find({}, (err,foundArticles) => {
    if(!err){
        res.send(foundArticles);
    }else{
        res.send(err);
    }
   })
})

.post((req,res) => {

 const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
});

 newArticle.save((err) => {
   if(!err){
     res.send("Successfully added a new article.");
   }else{
     res.send("Oops. Something went wrong. Try again.")
   }
 });
})

.delete((req,res) =>{
  Article.deleteMany((err)=>{
    if(!err){
        res.send("Successfully deleted all articles");
    }else{
        res.send(err);
    }
  })
});
 
////////Route Targetting specific articles//////////////
app.route("/articles/:articleTitle")
.get((req,res) =>{
    Article.findOne({title : req.params.articleTitle},(err, foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No Article Matching The Title Was found");
        }
    })
})

.put((req,res) => {
    Article.replaceOne(
        {title : req.params.articleTitle},
        {title : req.body.title, content : req.body.content},
        {overwrite : true},
        (err) =>{
            if(!err){
                res.send("Successfully updated the article");
            }else{
                res.send(err);
            }
        }
        )

})

.patch((req,res) =>{
    Article.updateOne(
        {title : req.params.articleTitle},
        {$set : req.body},
        (err) => {
            if(!err){
                res.send("Successfully updated the specified field");
            }else{
                res.send(err);
            }
        }
    )
})

.delete((req,res) => {
    Article.deleteOne(
        {title : req.params.articleTitle},
        (err) => {
            if(!err){
                res.send("Successfully deleted article");
            }
        }
    )
});



app.listen(3000, () => {
    console.log("server started at port 3000");
});