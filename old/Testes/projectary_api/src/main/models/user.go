package models

type User struct {
    Id        string    
	Username  string
	Password  string
	CreatedIn int64
	Locked int8
	Active int8
}