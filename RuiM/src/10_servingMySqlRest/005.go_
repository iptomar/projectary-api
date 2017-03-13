package main

import (
    "fmt"
    "log"
    "net/http"
	"encoding/json"
	// adicionar o import do router
	"github.com/gorilla/mux"
)

type User struct {
    Id int `json:"id"`
    Nome string `json:"nome"`
    Apelido string `json:"apelido"`
}

type Users []User 


func homePage(w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "Welcome to the HomePage!")
    fmt.Println("Endpoint Hit: homePage")
}

func returnUser(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "retorna um user especifico(id)")
    fmt.Println("Endpoint Hit: retornaUser")
	
}

// a funcao de cima foi substituida no handler por esta
func returnSingleUser(w http.ResponseWriter, r *http.Request){
    vars := mux.Vars(r)
    key := vars["key"]
    var1 :=vars["var1"]
	var2 :=vars["var2"]
	
	fmt.Println("Var 1: " + var1)
    fmt.Println("Var 2: " + var2)
    fmt.Fprintf(w, "Key: " + key)
}

// esta foi substituida e foram criados 2 users para serem retornados como json
func returnAllUsers(w http.ResponseWriter, r *http.Request){
    users := Users{
        User{Id: 1, Nome: "Nome1", Apelido: "Apelido1"},
        User{Id: 2 , Nome: "Nome2", Apelido: "Apelido2"},
    }    
    fmt.Println("Endpoint Hit: returnAllArticles")
    json.NewEncoder(w).Encode(users)
}

func addUser(w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "Adiciona um user")
    fmt.Println("Endpoint Hit: adicionaUser")
}

func delUser(w http.ResponseWriter, r *http.Request){
    fmt.Fprintf(w, "elimina um user especifico(id)")
    fmt.Println("Endpoint Hit: apagaUser")
}

// atualizada esta funcao com o router que será quem se vai encarregar dos pedidos

func handleRequests() {
    // alterados os handlers 
    myRouter := mux.NewRouter().StrictSlash(true)
    myRouter.HandleFunc("/", homePage)
    myRouter.HandleFunc("/verUsers", returnAllUsers)
	myRouter.HandleFunc("/verUser/{key}/{var1}/{var2}/", returnSingleUser)
    myRouter.HandleFunc("/apagaUser", delUser)
    myRouter.HandleFunc("/adicionaUser", addUser)
    log.Fatal(http.ListenAndServe(":10000", myRouter))
}


func main() {
fmt.Println("Rest API v2.0 - Mux Routers")
    handleRequests()
}