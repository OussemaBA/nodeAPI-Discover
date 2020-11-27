import { Router } from "express";
import {getSearchData} from "../controllers/controller_search";
const router = Router();

router.get(
  "/search",getSearchData
);




export default router;
