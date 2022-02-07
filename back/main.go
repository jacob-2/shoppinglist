package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

const staticDir = "../front/build/"

func main() {
	if err := initDB(); err != nil {
		log.Fatalln(err)
	}
	defer closeDB()

	r := mux.NewRouter()
	itemsApi(r.PathPrefix("/api/items").Subrouter())

	r.PathPrefix("/static/").Handler(
		http.StripPrefix("/static/",
			http.FileServer(http.Dir(fmt.Sprint(staticDir, "static")))),
	)

	// Catch-all for SPA; serve index.html
	r.PathPrefix("/").HandlerFunc(spaHandler)
	http.Handle("/", handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}),
		handlers.AllowedMethods(([]string{"GET", "POST", "DELETE"})),
	)(r))

	fmt.Println("Starting server at http://localhost:3001")
	log.Fatalln(http.ListenAndServe("localhost:3001", nil))
}

func spaHandler(w http.ResponseWriter, r *http.Request) {
	index, err := os.Open(fmt.Sprint(staticDir, "index.html"))
	if err != nil {
		w.WriteHeader(500)
		return
	}
	http.ServeContent(w,r, "", time.Time{}, index)
}