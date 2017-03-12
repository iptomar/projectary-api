package controllers

import "gopkg.in/gin-gonic/gin.v1"
import "strconv"
import "main/models"


func PostUser(c *gin.Context) {
// The futur code
}

func GetUsers(c *gin.Context) {
    var users = []models.User{
        models.User{Id: "1", Username: "Oliver", Password: "Queen"},
        models.User{Id: "2", Username: "Malcom", Password: "Merlyn"},
    }
    c.JSON(200, users)

}

func GetUser(c *gin.Context) {
    id := c.Params.ByName("id")
    user_id, _:= strconv.ParseInt(id, 0, 64)

    if user_id == 1 {
        content := gin.H{"id": user_id, "firstname": "Oliver", "lastname": "Queen"}
        c.JSON(200, content)
    } else if user_id == 2 {
        content := gin.H{"id": user_id, "firstname": "Malcom", "lastname": "Merlyn"}
        c.JSON(200, content)
    } else {
        content := gin.H{"error": "user with id#" + id + " not found"}
        c.JSON(404, content)
    }

}

func UpdateUser(c *gin.Context) {
// // The futur code
}

func DeleteUser(c *gin.Context) {
// // The futur code
}