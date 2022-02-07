### Shopping List Web App ###

# How to build and run

## Development
* Run the server: `cd back && SHOPPING_LIST_DEV=true; go run .`
* Run the client: `cd front && npm start`
* Navigate to `http://localhost:3000`
* (Optional) Navigate to `http://localhost:3001/api/items/insert-test-data` as desired
* (Optional) Navigate to `http://localhost:3001/api/items/delete-all` as desired

## Production
* Build the client: `cd front && npm build`
* Build the server: `cd back && go build`
* Run the server: `cd back && SHOPPING_LIST_DEV=false; ./back`

# Stack
* React 17
* React Router
* Material-UI
* Golang
* Postgres
* REST