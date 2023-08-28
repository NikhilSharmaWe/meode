package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type Message struct {
	Additions string `json:"additions"`
	Deletions string `json:"deletions"`
}

type Send struct {
	Data string `json:"data"`
}

func (app *application) routes() *httprouter.Router {
	router := httprouter.New()

	fs := http.FileServer(http.Dir("public"))

	router.ServeFiles("/public/*filepath", http.Dir("public"))
	router.HandlerFunc(http.MethodGet, "/", fs.ServeHTTP)
	router.HandlerFunc(http.MethodGet, "/websocket", app.HandleConnections)

	return router
}

func (app *application) HandleDoc(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/public/", http.StatusFound)
}

func (app *application) HandleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := app.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	content := ""
	for {
		// var resp Response
		// err := conn.ReadJSON(&resp)
		// if err != nil {
		// 	log.Println(err)
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }

		// _, message, err := conn.ReadMessage()
		// if err != nil {
		// 	log.Println(err)
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }
		// fmt.Print(string(message))

		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			break
		}

		if msg.Additions != "" {
			content += msg.Additions
			fmt.Print(msg.Additions)
		} else {
			content = content[:len(content)-len(msg.Deletions)]
			fmt.Print(msg.Deletions)
		}

		data := Send{
			Data: content,
		}

		err = conn.WriteJSON(data)
		if err != nil {
			break
		}
	}
}
