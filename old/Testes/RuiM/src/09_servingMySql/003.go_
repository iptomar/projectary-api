package main

import (
    "fmt"
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
)


/*
 * Tag... - a very simple struct
 */
type Tag struct {
	Id int    `json:"id"`
	Name string `json:"nome"`
	LastName string `json:"apelido"`
}

func main() {
	// Open up our database connection.
	db, err := sql.Open("mysql", "root:mhbnxuvb@tcp(127.0.0.1:3306)/apiTest")

	// if there is an error opening the connection, handle it
	if err != nil {
		fmt.Print(err.Error())
	}
	defer db.Close()

	// Execute the query
	results, err := db.Query("SELECT id, nome, apelido FROM dados1")
	if err != nil {
		panic(err.Error()) // proper error handling instead of panic in your app
	}

	for results.Next() {
		var tag Tag
		// for each row, scan the result into our tag composite object
		err = results.Scan(&tag.Id, &tag.Name, &tag.LastName)
		if err != nil {
			panic(err.Error()) // proper error handling instead of panic in your app
		}
                // and then print out the tag's Name attribute
		fmt.Println(tag.Id," ",tag.Name," ",tag.LastName)
	}

	
}