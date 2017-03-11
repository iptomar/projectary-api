/* ----------------------------------------------------------------------------------------
                                AGENDA
	1) Aqui serão definidas todas a funções que interagirão com a base de dados, falta
		saber como a equipa de base de dados vai fornecer os dados, segundo o Paulo
		vão fazer procedimentos para nós apenas termos que os evocar conforme as necessidades
------------------------------------------------------------------------------------------*/

package main

import (
    "log"
    "database/sql"
    //"github.com/go-sql-driver/mysql"
)

var conn *sql.DB

// Open the connection with the database
func OpenConnection(user string, password string, database string){
	var err error
	conn, err = sql.Open("mysql", user+":"+password+"@/"+database)
	// Check for any errors
	if err != nil { panic(err) }
	// Check the ping to MySQL server
	err = conn.Ping()
   	if err != nil { panic(err) }
} 

// Open the connection with de MySQL database
func CloseConnection(){
	conn.Close()
}

// exemplo de um insert numa tabela {table} nos atributos {atr1} e {atr2}
func Insert(algo string){
	// prepare a statement to send to MySQL server where '?' represents he value to insert
	stmt, err := conn.Prepare("INSERT {table} SET {atr1}=?, {atr2}=?")
    if err != nil { panic(err) }
    // execute the prepared statement including the values
    result, err := stmt.Exec("value1", "value2")
    // check for any errors or report the changes
	if err != nil { 
		panic(err)
	}else{
		//returns the number of rows affected
		affect, err := result.RowsAffected()
		// check for any errors or print the changes
		if err != nil { 
			panic(err)
		}else{
			// print in line comand the number of rows affected
			log.Println("%s\t%d", "Rows Affected: ", affect)
		}
	}
}

// exemplo de um select numa tabela {table} ao atributo {atr1}
func Select(algo string){
	//execute an query
	rows, err := conn.Query("SELECT {table}.{atr1} FROM {table}")
	// check for any errors
    if err != nil { panic(err) }
    // runs all rows of the view selected
	for rows.Next() {
		//create a variavel to save the value selected
        var name string
        // assigns the selected value to the variable
        err = rows.Scan(&name)
        // check for any errors
        if err != nil { panic(err) }
    }
}


