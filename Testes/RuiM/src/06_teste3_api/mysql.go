package main

import (
    _ "github.com/go-sql-driver/mysql"
    "database/sql"
    "fmt"
)

func main() {
    db, err := sql.Open("mysql", "root:mhbnxuvb@/apitest")
    checkErr(err)

    
    // query
    rows, err := db.Query("SELECT * FROM dados1")
    checkErr(err)

    for rows.Next() {
        var id int
        var nome string
        var apelido string
        var criado string
        err = rows.Scan(&id, &nome, &apelido, &criado)
        checkErr(err)
        fmt.Println(id)
        fmt.Println(nome)
        fmt.Println(apelido)
        fmt.Println(criado)
    }

    

    db.Close()

}

func checkErr(err error) {
    if err != nil {
        panic(err)
    }
}