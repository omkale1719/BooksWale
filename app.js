if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require('express');
const app = express();
const path = require("path");
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const home=require("./models/home.js");
const kids=require("./models/kids.js");
const nonfiction=require("./models/nonfiction.js");
const fiction=require("./models/fiction.js");
const RS=require("./models/RS.js");
const TY=require("./models/TA.js");
const academic=require("./models/academic.js");
const session = require("express-session");
const reviews = require('./models/reviews.js');
const passport=require("passport");
const localstrategy=require("passport-local");
const user= require("./models/user.js");
const MongoStore=require("connect-mongo")
const flash=require("express-flash");
const { isloggedIn, saveRedirectUrl,reviewOwner } = require('./middleware.js');
const methodOverride=require('method-override');


// Set up EJS and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

// Middleware to parse request body and serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use('/show_d/:id', express.static(path.join(__dirname, "public")));
app.use(express.static('public')); // जिथे 'public' फोल्डरमध्ये तुमची CSS फाईल आहे.
app.use(methodOverride("_method"));

const mongoUrl = process.env.AtlasDb_Url;



const store = MongoStore.create({
  mongoUrl: mongoUrl,
  crypto: {
      secret: process.env.SECREAT,
  },
  touchAfter: 24 * 3600,
});


app.use(
  session({
    secret: process.env.SECREAT, // प्रॉडक्शनमध्ये सुरक्षित ठेवण्यासाठी 
    resave: false, // सेशन डेटामध्ये बदल नसेल तर सेव्ह होणार नाही
    saveUninitialized: false, // रिकाम्या सेशनला सेव्ह होऊ देणार नाही
    store: store, // MongoDB स्टोअर जोडण्यासाठी
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 दिवस वैध
      maxAge: 7 * 24 * 60 * 60 * 1000, // कमाल वय 7 दिवस
      httpOnly: true, // क्लायंट-साइड जावास्क्रिप्टला कुकी ऍक्सेस होणार नाही
    },
  })
);


  


app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user.id); // Save the user's ID in the session
});

passport.deserializeUser((id, done) => {
  user.findById(id, (err, user) => {
      if (err) return done(err);
      done(null, user); // Attach the user object to req.user
  });
});

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.curruser = req.user || null; 

  next();
});



  
// MongoDB Connection


async function main() {
    try {
        await mongoose.connect(mongoUrl, {});
        console.log("Connected to database...");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

main();







const models = {
  home: require("./models/home"),
  fiction: require("./models/fiction"),
  nonfiction: require("./models/nonfiction"),
  kids: require("./models/kids"),
  RS:require("./models/RS.js"),
 TY:require("./models/TA.js"),
  academic:require("./models/academic.js")
 
};

global.categoryModels = {
  home,
  fiction,
  nonfiction,
  kids,
  RS,
  TY,
  academic
};

// Routes

// Signup Routes
app.get("/signup", async (req, res) => {
  res.render("users/signup_form.ejs", {
    wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0,
  });
});

app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Create a new user object
    const newUser = new user({ email, username });

    // Register the new user with a password
    const registeredUser = await user.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Signup successful! Welcome to our website.");
      res.redirect("/");
    });
  } catch (e) {
    // Check for specific errors, such as user already existing
    if (e.name === "UserExistsError") {
      req.flash("error", "User already exists. Please try a different email.");
    } else {
      req.flash("error", "Something went wrong. Please try again.");
    }

    // Re-render the signup page with flash messages
    res.redirect("/signup");
  }
});

// Login Routes
app.get("/login", async (req, res) => {
  res.render("users/login_form.ejs", {
    wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0,
  });
});

app.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Invalid username or password.", // Flash message for login failure
  }),
  async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/";
    delete res.locals.redirectUrl;

    req.flash("success", "Login successful! Welcome back.");
    res.redirect(redirectUrl);
  }
);

// Logout Route
app.get("/logout", (req, res) => {
 
  req.logout((err) => {
    
    // req.flash("success", "You have successfully logged out.");
    req.session.destroy((err) => {
      res.redirect("/"); // Redirect after logging out
    });
     
    
  });
});



app.get("/", async (req, res) => {
  
    const Book=await home.find({});
    const Kids=await kids.find({});
    const Nonfiction=await nonfiction.find({});
    const Fiction=await fiction.find({});
    const Academic=await academic.find({});
    const ty =await TY.find({});
    const rs =await RS.find({});
   
    res.render("home.ejs",
      {
        categoryModels,
        Book,
        Kids,
        Academic,
        ty,
        rs,
        Nonfiction,
        Fiction,
        wishlistCount: req.session.wishlistCount || 0,
        cartcount: req.session.cartCount || 0
    });
});





app.get("/search", (req, res) => {
  req.flash("error","Search bar is under construction!");
    return res.redirect("/");

  } 
);








app.get("/show_d/:id/:category", async (req, res) => {
  const { id, category } = req.params;
  const Model = models[category]; // योग्य मॉडेल निवडणे
  if (!Model) {
    return res.status(400).send("Invalid category");
  }
  // console.log(category, Model);
  

  // डायनॅमिक मॉडेल वापरून कॅटेगरी निवडा
  let BookModel;
  switch (category) {
      case "home":
          BookModel = home;
          break;
      case "fiction":
          BookModel = fiction;
          break;
      case "nonfiction":
          BookModel = nonfiction;
          break;
      case "kids":
          BookModel = kids;
          break;
      case "RS":
          BookModel = RS;
          break;
      case "TY":
          BookModel = TY;
          break;
      case "academic":
          BookModel = academic;
          break;
      default:
          return res.status(404).send("Category not found!");
  }

  
  try {
      const Book = await BookModel.findById(id).populate({
        path: "reviews",
        populate: { path: "owner", select: "username" }, 
        });
      res.render("show_d.ejs", {
          Book,
          category,
          wishlistCount: req.session.wishlistCount || 0,
          cartcount: req.session.cartCount || 0,
      });
  } catch (error) {
      res.status(500).send("Something went wrong: " + error.message);
  }
});





app.post("/add-to-cart",async (req, res) => {
 
  try {
      const { productId, image, title, author, description, price, quantity,category } = req.body;

      if (!req.session.cart) {
          req.session.cart = [];
      }

      req.session.cart.push({
          productId,
          image,
          title,
          author,
          description,
          price,
          quantity,
         category
         
      });

   req.session.cartCount=req.session.cart.length;
  //  console.log("cart count:", req.session.cartCount);
      return res.json({ success: true, message: "Added to cart" });
  } catch (error) {
      // console.error("Error adding to cart:", error);
      return res.json({ success: false, message: "Error adding to cart" });
  }
});

  
app.get("/cart", isloggedIn,(req, res) => {
 
    res.render("cart.ejs", {
      cart: req.session.cart || [],
      wishlistCount: req.session.wishlistCount || 0,
      cartcount: req.session.cartCount || 0,
    });
  
});






app.post("/remove-from-cart", isloggedIn,(req, res) => {
  try {
      const { productId } = req.body;

      // Check if the cart exists in the session
      if (!req.session.cart) {
          return res.json({ success: false, message: "Cart is empty." });
      }

      // Filter out the product from the cart
      req.session.cart = req.session.cart.filter(item => item.productId !== productId);
      req.flash("success", "Cart Is Remove SuccessFully!.");
     res.redirect("/cart")
  } catch (error) {
      console.error("Error removing from cart:", error);
      return res.status(500).json({ success: false, message: "Error removing product from cart" });
  }
});




app.post("/add-to-cart1", isloggedIn, async (req, res) => {
  
  try {
      const {  image, title, author, description, price, } = req.body;

      if (!req.session.cart) {
          req.session.cart = [];
      }

      req.session.cart.push({
         
          image,
          title,
          author,
          description,
          price
          
         
      });

   req.session.cartCount=req.session.cart.length;
   console.log("cart count:", req.session.cartCount);
      return res.json({ success: true, message: "Added to cart" });
  } catch (error) {
      console.error("Error adding to cart:", error);
      return res.json({ success: false, message: "Error adding to cart" });
  }
});


app.get("/buy-now", isloggedIn,(req,res)=>{
  res.render("buy_now_form.ejs",{wishlistCount: req.session.wishlistCount || 0, cartcount: req.session.cartCount || 0});
});
app.get("/pro-not-avai",(req,res)=>{
  res.render("pro-not-avai.ejs",{wishlistCount: req.session.wishlistCount || 0, cartcount: req.session.cartCount || 0});
});












app.post("/add-to-wishlist/:category", isloggedIn, async (req, res) => {
    const { productId } = req.body; // Extract productId from the request body
    const {category}=req.params;
    const Model=models[category];
    if(!Model){
      return res.status(400).json({error:"invalid category"});
    }
    if (!productId) {
        return res.status(400).json({ error: "Product ID not provided" });
    }
    let BookModel;
    switch (category) {
        case "home":
            BookModel = home;
            break;
        case "fiction":
            BookModel = fiction;
            break;
        case "nonfiction":
            BookModel = nonfiction;
            break;
        case "kids":
            BookModel = kids;
            break;
        case "RS":
            BookModel = RS;
            break;
        case "TY":
            BookModel = TY;
            break;
        case "academic":
            BookModel = academic;
            break;
        default:
            return res.status(404).send("Category not found!");
    }
    
    try {
      
        const product = await BookModel.findById(productId); // Fetch the product
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Initialize wishlist in the session if it doesn't exist
       
        if (!req.session.wishlist) {
            req.session.wishlist = [];
        }

        // Add the product to the wishlist
        
       req.session.wishlist.push(product._id);
        req.session.wishlistCount = req.session.wishlist.length;

        console.log("Wishlist count:", req.session.wishlistCount); // Debugging


        
        console.log(`Product added to wishlist: ${product._id}`);
        req.flash("success", "Product Added In Wishlist!.");
        res.redirect(req.get("referer")); // Redirect to the referring page
    } catch (err) {
        console.error("Error adding to wishlist:", err);
        res.status(500).json({ error: "Error adding to wishlist" });
    }
});


app.get("/wishlist", async (req, res) => {
  console.log("req.session.wishlist=", req.session.wishlist);

  // Wishlist रिकामी असल्यास, वापरकर्त्याला Redirect करा.
  if (!req.session.wishlist || req.session.wishlist.length === 0) {
    req.flash("error", "Empty Wishlist!.");
    return res.redirect("/Empty_wishlist");
  }

  try {
    const wishlistProducts = []; // Wishlist साठी उत्पादने गोळा करण्यासाठी array

    // सर्व categories तपासा
    for (let productId of req.session.wishlist) {
      for (let category in categoryModels) {
        const product = await categoryModels[category].findById(productId);
        if (product) {
          wishlistProducts.push(product);
          break; // संबंधित category मिळाल्यावर पुढील category तपासू नका
        }
      }
    }

    res.render("wishlist.ejs", {
      wishlist: wishlistProducts,
      wishlistCount: req.session.wishlist.length,
      cartcount: req.session.cartCount || 0
    });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Error fetching wishlist" });
  }
});

  // Render empty wishlist page
  app.get("/Empty_wishlist", (req, res) => {
    res.render("Empty_wishlist.ejs",{wishlistCount: req.session.wishlistCount || 0, cartcount: req.session.cartCount || 0});
  });
  
  // Remove a product from wishlist
  // Wishlistमधून प्रॉडक्ट काढा
app.post("/remove-from-wishlist", isloggedIn,async (req, res) => {
  const { productId } = req.body;
  console.log(productId);

  try {
      if (!req.session.wishlist) {
          return res.redirect("/wishlist");
      }

      req.session.wishlist = req.session.wishlist.filter((id) => id !== productId);

      // Wishlist count अपडेट करा
      req.session.wishlistCount = req.session.wishlist.length;

      // console.log("Updated Wishlist Count:", req.session.wishlistCount);
      req.flash("success", "Product Removed From Wishlist!.");
      res.redirect("/wishlist");
  } catch (error) {
      // console.error("Error removing from wishlist:", error);
      req.flash("error", "product not remove from wishlist!.");
      res.redirect("/wishlist");
  }
});



app.get("/api/wishlist-count", (req, res) => {
  // console.log("Session Data:", req.session);
  const wishlistCount = req.session.wishlistCount || 0;
  res.json({ wishlistCount });
});
app.get("/api/cart-count", (req, res) => {
  // console.log("Session Data:", req.session);
  const cartCount = req.session.cartCount || 0;
  res.json({ cartCount });
});



// reviews

app.get("/add_new_review",(req,res)=>{
  req.flash("error","Please Login Before Add Review!");
  res.redirect("/login");
})

app.post("/reviews/:category/:id/views", isloggedIn,async (req, res) => {
  try {
    const { category, id } = req.params;

    // मॉडेल निवडा (कॅटेगरीनुसार)
    const Model = models[category];
    // console.log(Model);
    if (!Model) {
      
      return res.status(400).send("Invalid category in post");
    }

    // पुस्तक शोधा
    const book = await Model.findById(id);
  
    
    // console.log({select: "username",});
    
    if (!book) {
      return res.status(404).send("Book not found");
    }

    // नवीन रिव्ह्यू तयार करा
    const newReview = new reviews(req.body.review);
    newReview.owner=req.user._id;
    book.reviews.push(newReview);
    // console.log("this is new review info:",newReview);
    
    await newReview.save();
    await book.save();
    req.flash("success", "New Review Added!.");
    res.redirect(`/show_d/${id}/${category}`);
  } catch (error) {
    
    console.error("Error while saving review:", error);
    // res.status(500).send("An error occurred while saving the review");
    req.flash("error", "An error occurred while saving the review!.");
  }
});

app.delete("/reviews/:category/:id/views/:reviewId", 
  isloggedIn,
  reviewOwner,
  async (req, res) => {
  try {
    const { category, id, reviewId } = req.params;

    const Model = models[category];
    
    if (!Model) {
      return res.status(400).send("Invalid category in delete ");
    }

    await Model.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await reviews.findByIdAndDelete(reviewId);
    req.flash("error", "Review Deleted!.");
    res.redirect(`/show_d/${id}/${category}`);
  } catch (error) {
    // console.error("Error while deleting review:", error);
    // res.status(500).send("An error occurred while deleting the review");
    req.flash("error", "An error occurred while deleting the review!");
  }
});



app.get("/aboutus",(req,res)=>{
  res.render("aboutus.ejs",{ wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0})
})





// Start the server
const PORT = process.env.PORT || 9696;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);

});



















