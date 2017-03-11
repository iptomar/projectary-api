/* -----------------------------------------------------------------------------------------
                                AGENDA
    1) Aqui deverão ser criadas as estruturas a serem serializadas para JSON conforme 
    	cada View no frontend, ou seja cada estrutura não precisa necessáriamente de corresponder
    	a uma tabela mas aos dados que queremos enviar em cada view
------------------------------------------------------------------------------------------*/

package main

import "time"

// Exemplo de uma estrutura a ser posteriormente apaada ou alterada
type Student struct {
    Id      		string    	`json:"id"`
    Name 			string		`json:"name"`
    Createdin       time.Time 	`json:"createdin"`
}

type Students []Student
