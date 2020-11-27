import { signUp,signIn,signOut,socialLogin} from '../controllers/controller_sign';
import {Router} from 'express';
import signValidator from '../validator/validator_signup';
import { userbyId } from '../controllers/controller_user';

const router=Router();

router.post('/signup',signValidator,signUp);
router.post('/signin',signIn);
router.post('/signout',signOut);
router.post("/social-login", socialLogin); 

//************params*********/

router.param("userId",userbyId);



export default router;