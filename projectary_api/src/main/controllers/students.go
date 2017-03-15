package controllers


import (
	"main/db"
	"fmt"
	"net/http"
	"main/models"
	"gopkg.in/gin-gonic/gin.v1"
)

func CreateStudent(g *gin.Context) {
// The futur code
}

func ApproveStudent(g *gin.Context) {
// The futur code
}

func UpdateStudent(g *gin.Context){
// The futur code
}

func GetStudent(g *gin.Context){

		var (
			student  models.Student
			students []models.Student
		)

		rows, err := db.Dbase.Query("select id, studentid from student;")
		if err != nil {
			fmt.Print(err.Error())
		}
		for rows.Next() {
			err = rows.Scan(&student.Id, &student.StudentID)
			students = append(students, student)
			if err != nil {
				fmt.Print(err.Error())
			}
		}
		defer rows.Close()
		g.JSON(http.StatusOK, gin.H{
			"result": students,
			"count":  len(students),
		})
}

func GetStudentsLst(g *gin.Context){
// The futur code
}