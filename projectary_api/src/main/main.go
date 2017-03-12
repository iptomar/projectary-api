//https://github.com/appleboy/gin-jwt --securing api with jwt
//http://blog.narenarya.in/build-rest-api-go-mysql.html
//http://phalt.co/a-simple-api-in-go/
//https://medium.com/@etiennerouzeaud/how-to-create-a-basic-restful-api-in-go-c8e032ba3181
//http://phalt.co/a-simple-api-in-go/
//https://github.com/appleboy/gin-jwt
package main

import (
//	"main/data"
//  "strconv"
//	"database/sql"
	"main/controllers"
	"gopkg.in/appleboy/gin-jwt.v2"
    "gopkg.in/gin-gonic/gin.v1"
    "time"
	"os"
  _ "github.com/go-sql-driver/mysql"
)

func main(){
	//Lê a porta da variável de ambiente port
	port := os.Getenv("PORT")
	if port == "" {
        port = "80"
    }
	//Define Gin em modo de debug (útil resolver bugs)
	gin.SetMode(gin.DebugMode); 
	//Define Gin em modo de release
	//gin.SetMode(gin.ReleaseMode);
	
	//Incializa o Gin com o parâmetros por defeito
	g := gin.Default();

	// the jwt middleware responsável para segurança da api
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
	
	//Definição das rotas de segurança
	slash := g.Group("/")
	{
		slash.GET("/",controllers.ShowMsg)
		slash.POST("/login",authMiddleware.LoginHandler)
		slash.GET("/refresh_token", authMiddleware.MiddlewareFunc(), authMiddleware.RefreshHandler)		
	}
	
	//Definição das rotas da api
	api := g.Group("/api/")
	api.Use(authMiddleware.MiddlewareFunc())
	{
		api.POST("/users", controllers.PostUser)
        api.GET("/users", controllers.GetUsers)
        api.GET("/users/:id", controllers.GetUser)
        api.PUT("/users/:id", controllers.UpdateUser)
        api.DELETE("/users/:id", controllers.DeleteUser)
	}
	
	//Executa o Gin
	g.Run(":"+port)
}

