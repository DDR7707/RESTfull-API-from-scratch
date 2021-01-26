const express = require("express")
const bodyparser = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs")

const app = express()

app.use(bodyparser.urlencoded({
  extended: true
}))
app.set("view engine", "ejs")
app.use(express.static("public"))
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
})

app.listen(3000, function() {
  console.log("Server started at port 3000");
})

const articleschema = {
  title: String,
  content: String
}
const model = mongoose.model("article", articleschema)

/////////////////////////////////////////////////////Article route////////////////////////////////////////////////////////

app.route("/articles")

  .get(function(req, res) {
    model.find({}, function(err, foundarticles) {
      if (err) {
        res.send(err)
      } else {
        res.send(foundarticles)
      }
    })
  })

  .post(function(req, res) {
    const newart = new model({
      title: req.body.title,
      content: req.body.content
    })

    newart.save(function(err) {
      if (!err) {
        res.send("Successfully updated")
      } else {
        res.send(err)
      }
    })
  })

  .delete(function(req, res) {
    model.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted")
      } else {
        res.send(err)
      }
    })
  })

////////////////////////////////////////////////////////Specific article route/////////////////////////////////////////////////////////

app.route("/articles/:articletitle")

  .get(function(req, res) {

    model.findOne({
      title: req.params.articletitle
    }, function(err, foundarticle) {
      if (!err) {
        res.send(foundarticle)
      } else {
        res.send("Required data not found")
      }
    })
  })

  .put(function(req, res) {
    model.update(
      {title: req.params.articletitle},
      {title: req.body.title , content: req.body.content},
      {overwrite: true},
      function(err) {
        if (!err) {
          res.send("Successfully updated the article")
        }
      }
    )
  })

  .patch(function(req,res){
    model.update(
      {title : req.params.articletitle},
      {$set : req.body},
      function(err){
        if(!err){
          res.send("Successfully patched")
        }
      }
    )
  })

  .delete(function(req,res){
    model.deleteOne(
      {title : req.params.articletitle},
      function(err){
        if(!err){
          res.send("Deleted successfully")
        }
      }
    )
  })
