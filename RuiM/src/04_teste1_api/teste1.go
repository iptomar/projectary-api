//https://github.com/appleboy/gin-jwt --securing api with jwt
//http://blog.narenarya.in/build-rest-api-go-mysql.html
//http://phalt.co/a-simple-api-in-go/
//https://medium.com/@etiennerouzeaud/how-to-create-a-basic-restful-api-in-go-c8e032ba3181
//http://phalt.co/a-simple-api-in-go/
//https://github.com/appleboy/gin-jwt
package teste1

import (
    "strconv"
	"gopkg.in/appleboy/gin-jwt.v2"
    "gopkg.in/gin-gonic/gin.v1"
    "time"
	"os"
)

type Users struct {
    Id        int    `gorm:"AUTO_INCREMENT" form:"id" json:"id"`
    Firstname string `gorm:"not null" form:"firstname" json:"firstname"`
    Lastname  string `gorm:"not null" form:"lastname" json:"lastname"`
}

func main(){
	port := os.Getenv("PORT")
	if port == "" {
        port = "80"
    }
	//gin.SetMode(gin.DebugMode);
	gin.SetMode(gin.ReleaseMode);
	g := gin.Default();

	// the jwt middleware
	//change this
    authMiddleware := &jwt.GinJWTMiddleware{
        Realm:      "Change This",
		///////////////////////////////////////////////////Change This
        Key:        []byte("Change This"), //Change This
		///////////////////////////////////////////////////
        Timeout:    time.Hour,
        MaxRefresh: time.Hour,
        Authenticator: func(userId string, password string, c *gin.Context) (string, bool) {
            if (userId == "admin" && password == "admin") || (userId == "test" && password == "test") {
                return userId, true
            }

            return userId, false
        },
        Authorizator: func(userId string, c *gin.Context) bool {
            if userId == "admin" {
                return true
            }

            return false
        },
        Unauthorized: func(c *gin.Context, code int, message string) {
            c.JSON(code, gin.H{
                "code":    code,
                "message": message,
            })
        },
        // TokenLookup is a string in the form of "<source>:<name>" that is used
        // to extract token from the request.
        // Optional. Default value "header:Authorization".
        // Possible values:
        // - "header:<name>"
        // - "query:<name>"
        // - "cookie:<name>"
        TokenLookup: "header:Authorization",
        // TokenLookup: "query:token",
        // TokenLookup: "cookie:token",
    }
	
	slash := g.Group("/")
	{
		slash.GET("/",showMsg)
		slash.POST("/login",authMiddleware.LoginHandler)
		slash.GET("/refresh_token", authMiddleware.MiddlewareFunc(), authMiddleware.RefreshHandler)		
	}
	
	api := g.Group("/api/")
	api.Use(authMiddleware.MiddlewareFunc())
	{
		api.POST("/users", PostUser)
        api.GET("/users", GetUsers)
        api.GET("/users/:id", GetUser)
        api.PUT("/users/:id", UpdateUser)
        api.DELETE("/users/:id", DeleteUser)
	}
	
	g.Run(":"+port)
}

func showMsg(g *gin.Context){
        content := gin.H{"msg": "API running"}
        g.JSON(200, content)
}

func PostUser(c *gin.Context) {
// The futur code
}

func GetUsers(c *gin.Context) {
    var users = []Users{
        Users{Id: 1, Firstname: "Oliver", Lastname: "Queen"},
        Users{Id: 2, Firstname: "Malcom", Lastname: "Merlyn"},
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
