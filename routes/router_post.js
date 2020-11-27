import {
  getPosts,
  createPost,
  postById,
  isPoster,
  deletePost,
  updatePost,
  getPostPhoto,
  viewPost,
  updatePostPhoto,
  like,
  unlike,
  postsByCategory
} from "../controllers/controller_post.js";
import postvalidator from "../validator/validator_post";
import { Router } from "express";
import { requriedSignIn } from "../controllers/controller_sign";
import { userbyId, postedByUser } from "../controllers/controller_user";
import { hasAuthorization } from "../controllers/controller_user";
const router = Router();

router.get(
  "/posts",
  function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  },
  getPosts
);

router.post("/posts/new/:userId", requriedSignIn, postvalidator, createPost);
router.get("/posts/by/:userId", requriedSignIn, postedByUser);
router.delete("/posts/:postById", requriedSignIn, isPoster, deletePost);
router.put("/posts/update/:postById", requriedSignIn, isPoster, updatePost);
router.get("/posts/:postById", viewPost);

router.get("/posts/photo/:postById", getPostPhoto);
router.put("/posts/photo/:postById", updatePostPhoto);

router.param("postById", postById);
router.param("userId", userbyId);


router.get('/posts/byCategory',postsByCategory);
//Likes and Unlikes
router.put('/posts/like',requriedSignIn,like);
router.put('/posts/unlike',requriedSignIn,unlike);


export default router;
