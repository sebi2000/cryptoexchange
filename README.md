# cryptoexchange

## tech

- nodejs
- express
- mongoose
- oauth with passport.js (github and google)

## get started

- `npm install` to install dependencies
- create a .env file and copy the content from .env.example into it filling in you mongoDb connection string
- `npm run dev` to run the server
- you should see the following lines printed
  - server at http://localhost:1234/api/
  - db connection successfull
- visit `http://localhost:1234/auth/github`


## name convention

FOR BRANCH

feature/name-of-task E.g. feature/endpoint-get-wallet

FOR COMMITS

"[BE/DB/FE] Name-of-task: message" E.g. "[BE] Endpoint to get wallet: implement validation"
