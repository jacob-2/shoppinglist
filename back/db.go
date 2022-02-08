package main

import (
	"context"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
)

var db *pgxpool.Pool

func initDB() (err error) {
	db, err = pgxpool.Connect(context.Background(), os.Getenv("GOOSE_DBSTRING"))
	return
}

func closeDB() {
	db.Close()
}