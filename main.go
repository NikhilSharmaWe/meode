package main

import (
	"net/http"

	"github.com/gorilla/websocket"
)

type application struct {
	upgrader *websocket.Upgrader // used for upgrading http connections to websocket connections
	clients  map[int]*websocket.Conn
}

func main() {
	clients := make(map[int]*websocket.Conn)
	app := &application{
		upgrader: &websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		clients: clients,
	}
	router := app.routes()
	http.ListenAndServe(":3000", router)
}
