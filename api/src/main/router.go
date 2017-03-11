/* ----------------------------------------------------------------------------------------
                                AGENDA
    1) É necessário configurar as rotas conforme a documentação,
        até ao momento as rotas são:
            - POST  /STUDENT                    [GUEST]     Create a Student
            - POST  /STUDENT/:ID/APPROVE        [ADMIN]     Approve a Student
            - PUT   /STUDENT                    [STUDENT]   Update a Student
            -X GET   /STUDENT                    [TEACHER]   Get students list
            -X GET   /STUDENT/:ID                [TEACHER]   Get a student
            - POST  /PROJECT                    [TEACHER]   Create a Project
            - PUT   /PROJECT/:ID                [TEACHER]   Update a Project
            - GET   /PROJECT                    [STUDENT]   Get Projects list
            - GET   /PROJECT/:ID                [STUDENT]   Get a project
            - GET   /PROJECT/:ID/APPLICATIONS   [TEACHER]   Get applications list
            - POST  /APPLICATION                [STUDENT]   Apply for a Project
            - POST  /APPLICATION/:ID/ACCEPT     [ADMIN]     Approve a application
            - POST  /TEACHER                    [ADMIN]     Create a Teacher
            - PUT   /TEACHER                    [TEACHER]   Update a Teacher
            - GET   /APPLICATION                [ADMIN]     Get Application list
            - GET   /APPLICATION/:ID            [TEACHER]   Get a specific application list
        nota: as que têm um X são as que já estão definidas.
        
    2) É necessário configurar o router de forma a permitir autenticação: 
        Diogo Mendes - para isso aconselho o uso das librarias em github.com/dgrijalva/jwt-go ou 
            github.com/dvsekhvalnov/jose2go
------------------------------------------------------------------------------------------*/

package main

import (
    "net/http"
    "github.com/gorilla/mux"
    "log"
    "time"
)

/* ----------------------------------------------------------------------------------------
 Strutctures to define a model for each Route and the set of Routes
------------------------------------------------------------------------------------------*/
type Route struct {
    name        string              // identification of this route
    method      string              // method of this route
    path        string              // argument of this route
    handler     http.HandlerFunc    // function to this route, present in controller.go file
}
type Routes []Route

/* ----------------------------------------------------------------------------------------
    Functions set of the router.go file 
------------------------------------------------------------------------------------------*/
//function to create a new router
func NewRouter() *mux.Router {
    // inicialization of the router 
    router := mux.NewRouter().StrictSlash(true)
    // runs the set of routes to be initialized in the router
    for _, route := range routes {
        // initiate the handler of the route with the Logger function
        handler := Logger(route.handler, route.name)

        router.
            Methods(route.method).
            Path(route.path).
            Name(route.name).
            Handler(handler)
    }
    return router
}

// function to print in comand line the requested method to the service and the time to respond
func Logger(handler http.Handler, name string) http.Handler {
    // execute the requested service
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            start := time.Now()
            // forward to the function function with the request in controller.go
            handler.ServeHTTP(w, r)
            // print in the line comand the method, the argument, 
            // the handler and the time it took to provide the service 
            log.Printf(
                "%s\t%s\t%s\t%s",
                r.Method,
                r.RequestURI,
                name,
                time.Since(start))
        })
}

/*--------------------------------------------------------------------------
 Global variable, each route is defined to be initialized in the function 
 "func NewRouter() *mux.Router"
--------------------------------------------------------------------------*/
var routes = Routes{
    Route{
        "StudentList",
        "GET",
        "/STUDENT",
        GET_StudentList},
    Route{
        "StudentById",
        "GET",
        "/STUDENT/{ID}",
        GET_StudentByID},
    }