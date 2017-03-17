package controllers

import "gopkg.in/gin-gonic/gin.v1"

func ShowMsg(g *gin.Context){
        content := gin.H{"msg": "API running"}
        g.JSON(200, content)
}
