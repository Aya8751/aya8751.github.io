const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const app=express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});

const db = mongoose.connection;
db.on('open', function() {
    console.log('Connection established ...')

    app.listen(3000, function() {
        console.log("Server is listening to port 3000");
    })
})
const itemSchema = new mongoose.Schema({
    name: String
});
const Item=mongoose.model("Item",itemSchema);
const item1=new Item({
    name:"Welcome in TodoList",
});
const d=[item1];

app.get("/",function(req,res)
{
   // res.send("<h1>Hey guys!!</h1>");
   Item.find({},function(err,f)
   {
      // console.log(f);
      if(f.length===0)
      {
        Item.insertMany(d,function(err)
        {
            if(err){
                console.log(err);
            }
             else{
                 console.log("Successfully saved items to DB");
            }
         });
      res.redirect("/");
      }
      else{
      res.render("list",{newListItems:f});
      }
   });
});
app.post("/",function(req,res)
{
    const itemName=req.body.n;
    const item=new Item({
       name:itemName
   });
item.save();
res.redirect("/");
});
app.post("/delete",function(req,res)
{
  let check=req.body.checkbox;
  //console.log(check);
  Item.findByIdAndRemove(check,function(err)
  {
      if(!err)
      {
          console.log("Successfully deleted");
          res.redirect("/");
      }
  });
}); 
// Model.findById(id, function (err, doc) {
//     doc.name = 'jason bourne';
//     doc.save(callback);
//   });   


