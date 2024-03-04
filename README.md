Installation
-----------------
- checkout this repository
- `npm install`
- `npm start` will start server on `http://0.0.0.0:7654/`

API
-----------------

 ### POST /login
 body `{"username": "...", "password": "..."}`

 It stores the session token in cookies if the credentials are ok.

 ### POST /logout

 It clears session token from cookies

### GET /stats

 Authorization with session token from cookies
 returns the last message and the number of times `/message` is called.
 just Admin gets this response from the API call.

### POST /message
body `{"from":"...","to": "....", message: ".."}`

 Every logged user can invoke this API endpoint.
