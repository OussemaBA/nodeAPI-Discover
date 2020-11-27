For Posts
----------------------------------
get    :'/posts'                                                        //Get All Posts
post   :'/post/new/:userId'                                            //Create new Post
get    :'/posts/by/:userId'                                           // get all user's Posts
delete :'/posts/:postById'                                           // Delete a Post
put    :'/posts/update/:postById'                                   // Update a Post
 


 
 For User
-----------------------------------
post    :'/signup'                                               //User Sign Up
post    :'/signin'                                              //User Sign In
post    : '/signout'                                           //User Sign Out


delete  : '/user/:userId'                                   //delete a user
get     : '/users'                                         // get all user
get     : '/user/:userId'                                 // get user by id 
put     : '/user/info/:userId'                           //update a user information
put     : '/user/avatar/:userId'                        //Upload a photo for user
get     : '/user/avatar/:userId'                       //get the user's photo
get     : '/user/findpeople/:userId'                  // show all users not followed by userId
put     : '/user/follow'                             // Follow a user
put     : '/user/unfollow'                          // unfollow a user
