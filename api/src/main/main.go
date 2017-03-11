/* --------------------------------------------------------------------------------------
                                AGENDA
    Ligações úteis para compreender o código:
    	- https://thenewstack.io/make-a-restful-json-api-go/
    	- https://jwt.io/
    	- http://stackoverflow.com/questions/36236109/go-and-jwt-simple-authentication
    	- http://stackoverflow.com/questions/11353679/whats-the-recommended-way-to-connect-to-mysql-from-go
    	- http://stackoverflow.com/questions/34195360/golang-how-to-use-global-var-across-files-in-a-package

------------------------------------------------------------------------------------------*/

package main

import (
    "log"
    "net/http"
)

// function that starts the service
func main() {

	//Este pedaço de código será utilizado apenas quando tivermos acesso à base de dados
	//OpenConnection(user, password, database)

    // create a new router
    router := NewRouter()
    // puts the service listening on port 8080
    log.Fatal(http.ListenAndServe(":8080", router))
}

