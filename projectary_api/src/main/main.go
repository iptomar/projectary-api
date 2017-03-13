package main

//Packages imports
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
	//Get port from System environment variable PORT if undefined PORT=80
	port := os.Getenv("PORT")
	if port == "" {
        port = "80"
    }
	//Setups Gin as debug mode - nice to find bugs
	gin.SetMode(gin.DebugMode); 
	//Setups Gin as release mode
	//gin.SetMode(gin.ReleaseMode);
	
	//Initialization of Gin with default parameters  
	g := gin.Default();

	// JWT middleware -  api security
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
	
	//Security routes definition
	slash := g.Group("/")
	{
		slash.GET("/",controllers.ShowMsg)
		slash.POST("/login",authMiddleware.LoginHandler)
		slash.GET("/refresh_token", authMiddleware.MiddlewareFunc(), authMiddleware.RefreshHandler)		
	}
	
	//API routes definition
	api := g.Group("/")
	api.Use(authMiddleware.MiddlewareFunc())
	{	
		//Student Routes
		//1: POST: http://127.0.0.1/api/student
		//2: POST: http://127.0.0.1/api/student/:id/approve
		//3: PUT: http://127.0.0.1/api/student
		//4: GET: http://127.0.0.1/api/student/:id
		//5: GET: http://127.0.0.1/api/student 
		student:= api.Group("/student")
		{	
		student.POST("/", controllers.CreateStudent) //1: Create a student
		student.POST("/:id/approve", controllers.ApproveStudent) //2: Approve a student
		student.PUT("/", controllers.UpdateStudent) //3: Update a student
        student.GET("/:id", controllers.GetStudent)//4: Get a student
		student.GET("/", controllers.GetStudentsLst) //5: Get students list
		}
		
		//Project Routes
		//1: POST: http://127.0.0.1/api/project
		//2: PUT: http://127.0.0.1/api/project/:id
		//3: GET: http://127.0.0.1/api/project/:id
		//4: GET: http://127.0.0.1/api/project
		//5: GET: http://127.0.0.1/api/project/:id/applications
		project:= api.Group("/project")
		{
		project.POST("/", controllers.CreateProject) //1: Create a project
		project.PUT("/:id",controllers.UpdateProject) //2: Update a project
		project.GET("/:id", controllers.GetProject) //3: Get a project
		project.GET("/",controllers.GetProjectsLst) //4: Get project list
		project.GET("/:id/applications", controllers.GetProjectApl) //5: Get applications list
		}
		
		//Application Routes
		//1: POST: http://127.0.0.1/api/application
		//2: POST: http://127.0.0.1/api/application/:id/accept
		//3: GET: http://127.0.0.1/api/application
		//4: GET: http://127.0.0.1/api/application/:id
		application := api.Group("/application")
		{
		application.POST("/", controllers.ApplyProject) //1: Apply for a Project
		application.POST("/:id/accept",controllers.AcceptApl) //2: Aprove a application
		application.GET ("/", controllers.GetAllAplLst) //3: Get application list
		application.GET ("/:id", controllers.GetSpecificAplLst) //4: Get a specific application list
		}
		
		//Teacher routes
		//1: POST: http://127.0.0.1/api/teacher
		//2: PUT: http://127.0.0.1/api/teacher
		teacher:= api.Group("/teacher")
		{
		teacher.POST("/", controllers.CreateTeacher) //1: Create a teacher
		teacher.PUT("/", controllers.UpdateTeacher) //2: Update a teacher
		}		
	}
	
	//Starts Gin
	g.Run(":"+port)
}

