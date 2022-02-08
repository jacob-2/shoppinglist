package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)



func itemsApi(r *mux.Router) {
	if os.Getenv("SHOPPING_LIST_DEV") == "true" {
		r.HandleFunc("/insert-test-data", insertMany)
		r.HandleFunc("/delete-all", deleteAll)
	}
	
	// GET
	r.HandleFunc("/{id}", getItem).Methods("GET")
	r.NewRoute().HandlerFunc(list).Methods("GET")

	// POST
	r.HandleFunc("/{id}", updateItem).Methods("POST")
	r.NewRoute().HandlerFunc(newItem).Methods("POST")

	// DELETE
	r.HandleFunc("/{id}", deleteItem).Methods("DELETE")

}

func list(w http.ResponseWriter, r *http.Request) {
	var from, limit int
	var err error
	fromStr := r.FormValue("from")
	limitStr := r.FormValue("limit")
	if fromStr == "" {
		from = 1
	} else {
		from, err = strconv.Atoi(fromStr)
		if err != nil {
			send400(w)
			return
		}
	}
	if limitStr == "" {
		limit = 20
	} else {
		limit, err = strconv.Atoi(limitStr)
		if err != nil {
			send400(w)
			return
		}
	}

	rows, err := db.Query(
		context.Background(),
		`
		select id, title, description, quantity, purchased
		from items
		where id >= $1
		limit $2
		`,
		from, limit,
	)
	if err != nil {
		send500(w, err)
		return
	}
	defer rows.Close()

	its := make([]Item, 0, limit)
	for rows.Next() {
		var it Item
		err = rows.Scan(
			&it.ID, &it.Title, &it.Description, &it.Quantity, &it.Purchased)
		if err != nil {
			send500(w, err)
			return
		}
		its = append(its, it)
	}
	send200(w, &Response{Data: its})
}

func getItem(w http.ResponseWriter, r *http.Request) {
	id, ok := mux.Vars(r)["id"]
	if !ok {
		send400(w)
		return
	}

	var it Item
	var err error
	it.ID, err = strconv.Atoi(id)
	if err != nil {
		send400(w)
		return
	}

	row := db.QueryRow(
		context.Background(),
		`
		select id, title, description, quantity, purchased
		from items
		where id = $1
		`,
		it.ID,
	)
	err = row.Scan(
		&it.ID, &it.Title, &it.Description, &it.Quantity, &it.Purchased)
	if err != nil {
		send500(w, err)
		return
	}
	send200(w, &Response{Data: it})
}

func newItem(w http.ResponseWriter, r *http.Request) {
	var it Item
	var err error
	err = json.NewDecoder(r.Body).Decode(&it)
	if err != nil {
		send400(w)
		return
	}

	cmdTag, err := db.Exec(
		context.Background(),
		`
		insert into
		items (title, description, quantity, purchased)
		values ($1, $2, $3, $4)
		`,
		it.Title, it.Description, it.Quantity, it.Purchased,
	)
	if err != nil {
		send500(w, err)
		return
	}
	if cmdTag.RowsAffected() != 1 {
		send404(w)
		return
	}
	send200(w, nil)
}

func updateItem(w http.ResponseWriter, r *http.Request) {
	id, ok := mux.Vars(r)["id"]
	if !ok {
		send400(w)
		return
	}

	var it Item
	var err error
	it.ID, err = strconv.Atoi(id)
	if err != nil {
		send400(w)
		return
	}
	err = json.NewDecoder(r.Body).Decode(&it)
	if err != nil {
		send400(w)
		return
	}

	cmdTag, err := db.Exec(
		context.Background(),
		`
		update items
		set (title, description, quantity, purchased)
			= ($2, $3, $4, $5)
		where id = $1
		`,
		it.ID, it.Title, it.Description, it.Quantity, it.Purchased,
	)
	if err != nil {
		send500(w, err)
		return
	}
	if cmdTag.RowsAffected() != 1 {
		send404(w)
		return
	}
	send200(w, nil)
}

func deleteItem(w http.ResponseWriter, r *http.Request) {
	idStr, ok := mux.Vars(r)["id"]
	if !ok {
		send400(w)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		send400(w)
		return
	}

	cmdTag, err := db.Exec(
		context.Background(),
		`delete from items where id = $1`,
		id,
	)
	if err != nil {
		send500(w, err)
		return
	}
	if cmdTag.RowsAffected() != 1 {
		send404(w)
		return
	}
	send200(w, nil)
}

func deleteAll(w http.ResponseWriter, r *http.Request) {
	_, err := db.Exec(
		context.Background(),
		`delete from items`,
	)
	if err != nil {
		send500(w, err)
		return
	}
	send200(w, nil)
}

func insertMany(w http.ResponseWriter, r *http.Request) {
	it := Item{0, "Tomatoes", "Green cherry tomatoes", 5, false}
	var err error

	_, err = db.Exec(
		context.Background(),
		fmt.Sprint(`
			insert into
			items (title, description, quantity, purchased)
			values `,
			strings.Repeat(`($1, $2, $3, $4),`, 44),
			`($1, $2, $3, $4)`, // end without comma
		),
		it.Title, it.Description, it.Quantity, it.Purchased,
	)
	if err != nil {
		send500(w, err)
		return
	}
	send200(w, nil)
}

type Item struct {
	ID int `json:"id,omitempty"`
	Title string `json:"title"`
	Description string `json:"description"`
	Quantity int `json:"quantity"`
	Purchased bool `json:"purchased"`
}

type Response struct{
	Data interface{} `json:"data,omitempty"`
	Error string `json:"error,omitempty"`
}

func send200(w http.ResponseWriter, resp *Response) {
	if resp != nil {
		byts, err := json.Marshal(resp)
		if err != nil {
			send500(w, err)
			return
		}
		w.WriteHeader(200)
		w.Write(byts)
		return
	}
	w.WriteHeader(200)
}

func send400(w http.ResponseWriter) {
	w.WriteHeader(400)
}

func send404(w http.ResponseWriter) {
	w.WriteHeader(404)
}

func send500(w http.ResponseWriter, err error) {
	log.Println("sent 500:", err)
	w.WriteHeader(500)
}
