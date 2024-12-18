const reviews = require("./models/reviews");

module.exports.isloggedIn=(req,res,next)=>{
// console.log("owner",req.user);
req.session.user=req.user;
// console.log("this is owner",req.session.user);
          if(!req.isAuthenticated()){
          req.session.redirectUrl=req.originalUrl;
        //   console.log("redirect URLLL",req.session.redirectUrl);
          
          req.session.save(() => { // सेशन सुरक्षित करा
            req.flash("error", "Please Login Before That!.");
           return res.redirect("/login");
          });
        } else {
          next();
        }
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl
  }
  next();
  };



  module.exports.reviewOwner = async (req, res, next) => {
    try {
        const { reviewId,id,category } = req.params;

        // Review शोधा
        const review = await reviews.findById(reviewId);
      
        // जर Review अस्तित्वात नसेल
        if (!review) {
            req.flash("error", "Review Not Found!.");
            return res.redirect(`/`); // Redirect करण्यासाठी योग्य URL वापरा
        }

        // मालक तपासा
        if (!review.owner.equals(res.locals.curruser._id)) {
            req.flash("error", "You are not authorized to perform this action!.");
            // return res.redirect(`/show_d/${id}/${category}`);
            return res.redirect(`/`); 

        }

        next(); // पुढील मिडलवेअरला परवानगी द्या
    } catch (err) {
        console.error(err);
        req.flash("error", "Internal Server Error!.");
        return res.redirect(`/`);// एखाद्या error handling पृष्ठावर रीडायरेक्ट करा
    }
};
