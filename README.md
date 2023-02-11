# Blog-API

## Technology Stack

##### Server-API: Node.js, Expresss.js
##### Authentication: JWT
##### Database: MongoDB, Mongoose

## API Features
- Authentication & Authorization
- Post CRUD Operations including
  - Comment functionality
    - Adding comments
    - Editing previously posted comments
    - Deleting comments
- Administrator features
  - Blocking/unblocking users
- Blog Automation Features
  - Users are made inactive if they haven't posted for 30 days
  - Virtual properties for:
    - Posts created
    - Post views
    - Viewers count
    - Following and followers count
    
## Endpoints
- [API Authentication](#API-Authentication)
  - [Register a new user](#Register-a-new-User)
  - [Login](#User-Login)

- [Users]()
  - [Get Profile]()
  - [Get All Users]()
  - [View a user profiles]()
  - [Following/Unfollowing a user]()
  - [Update User Password]()
  - [Update User Profile]()
  - [Block/Unblock another user]()
  - [Admin user block/unblock]()
  - [Deleting account]()
  - [Upload Profile Photo]()
  
 ## API Authentication
 Many of these endpoints require authenticated, as they will be expecting an authenticated user as part of the request that is sent - in order to access CRUD methods, 
 you need to register users and obtain a JWT access token.
 
 Required endpoints will be expecting a bearer token to be send as 'Authorization' in the request
 
 __Example__:
 `Authorization: Bearer <Your Token>`
 
 #### Register a new User
 ```http
 POST /api/v1/users/register
 ```
 The request body needs to be in JSON format
 
 #### User Login
 ```http
 POST /api/v1/users/login
 ```
 |Parameter        | Type     | Description   | Required |
 |:---------       |:---------|:------------  |:---------|
 |`authentication` | `string` | JWT Token     | No       |
 |`email`          | `string` | User Email    | Yes      |
 |`password`       | `string` | User Password | Yes      |
 
 Example request body:
 ```javascript
 {
    "email": "yourname@email.com",
    "password": "secret"
 }
 ```
 
  
