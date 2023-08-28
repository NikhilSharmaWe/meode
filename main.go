package main

import (
	"net/http"

	"github.com/gorilla/websocket"
)

type application struct {
	upgrader *websocket.Upgrader // used for upgrading http connections to websocket connections
	clients  map[*websocket.Conn]int
}

func main() {
	clients := make(map[*websocket.Conn]int)
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
