/* --------------------------------------------------------------------------------------
                                AGENDA
    1) É necessário escrever a funções que correspondem a cada rota
        conforme a documentação, até ao momento as rotas são:
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
        notas: 
            i)  as que têm um X são as que já têm a rota definida.
            ii) as que têm um XY são as que já estão escritas.
------------------------------------------------------------------------------------------*/

package main

import (
    "encoding/json"            
    "fmt"
    "net/http"
    "github.com/gorilla/mux"
    "time"
)

// Function that returns the list of students
func GET_StudentList(w http.ResponseWriter, r *http.Request) {
    // Create a list of students
    students := Students{
        Student{Id:"1",Name:"Alberto", Createdin:time.Now()},
        Student{Id:"2",Name:"Bonifácio", Createdin:time.Now()},
    }
    // JSON serialization of students
    err := json.NewEncoder(w).Encode(students)
    // verify if the struct has successfully serialized
    if err != nil { panic(err) }
}

// Function that returns the profile of only one student identified by ID
func GET_StudentByID(w http.ResponseWriter, r *http.Request) {
    // read the received values by query string
    vars := mux.Vars(r)
    // grabs the value identified by ID
    studentID := vars["ID"]
    // print just a string "ID:{ID}"
    fmt.Fprintln(w, "ID:", studentID)
}