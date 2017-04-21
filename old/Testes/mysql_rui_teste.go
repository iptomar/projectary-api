package main



import (
	"bytes"
	"database/sql"
	"fmt"
	"net/http"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)



func main() {
	db, err := sql.Open("mysql", "root:mhbnxuvb@tcp(127.0.0.1:3306)/apitest")
	if err != nil {
		fmt.Print(err.Error())
	}

	defer db.Close()
	// make sure connection is available
	err = db.Ping()
	if err != nil {
		fmt.Print(err.Error())
	}
	
	type Person struct {
		Id         int
		nome string
		apelido  string		
		criado string
	}
	
	router := gin.Default()
	// Add API handlers here
	router.Run(":3000")
	// GET a person detail
	router.GET("/person/:id", func(c *gin.Context) {
		var (
			person Person
			result gin.H
		)
		id := c.Param("id")
		row := db.QueryRow("select id, nome, apelido, criado from dados1 where id = ?;", id)
		err = row.Scan(&person.Id, &person.nome, &person.apelido, &person.criado)
		if err != nil {
			// If no results send null
			result = gin.H{
				"result": nil,
				"count":  0,
			}
		} else {
			result = gin.H{
				"result": person,
				"count":  1,
			}
		}
		c.JSON(http.StatusOK, result)
	})
	
	// GET all persons
	router.GET("/persons", func(c *gin.Context) {
		var (
			person  Person
			persons []Person
		)
		rows, err := db.Query("select id, nome, apelido, criado from dados1;")
		if err != nil {
			fmt.Print(err.Error())
		}
		for rows.Next() {
			err = rows.Scan(&person.Id, &person.nome, & person.apelido, &person.criado )
			persons = append(persons, person)
			if err != nil {
				fmt.Print(err.Error())
			}
		}
		defer rows.Close()
		c.JSON(http.StatusOK, gin.H{
			"result": persons,
			"count":  len(persons),
		})
	})
	
	// POST new person details
	router.POST("/person", func(c *gin.Context) {
		var buffer bytes.Buffer
		nome := c.PostForm("nome")
		apelido := c.PostForm("apelido")
		criado :=c.PostForm("criado")
		stmt, err := db.Prepare("insert into dados1 (nome, apelido, criado) values(?,?,?);")
		if err != nil {
			fmt.Print(err.Error())
		}
		
		_, err = stmt.Exec(nome, apelido, criado)
		if err != nil {
			fmt.Print(err.Error())

		}
		
		// Fastest way to append strings
		buffer.WriteString(nome)
		buffer.WriteString(" ")
		buffer.WriteString(apelido)
		buffer.WriteString(" ")
		buffer.WriteString(criado)
		defer stmt.Close()
		name := buffer.String()
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf(" %s successfully created", name),
		})
	})
	
	// Delete resources
	router.DELETE("/person", func(c *gin.Context) {
		id := c.Query("id")
		stmt, err := db.Prepare("delete from dados1 where id= ?;")
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = stmt.Exec(id)
		if err != nil {
			fmt.Print(err.Error())
		}
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Successfully deleted user: %s", id),
		})
	})
	
	// PUT - update a person details
	router.PUT("/person", func(c *gin.Context) {
		var buffer bytes.Buffer
		id := c.Query("id")
		nome := c.PostForm("nome")
		apelido := c.PostForm("apelido")
		criado := c.PostForm("criado")
		stmt, err := db.Prepare("update person set nome= ?, apelido= ?, criado= ? where id= ?;")
		if err != nil {
			fmt.Print(err.Error())
		}
		_, err = stmt.Exec(nome, apelido, criado, id)
		if err != nil {
			fmt.Print(err.Error())
		}
		// Fastest way to append strings
		buffer.WriteString(nome)
		buffer.WriteString(" ")
		buffer.WriteString(apelido)
		buffer.WriteString(" ")
		buffer.WriteString(criado)
		defer stmt.Close()
		name := buffer.String()
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Successfully updated to %s", name),
		})
	})
	
}