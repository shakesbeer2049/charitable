const router = require("express").Router();
const Post = require("../models/Post");
const multer = require("multer")
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, './public/media')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--'+ file.originalname)
  }
})
const upload = multer({storage: storage})

//create donation
router.post("/create", upload.single("image") , (req,res) => {

  const newPost = new Post({
    title: req.body.title,
    desc : req.body.desc,
    amount: req.body.amount,
    image : req.file.filename,
  })
  
  newPost.save()
  .then((result)=>{
    res.redirect("/")
    // res.send(result)
  })
  .catch(err=>console.log(err))
})


//Display approved donations

router.get('/', (req, res) => {
  //find and iterate approved posts
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
})


//show single post to approve
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

//Approve post
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


//get a single post
router.get('/:id', (req, res) => {
  const id = req.params.id
  Post.findById(id)
  .then((result)=>{
    res.render("details", {post:result})
  })
  .catch(err => console.log(err))
})

//DELETE POST
router.delete("/:id", (req, res) => {

  const id = req.params.id
  Post.findByIdAndDelete(id)
    .then((result) => {
        res.json({redirect: '/'})
    })
    .catch(err => console.log(err))
});

module.exports = router;
