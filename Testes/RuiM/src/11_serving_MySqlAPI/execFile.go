package main

import (
	"log"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"github.com/gorilla/mux"
	"strconv"
	// faltava-me este import debaixo apensar de não se queixar. Depois dava-me sempre erro que não se 
	// conseguia ligar a base de dados. Foi a tarde toda para entender o que raio se passava aqui
	// finalmente, comparando com outros codigos vi este import e decidi colocá-lo. Se o colocar diretamente
	// dá um erro de um import que não está a ser utilizado, se tiver o _ antes não se queixa. Esta linguagem
	// não é muito explicita sobre que raio vai fazer. 
	_ "github.com/go-sql-driver/mysql"
)

/*
 * Resp... the typical struct used to send back json responses
 */
type HttpResp struct {
	Status      int    `json:"status"`
	Description string `json:"description"`
	Body        string `json:"body"`
}

/*
 * Category... - a post struct for all my posts
 */
type User struct {
	ID   int    `json:"id"`
	Name string `json:"nome"`
	LastName string `json:"apelido"`
}

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route


func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	db:= connect()
	// fecha a ligação quando terminar de executar a funcao
	defer db.Close()
	
	var Users []User
	results, err := db.Query("SELECT id, nome, apelido FROM dados1")
	
	for results.Next(){
		var user User
		err= results.Scan(&user.ID, &user.Name, &user.LastName)
		if err != nil{
			json.NewEncoder(w).Encode(HttpResp{Status: 500, Description: "Failed to retrieve all users"})
		}
		Users = append(Users, user)
	}
	json.NewEncoder(w).Encode(Users)
	//fmt.Fprintln(w, "All Users!")
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	db:= connect()
	// fecha a ligação quando terminar de executar a funcao
	defer db.Close()
	
	vars := mux.Vars(r)
	userId, err := strconv.Atoi(vars["id"])
	if err != nil {
		fmt.Fprintln(w, "Not a Valid id")
	}
	
	var user User
	// Execute the query
	err = db.QueryRow("SELECT id, nome, apelido FROM dados1 where id = ?", userId).Scan(&user.ID, &user.Name, &user.LastName)
	if err != nil {

		log.Print(err.Error()) // proper error handling instead of panic in your app
		json.NewEncoder(w).Encode(HttpResp{Status: 500, Description: "Failed to select tag from database"})
	}
	json.NewEncoder(w).Encode(user)
	//fmt.Fprintln(w, "Get User:", userId)
}

func InsertUser(w http.ResponseWriter, r *http.Request) {
	db:= connect()
	// fecha a ligação quando terminar de executar a funcao
	defer db.Close()
	decoder := json.NewDecoder(r.Body)
	var user User
	err := decoder.Decode(&user)
	if err != nil {
		log.Print(err.Error())
	}
	stmt, _ := db.Prepare("INSERT INTO dados1 (id, nome, apelido) values (?,?,?) ")
	res, err := stmt.Exec(user.ID, user.Name, user.LastName)
	if err != nil {
		log.Print(err.Error()) // proper error handling instead of panic in your app
		json.NewEncoder(w).Encode(HttpResp{Status: 500, Description: "Failed to insert user into database"})
	}
	id, err := res.LastInsertId()
	if err != nil {
		json.NewEncoder(w).Encode(HttpResp{Status: 500, Description: "Failed to get last insert id"})
	}
	json.NewEncoder(w).Encode(HttpResp{Status: 200, Description: "Successfully Inserted Post Into the Database", Body: strconv.Itoa(int(id))})
	//fmt.Fprintln(w, "Insert User!")
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	db := connect()
	defer db.Close()
	vars := mux.Vars(r)
	userID := vars["id"]
	ID, _ := strconv.Atoi(userID)
	stmt, err := db.Prepare("DELETE FROM dados1 where id = ?")
	if err != nil {
		log.Print(err.Error())
	}
	_, err = stmt.Exec(ID)
	if err != nil {
		json.NewEncoder(w).Encode(HttpResp{Status: 500, Description: "Failed to delete user from database"})
	}
	json.NewEncoder(w).Encode(HttpResp{Status: 200, Description: "Successfully Deleted user from the Database"})
	//fmt.Fprintln(w, "Delete User!")
}

func EditUser(w http.ResponseWriter, r *http.Request) {
	db := connect()
	defer db.Close()
	decoder := json.NewDecoder(r.Body)
	var user User
	err := decoder.Decode(&user)
	vars := mux.Vars(r)
	userID := vars["id"]
	ID, _ := strconv.Atoi(userID)
	stmt, _ := db.Prepare("UPDATE dados1 SET nome = ?, apelido = ? WHERE id = ?")
	_, err = stmt.Exec(user.Name, user.LastName, ID)
	if err != nil {
		log.Print(err.Error())
		json.NewEncoder(w).Encode(HttpResp{Status: 500, Description: "Failed to Update user in the Database"})
	}
	json.NewEncoder(w).Encode(HttpResp{Status: 200, Description: "Successfully Update user in the Database"})
	//fmt.Fprintln(w, "Edit User!")
}

func connect() *sql.DB {
	db, err := sql.Open("mysql", "root:mhbnxuvb@tcp(localhost:3306)/apitest")
	if err != nil {
		log.Fatal("Could not connect to database apitest")
	}
	return db
}

func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {
		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(route.HandlerFunc)
	}
	return router
}

func Index(w http.ResponseWriter, r *http.Request) {
	db := connect();
	defer db.Close()
}

var routes = Routes{
	//Route{"Index", "GET", "/", Index},
	Route{"Index", "GET", "/", Index},
	// All User Routes
	Route{"GetAllUsers", "GET", "/users", GetAllUsers},
	Route{"GetUser", "GET", "/user/{id}", GetUser},
	Route{"InsertUser", "POST", "/user", InsertUser},
	Route{"EditUser", "POST", "/user/{id}", EditUser},
	Route{"DeleteUser", "DELETE", "/user/{id}", DeleteUser},

}
// #########################################################3
func main() {
	router := NewRouter()
	log.Fatal(http.ListenAndServe(":9000", router))
}