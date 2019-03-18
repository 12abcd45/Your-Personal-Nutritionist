var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var user = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");

var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
mongoose.connect("mongodb://localhost/user_app",{ useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
app.use(require("express-session")({
    secret:"vishva patel",
    resave:false,
    saveUninitialized: false
}));

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.render("home");
        });
    });
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",
{successRedirect:'/',failureRedirect:'/login'}),function(req,res){
});

app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/login");
});

app.listen(process.env.PORT,process.env.IP,function(){
	console.log(process.env.PORT);
    console.log("Server Started..");
});














// var catSchema = new mongoose.Schema({
//     name: String,
//     age: Number,
//     temperament: String
// });

// var Cat = mongoose.model("Cat",catSchema);

// //********   Add a new Cat    ***************//

// //1st method

// // var tommy = new Cat({
// //     name: "Rusty",
// //     age: 5,
// //     temperament: "evil"
// // });

// // tommy.save(function(err,cat){
// //     if(err)
// //     {
// //         console.log("Something Went Wrrong");
// //     }
// //     else
// //     {
// //         console.log("We just added new cat!!!");
// //         console.log(cat);
// //     }
// // });

// // 2nd method 
// // Cat.create({
// //     name:"snow white",
// //     age:10,
// //     temperament: "Bland"
// // },function(err,cat){
// //     if(err)
// //     {
// //         console.log(err);
// //     }
// //     else
// //     {
// //         console.log(cat);
// //     }
// // });

// //**************   Find cats ****************//

// Cat.find({},function(err,cats){
//     if(err)
//     {
//         console.log("ERROR");
//     }
//     else
//     {
//         console.log(cats);
//     }
// });