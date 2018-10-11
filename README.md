Requirements:
  Node and npm

Installation:
  Clone the repository
  Install dependencies: npm install
  Start the server: node server.js

Database:
  BigApp  

Collections:
    Register : To save user data
              Fields - email, password, username, dob, role, attempts, tokens
    Balanced : To save balanced paranthesis with username
              Fields - paranthesis, username, message

APIs available

  POST /register - to register the information of user
                takes email, username, password, date of birth as input
                sets role if provided else defaults to 'user'

  POST /login - to login and receive a token for further execution
                takes username and password as input

  GET /users - generates list of users including admins
                requires token for authentication
                token to be passed through header with key 'x-auth'
                only admins can access


  DELETE /users/:id - Deletes a user with specific id from Register as well as Balanced collection
                      requires admin authentication token
                      token to be passed through header with key 'x-auth'

  POST /balanced - returns whether paranthesis is balanced or not i.e. "success" or "failed"
                    requires user authentication token
                    token to be passed through header with key 'x-auth'
                    takes paranthesis as input and returns the result with number of attempts made by the user
                    if success, adds balanced paranthesis to Balanced collection with username and message
