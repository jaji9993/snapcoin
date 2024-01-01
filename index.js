const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const cors = require("cors");
require('dotenv').config()
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth.route');
const walletRoutes = require('./routes/wallet.route');
const profileRoutes = require('./routes/profile.route');
const merchantDisplatRoutes = require('./routes/merchandiseDisplay.route');
const transaction = require('./routes/transHistory.route');
//const snapcoinbank = require('./routes/snapcoin.route');
const snappscollected =  require('./routes/snappscollected.route')
const cartCollected = require('./routes/cartController.route');
const port = process.env.PORT || 5001
//const passportSetup=require("./passport");
const passport = require('passport');
const OAuth2Strategy = require('passport-google-oauth2').Strategy;
const authRoute=require("./routes/auth");
const gamerModel = require("./models/gamerModel");
const session = require('express-session');
app.use(session({
    secret:"156joaijjoakdjfoaijdf",
    resave:false,
    saveUninitialized:true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true 
}));

const CLIENT_ID="554589267381-7oa388a7d0ed2buhnka7g8u6edpc1k34.apps.googleusercontent.com";
const CLIENT_SECRET="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";

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth',authRoutes)
app.use('/api/profile',profileRoutes);
app.use('/api/wallet',walletRoutes)
app.use('/api/merchant',merchantDisplatRoutes);
app.use('/api/transaction',transaction);
//app.use('/api/snappcoin',snapcoinbank);
app.use('/api/snapps',snappscollected);
app.use('/api/cart',cartCollected);
app.use("/auth",authRoute);
connectDB() //DB connection

//setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID:CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        callbackURL:"/auth/google/callback", //frontend should have same url and also redirect url in google login
        scope:["profile","email"]
    },
        async(accessToken,refreshToken,profile,done)=>{
            // console.log("profile", profile); //in profile, we will have array of user emails and photos
            try{
                let user = await userModel.findOne({googleId:profile.id});
                if(!user){
                    user = new gamerModel({
                        googleId:profile.id,
                        userName:profile.fullName,
                        email:profile.emails[0].value,
                        //image:profile.photos[0].value

                    });

                        await user.save();
                }
                return done(null,user);
            }catch(error){
                return done(error,null)
            }
        }
    )
)

passport.serializeUser((user,done)=>{
    done(null,user);
});

passport.deserializeUser((user,done)=>{
    done(null,user);
});

//initial google auth login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:3000/success",
    failureRedirect:"http://localhost:3000/failure",
}))

//user details display
app.get("/login/success",async(req,res)=>{
    // console.log("reqqqq",req.user);
    if(req.user){
        res.status(200).json({message:"user Login",user:req.user});
    }else{
        res.status(400).json({message:"not Authorized"});
    }
})

//logout
app.get("/logout",(req,res,next)=>{
    req.logOut(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:3000");
    })
})

app.listen(port,()=>{
    console.log(`Server is running on https://localhost:${port} !!!`);
})

