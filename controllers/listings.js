const Listing = require("../models/listing");


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    //console.log(req.body);
        const newList=new Listing(req.body.listing);
        newList.owner = req.user._id;
        //newList.image = req.body.listing.image;
        await newList.save();
        req.flash("success","New listing created");
        res.redirect("/listings"); 
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing =await Listing.findById(id)
    .populate({path: "reviews",
        populate: {path: "author",},
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.editListing = async(req,res)=>{
    //console.log(req.params);
    let {id} = req.params;
    let listing =await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};