
// Environment Configuration
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


// Import Required Modules

const express = require('express');
const path = require("path");
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const localstrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const methodOverride = require('method-override');
const multer = require('multer');
const fs = require('fs');

// Import Models
const home = require("./models/home.js");
const kids = require("./models/kids.js");
const nonfiction = require("./models/nonfiction.js");
const fiction = require("./models/fiction.js");
const RS = require("./models/RS.js");
const TY = require("./models/TA.js");
const academic = require("./models/academic.js");
const reviews = require('./models/reviews.js');
const customer = require("./models/customer.js");
const user = require("./models/user.js");

// Import Middleware
const { isloggedIn, saveRedirectUrl, reviewOwner } = require('./middleware.js');

// App Initialization
const app = express();

// View Engine Setup
app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use('/show_d/:id', express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// MongoDB Connection
const mongoUrl = process.env.AtlasDb_Url;
// const mongoUrl = ("mongodb://127.0.0.1:27017/Litbazzar");

async function main() {
  try {
    await mongoose.connect(mongoUrl, {});
    console.log("Connected to database...");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
main();

// Session and Flash Configuration
const store = MongoStore.create({
  mongoUrl: mongoUrl,
  crypto: { secret: process.env.SECREAT },
  touchAfter: 24 * 3600,
});

app.use(
  session({
    secret: process.env.SECREAT,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  user.findById(id, (err, user) => {
    if (err) return done(err);
    done(null, user);
  });
});

// Global Variables Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.curruser = req.user || null;
  res.locals.Admin="iamadmin@open"
  next();
});

// Models Registry
const models = {
  home: require("./models/home"),
  fiction: require("./models/fiction"),
  nonfiction: require("./models/nonfiction"),
  kids: require("./models/kids"),
  RS: require("./models/RS.js"),
  TY: require("./models/TA.js"),
  academic: require("./models/academic.js"),
};

global.categoryModels = {
  home,
  fiction,
  nonfiction,
  kids,
  RS,
  TY,
  academic,
};

// Routes

// Signup Route
app.get("/signup", async (req, res) => {
  res.render("users/signup_form.ejs", {
    wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0,
  });
});

// User Signup Route
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user object
    const newUser = new user({ email, username });

    // Register the new user with a password
    const registeredUser = await user.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Signup successful! Welcome to our website.");
      res.redirect("/");
    });
  } catch (e) {
    // Handle specific errors, such as user already existing
    if (e.name === "UserExistsError") {
      req.flash("error", "User already exists. Please try a different username.");
     
    } else {
      req.flash("error", "Something went wrong. Please try again.");
     
    }

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
    failureFlash: "Invalid username or password.",
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
    req.session.destroy(() => res.redirect("/"));
  });
});

// Home Page Route
app.get("/", async (req, res) => {
  const Book = await home.find({});
  const Kids = await kids.find({});
  const Nonfiction = await nonfiction.find({});
  const Fiction = await fiction.find({});
  const Academic = await academic.find({});
  const ty = await TY.find({});
  const rs = await RS.find({});

  res.render("home.ejs", {
    categoryModels,
    Book,
    Kids,
    Academic,
    ty,
    rs,
    Nonfiction,
    Fiction,
    wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0,
  });
});

// Search Route
app.get("/search", (req, res) => {
  req.flash("error", "Search bar is under construction!");
  return res.redirect("/");
});

// Dynamic Show Details Route
app.get("/show_d/:id/:category", async (req, res) => {
  const { id, category } = req.params;
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

// Add to Cart Route
app.post("/add-to-cart", async (req, res) => {
  try {
    const { productId, image, title, author, description, price, quantity, category } = req.body;

    if (!req.session.cart) req.session.cart = [];

    req.session.cart.push({ productId, image, title, author, description, price, quantity, category });
    req.session.cartCount = req.session.cart.length;
    console.log(category);
    return res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    return res.json({ success: false, message: "Error adding to cart" });
  }
});


app.get("/add_to_cart_message",(req,res)=>{
  req.flash("success", " item added to cart!");
  res.redirect("/");
})

// View Cart Route
app.get("/cart", isloggedIn, (req, res) => {
  res.render("cart.ejs", {
    cart: req.session.cart || [],
    wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0,
  });
});

// Remove from Cart Route
app.post("/remove-from-cart", isloggedIn, (req, res) => {
  try {
    const { productId } = req.body;
    if (!req.session.cart) return res.json({ success: false, message: "Cart is empty." });

    req.session.cart = req.session.cart.filter(item => item.productId !== productId);
    req.session.cartCount = req.session.cart.length;

    req.flash("success", "Cart item removed successfully!");
    res.redirect("/cart");
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing product from cart" });
  }
});

// Buy Now Route
app.get("/buy-now", isloggedIn, (req, res) => {
  res.render("buy_now_form.ejs", {
    wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0,
  });
});

// Process Checkout Route
app.post("/pro-not-avai", async (req, res) => {
  try {
    const { name,phone, email, address, city, state, zipcode, paymentMethod } = req.body;

    const currentDateTime = new Date();
    const newCheckout = new customer({
      currentDateTime,
      user: { _id: req.user._id, email: req.user.email, username: req.user.username },
      billing: { name,phone,email, address, city, state, zipcode },
      payment: { method: paymentMethod },
    });


    await newCheckout.save();

    req.flash("success", "Checkout successful!");
    res.redirect("/pro-not-avai");
  } catch (error) {
    console.log(error);
    req.flash("error", "Error processing checkout. Please try again.");
    res.redirect("/");
  }
});

app.get("/pro-not-avai", async (req, res) => {
  const thenewcustomer = await customer.find({});
  res.render("pro-not-avai.ejs", {
    wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0,
    thenewcustomer,
  });
});

// Add to Wishlist Route
app.post("/add-to-wishlist/:category", isloggedIn, async (req, res) => {
  const { productId } = req.body;
  const { category } = req.params;

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
    const product = await BookModel.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (!req.session.wishlist) req.session.wishlist = [];

    req.session.wishlist.push(product._id);
    req.session.wishlistCount = req.session.wishlist.length;

    req.flash("success", "Product added to wishlist!");
    res.redirect(req.get("referer"));
  } catch (err) {
    res.status(500).json({ error: "Error adding to wishlist" });
  }
});

// Wishlist Route
app.get("/wishlist", async (req, res) => {
  
  if (!req.session.wishlist || req.session.wishlist.length === 0) {
    req.flash("error", "Empty Wishlist!.");
    return res.redirect("/Empty_wishlist");
  }
  try {
    const wishlistProducts = []; 

    
    for (let productId of req.session.wishlist) {
      for (let category in categoryModels) {
        const product = await categoryModels[category].findById(productId);
        console.log("product  info=",product);
        if (product) {
          wishlistProducts.push(product);
          break; 
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
  res.render("Empty_wishlist.ejs", {
    wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0
  });
});

// Remove a product from wishlist
app.post("/remove-from-wishlist", isloggedIn, async (req, res) => {
  const { productId } = req.body;
  console.log(productId);

  try {
    if (!req.session.wishlist) {
      return res.redirect("/wishlist");
    }

    req.session.wishlist = req.session.wishlist.filter((id) => id !== productId);

   
    req.session.wishlistCount = req.session.wishlist.length;

    req.flash("success", "Product Removed From Wishlist!.");
    res.redirect("/wishlist");
  } catch (error) {
    req.flash("error", "product not remove from wishlist!.");
    res.redirect("/wishlist");
  }
});

// API Routes for Wishlist and Cart Count
app.get("/api/wishlist-count", (req, res) => {
  const wishlistCount = req.session.wishlistCount || 0;
  res.json({ wishlistCount });
});

app.get("/api/cart-count", (req, res) => {
  const cartCount = req.session.cartCount || 0;
  res.json({ cartCount });
});

// Reviews

// Redirect unauthenticated user to login before adding a review
app.get("/add_new_review", (req, res) => {
  req.flash("error", "Please Login Before Add Review!");
  res.redirect("/login");
});

// Add a review
app.post("/reviews/:category/:id/views", isloggedIn, async (req, res) => {
  try {
    const { category, id } = req.params;

    const Model = models[category]; 
    if (!Model) {
      return res.status(400).send("Invalid category in post");
    }

    const book = await Model.findById(id); 
    if (!book) {
      return res.status(404).send("Book not found");
    }

    const newReview = new reviews(req.body.review); 
    newReview.owner = req.user._id;
    book.reviews.push(newReview);

    await newReview.save();
    await book.save();
    req.flash("success", "New Review Added!.");
    res.redirect(`/show_d/${id}/${category}`);
  } catch (error) {
    console.error("Error while saving review:", error);
    req.flash("error", "An error occurred while saving the review!.");
  }
});

// Delete a review
app.delete("/reviews/:category/:id/views/:reviewId", isloggedIn, reviewOwner, async (req, res) => {
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
    req.flash("error", "An error occurred while deleting the review!");
  }
});

// About Us
app.get("/aboutus", (req, res) => {
  res.render("aboutus.ejs", {
    wishlistCount: req.session.wishlistCount || 0,
    cartcount: req.session.cartCount || 0
  });
});


// Admin Panel Routes

// Route to render the form for adding a new listing
app.get("/listings/new", (req, res) => {
  res.render("new_product.ejs", {
      wishlistCount: req.session.wishlistCount || 0,
      cartcount: req.session.cartCount || 0,
  });
});

// Route to handle new listing creation with file upload
const upload = multer({ storage });
app.post("/listings/new", upload.single('listing[image]'), async (req, res) => {
  console.log(req.body.listing);
  const { title, author, description, price, category } = req.body.listing;
  const Model = models[category]; 

  if (!Model) {
      return res.status(400).send("Invalid category");
  }

  try {
      const newListing = new Model({
          title,
          author,
          description,
          price,
          image: req.file ? '/uploads/' + req.file.filename : null, // Save the uploaded image path
      });
      console.log(req.file); 

      await newListing.save();
      req.flash("success","New Listing Is Creted!")
      res.redirect(`/show_d/${newListing._id}/${category}`);
  } catch (error) {
      res.status(500).send("Failed to create listing: " + error.message);
  }
});

// Route to render the form for editing a listing
app.get("/listings/:id/:category/edit", async (req, res) => {
  const { id, category } = req.params; 
  const Model = models[category]; 
  if (!Model) {
      return res.status(400).send("Invalid category");
  }

  try {
      const listing = await Model.findById(id); 
      if (!listing) {
          return res.status(404).send("Listing not found");
      }

      res.render("edit_product.ejs", {
          listing,
          category,
          wishlistCount: req.session.wishlistCount || 0,
          cartcount: req.session.cartCount || 0,
      });
  } catch (error) {
      res.status(500).send("Failed to load edit form: " + error.message);
  }
});


app.post("/listings/:id/:category", upload.single('listing[image]'), async (req, res) => {
  const { id, category } = req.params;
  const { title, author, description, price } = req.body.listing;
  const Model = models[category]; 

  if (!Model) {
      return res.status(400).send("Invalid category");
  }

  try {
      const updatedData = {
          title,
          author,
          description,
          price
      };

      // Add new image if uploaded
      if (req.file) {
          updatedData.image = '/uploads/' + req.file.filename;
      }

      // Update the database
      const updatedListing = await Model.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedListing) {
          return res.status(404).send("Listing not found");
      }
      req.flash("success","Successfully Reacord Updated!")
      res.redirect(`/show_d/${updatedListing._id}/${category}`); 
  } catch (error) {
      res.status(500).send("Failed to update listing: " + error.message);
  }
});

// Route to handle deleting a listing
app.delete("/listings/:id/:category", async (req, res) => {
  const { id, category } = req.params; 
  const Model = models[category]; 
  if (!Model) {
      return res.status(400).send("Invalid category");
  }

  try {
      
      const deletedListing = await Model.findByIdAndDelete(id);

      if (!deletedListing) {
          return res.status(404).send("Listing not found");
      }

       const imagePath = path.join(__dirname, deletedListing.image);
      if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); 
      }
      req.flash("success","Reacord is deleted!")
      res.redirect("/"); 
  } catch (error) {
      res.status(500).send("Failed to delete listing: " + error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 9696;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
