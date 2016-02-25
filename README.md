# apiSkeleton
Skeleton code for an API, packaged with signup, login and login checking, and basic token functionality.

#Installation

1.  run npm install on the downloaded repo.
2.  in the root folder, start the API with 'node server.js'
3.  Open Insomnia, and perform a GET request to http://localhost:8080/api/test. If you see the 'Connected Successfully' message, you are ready to go.

##Available Pre-packaged Routes

1.  /api/signup: Performs a user registration.
-  Parameters:
  -  name
  -  email
  -  password
2.  /api/login: Logs in a user
-  Parameters:
  -  email
  -  password
3.  /api/checklogin: checks a user's login status against a userID/token
-  Parameters:
  -  user_id
  -  token
