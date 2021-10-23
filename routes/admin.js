const router = require("express").Router();
const Post = require("../models/Post");

//TO BE APPROVED START - redirects to approval
   router.get("/admin-login/to-approve/:id", async(req, res) => {
    try {
      const id = req.params.id 
      Post.findById(id)
      .then((result)=>{
      res.render("admin-view-details", {post:result})
    })
  
    } catch (error) {
      res.status(500).json(error)
    }
  })

 //TO BE APPROVED FINAL - posts will be approved here
 router.put("/admin-login/approve/:id", async(req, res, next) => {
    try {
      const id = req.params.id ;
      const updates = req.body;
      const options = {new:true};
  
      const result = await Post.findOneAndUpdate({_id:req.params.id},{
        $set:{
          approved: true,
        }
      },options
        )
  
      res.render("admin-view",{posts:notApproved})
      // console.log(result)
      // res.status(200).json("done")
      
    } catch (error) {
      res.status(500).json(error)
    }
  })

//DISPLAY APPROVED POSTS - posts that are approved will be displayed
router.get('/approved', (req, res) => {
    const approved = [];
    Post.find()
    .then((result) => {
      result.map(ele => {if(ele.approved == true){
        approved.push(ele);
      } else{
       console.log("no approved posts");
      }})
      res.render("approved-posts", {posts:approved}) 
    } )
    .catch((err)=> console.log(err,"found error"))
  })

  router.get("/" , (req,res) => {

      const approved = [];
      Post.find()
      .then((result) => {
        result.map(ele => {if(ele.approved == true){
          approved.push(ele);
        } else{
         console.log("no approved posts");
        }})
        res.render("index", {posts:approved}) 
      } )
      .catch((err)=> console.log(err,"found error"))
  });



//DELETE POST -- post will be deleted/rejected

router.delete("/:id", (req, res) => {

    const id = req.params.id
    Post.findByIdAndDelete(id)
      .then((result) => {
          res.json({redirect: '/admin-view'})
      })
      .catch(err => console.log(err))
  });

  module.exports = router;