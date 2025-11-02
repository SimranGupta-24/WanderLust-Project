const Listing = require("./models/listing.js");
const {reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js"); 
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in");
        return res.render("users/login.ejs"); 
    }
    next();
}

module.exports.validateListing = (req, res, next) =>{
        //this mean whatever constraints are defined in listingSchema does req.body satisfies those constraints
        let {error} = listingSchema.validate(req.body);
        //console.log(result);
        if(error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else{
            next();
        }
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(res.locals.currUser && !review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) =>{
        //this mean whatever constraints are defined in listingSchema does req.body satisfies those constraints
        let {error} = reviewSchema.validate(req.body);
        //console.log(result);
        if(error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else{
            next();
        }
}

