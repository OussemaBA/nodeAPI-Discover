import {
    Router
} from 'express';
import {
    userbyId,
    showAllUsers,
    getUser,
    updateUserPhoto,
    updateUserInfo,
    deleteUser,
    getUserPhoto,
    addFollower,
    addFollowing,
    removeFollowing,
    removeFollower,
    findPeople
} from '../controllers/controller_user';
import {
    requriedSignIn
} from '../controllers/controller_sign';
const router = Router();


router.delete('/user/:userId',requriedSignIn, deleteUser);
router.get("/users", showAllUsers);

router.get('/user/:userId', requriedSignIn, getUser);
router.put('/user/info/:userId', requriedSignIn, updateUserInfo);

router.put('/user/avatar/:userId', requriedSignIn, updateUserPhoto);
router.get('/user/avatar/:userId', getUserPhoto);

//who to  follow
router.get('/user/findpeople/:userId',requriedSignIn,findPeople);


router.put('/user/follow',requriedSignIn,addFollowing,addFollower)
router.put('/user/unfollow',requriedSignIn,removeFollowing,removeFollower)

//****params */

router.param("userId", userbyId);



export default router;