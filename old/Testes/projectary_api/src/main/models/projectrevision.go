package models

type ProjectRevision struct {
    Id        string    
	Project   string
	Start     int64
	End       int64
	CreatedIn int64
	CreatedBy string
}