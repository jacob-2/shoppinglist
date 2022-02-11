### Shopping List Web App ###

# How to build and run

## Database setup
* Set up a PostgreSQL database
* Install [Goose](https://github.com/pressly/goose)
* Set environment variables `GOOSE_DRIVER=postgres` and `GOOSE_DBSTRING=...` according to Goose docs (the server will also use GOOSE_DBSTRING)
* Run `cd back/migrations && goose up`

## Development
* Run the server: `cd back && export SHOPPING_LIST_DEV=true; go run .`
* Run the client: `cd front && npm i && npm start`
* Navigate to `http://localhost:3000`
* (Optional) Navigate to `http://localhost:3001/api/items/insert-test-data` as desired
* (Optional) Navigate to `http://localhost:3001/api/items/delete-all` as desired

## Production
* Build the client: `cd front && npm i && npm run build`
* Build the server: `cd back && go build`
* Run the server: `cd back && export SHOPPING_LIST_DEV=false; ./back`

# Stack
* React 17
* React Router
* Material-UI
* Golang
* Postgres
* REST