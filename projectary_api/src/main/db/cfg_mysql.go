package db

import (
		"fmt"
	    "database/sql"
		_ "github.com/go-sql-driver/mysql"
)

var Dbase *sql.DB

func DBConnect(){
	var err error
	Dbase,err = sql.Open("mysql","root:@/projectary")
	if err != nil{
		fmt.Printf("[DB-Debug] Error creating connection: %s\n", err.Error())
	} else{
		fmt.Println("[DB-Debug] Connection created")
		}
}

func DBPing() {
	if Dbase==nil{
		fmt.Println("[DB-Debug] Connection not avaliable")
	}else {
		err := Dbase.Ping()
		if err != nil {
				fmt.Printf("[DB-Debug] Connection error: %s\n", err.Error())
		}else {
				fmt.Println("[DB-Debug] Connection avaliable")
		}
	}
}
