Projectary API
==============

## Database

The database can be found [here](https://github.com/iptomar/projectary-bd)

## Installation
By [@diogosantosmendes](https://github.com/diogosantosmendes) && [@secprog](https://github.com/secprog) <br>
```bash
$ go env
$ set GOPATH={ABSOLUTE_PATH}\projectary_api
$ set GOBIN={ABSOLUTE_PATH}\projectary_api\bin
$ cd {ABSOLUTE_PATH}\projectary_api\src\main
$ go install
$ go run main.go or cd ../../bin && main.exe
```
Might be useful
```bash
$ export GOPATH={ABSOLUTE_PATH}\projectary_api
$ export GOBIN={ABSOLUTE_PATH}\projectary_api\bin
$ go get {repository}
```

## Methods

| Method | Arguments | User | Description |
| --- | --- | --- | --- |
| POST | /STUDENT | [GUEST] | Create a Student |
| POST | /STUDENT/:ID/:ACTION | [ADMIN] | Approve or disapprove a Student |
| PUT | /STUDENT | [STUDENT] | Update a Student |
| GET | /STUDENT | [TEACHER] | Get students list |
| GET | /STUDENT/:ID | [TEACHER] | Get a student |
| POST | /PROJECT | [TEACHER] | Create a Project |
|PUT | /PROJECT/:ID | [TEACHER] | Update a Project |
|GET | /PROJECT | [STUDENT] | Get Projects list |
|GET | /PROJECT/:ID	| [STUDENT] | Get a project |
|GET | /PROJECT/:ID/:APPLICATIONS | [TEACHER] | Get applications list |
|POST | /APPLICATION | [STUDENT] | Apply for a Project |
|POST | /APPLICATION/:ID/:ACTION | [ADMIN] | Approve or disapprove a Student |
|POST | /TEACHER | [ADMIN] | Create a Teacher |
|PUT | /TEACHER | [TEACHER] | Update a Teacher |
|GET | /APPLICATION |	[ADMIN] | Get Application list |
|GET | /APPLICATION/:ID | [TEACHER] | Get a specific application list |

## Structure
By [@diogosantosmendes](https://github.com/diogosantosmendes)

    projectary_api
    |	readme.txt
    |	bin
    |	| main.exe [Compiled libraries]
    |	pkg
    |	|	windows_amd64 [Compiled libraries]
    |	src
    |	|	github.com
    |	|		[Subfolders with required libraries]
    |	|	golang.org
    |	|		[Subfolders with required libraries]
    |	|	gopkg.in				
    |	|	| [Subfolders with required libraries]
    |	|	|
    |	|	main
    |	|	|	model       [Data Model]
    |	|	|	controllers [Routes with code implementation]
    |	|	|
    |	|	|	main.go     [Method routes and main code]
    |	|	|
