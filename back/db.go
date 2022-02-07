package main

import (
	"context"
	"os"

	"github.com/jackc/pgx/v4"
)

var db *pgx.Conn

func initDB() (err error) {
	db, err = pgx.Connect(context.Background(), os.Getenv("GOOSE_DBSTRING"))
	return
}

func closeDB() {
	db.Close(context.Background())
}