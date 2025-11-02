const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const reviewController = require("../controllers/reviews.js");
const{isLoggedIn,validateReview,isAuthor} = require("../middleware.js");



//review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//review delete
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;
