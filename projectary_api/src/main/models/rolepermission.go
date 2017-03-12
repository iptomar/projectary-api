package models

type RolePermission struct {
    Role       		  string    
	Permission	      string
	Select			  int8
	Insert			  int8
	Delete 			  int8
}