import { Router } from "express";
import { requriedSignIn } from "../controllers/controller_sign";
import { PostBusinessPage ,getBusinessPages,PostsByBizId,updateBizPhoto,bizById,getBizphoto} from "../controllers/controller_business";
const router = Router();

router.get(
  "/biz/recent",getBusinessPages
);

router.post("/biz/new", requriedSignIn, PostBusinessPage);
router.get('/biz/:bizId',(req,res)=>{
    res.send(req.biz)
});


router.put("/biz/photo/:BizById", updateBizPhoto);
router.get("/biz/photo/:BizById",getBizphoto);

router.param("bizId", PostsByBizId);
router.param("BizById", bizById);

export default router;
