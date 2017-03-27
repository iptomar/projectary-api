Projectary API
==============

## Database

The database can be found [here](https://github.com/iptomar/projectary-bd)

## Installation

```bash
$ cd {ABSOLUTE_PATH}\PJ_API
$ npm install 
```
## Start API Server
```bash
$ cd {ABSOLUTE_PATH}\PJ_API
$ npm start 
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

    PJ_API
    |	
    |	main.js [Main of Project]
    |	package.json [Project Configurations and Dependencies]
    |	node_modules
    |	|		[Subfolders with required libraries]
    |	app
    |	|	controllers
    |	|		[Routes Implementation]
    |	|	auth
    |	|		[User Authentication and Security Implementation]
    |	|	data				
    |	|		[Mysql Connection Definition and Connection Pool]
    |	|	routes
    |	|		[Routes Definition]
