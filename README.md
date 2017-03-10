Projectary API
==============

## Methods

| Method | Arguments | User | Description |
| --- | --- | --- | --- |
| POST | /STUDENT | [GUEST] | Create a Student |
| POST | /STUDENT/:ID/APPROVE | [ADMIN] | Approve a Student |
| PUT | /STUDENT | [STUDENT] | Update a Student |
| GET | /STUDENT | [TEACHER] | Get students list |
| GET | /STUDENT/:ID | [TEACHER] | Get a student |
| POST | /PROJECT | [TEACHER] | Create a Project |
|PUT | /PROJECT/:ID | [TEACHER] | Update a Project |
|GET | /PROJECT | [STUDENT] | Get Projects list |
|GET | /PROJECT/:ID	| [STUDENT] | Get a project |
|GET | /PROJECT/:ID/APPLICATIONS | [TEACHER] | Get applications list |
|POST | /APPLICATION | [STUDENT] | Apply for a Project |
|POST | /APPLICATION/:ID/ACCEPT | [ADMIN] | Approve a application |
|POST | /TEACHER | [ADMIN] | Create a Teacher |
|PUT | /TEACHER | [TEACHER] | Update a Teacher |
|GET | /APPLICATION |	[ADMIN] | Get Application list |
|GET | /APPLICATION/:ID | [TEACHER] | Get a specific application list |
