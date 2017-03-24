Por favor leiam.

Segue uma base para a criação da API, em baixo poderão encontrar a esturura das diretorias do projeto.

O Projeto encontra-se organizdo da seguinte forma:

	projectary_api
			|	readme.txt
			|	bin
			|	|	main.exe (executável do serviço da API)
			|	pkg
			|	|	windows_amd64 (bibliotecas compiladas/directório para compilação de bibliotecas)
			|	src
			|	|	github.com
			|	|		subpastas contém bibliotecas necessarias
			|	|	golang.org
			|	|		subpastas contém bibliotecas necessarias
			|	|	gopkg.in				
			|	|	|  subpastas contém bibliotecas necessarias
			|	|	|	
			|	|	main
			|	|	|	model (pasta com estruturas representantes do modelo de dados, necessárias para serialização JSON e operações BD)
			|	|	|	controllers (pasta com as funções associadas às rotas)
			|	|	|	
			|	|	|	main.go (definição de rotas e código do serviço)
			|	|	|	

Comandos necessários no prompt (dica de @diogosantosmendes):
	> go env
	> set GOPATH={caminho_absoluto}\projectary_api
	> set GOBIN={caminho_absoluto}\projectary_api\bin
	> cd {caminho_absoluto}\projectary_api\src\main
	> go install
	> go run main.go ou cd ../../bin && main.exe

//Carece de confirmação (dica de @diogosantosmendes)
comandos necessários no git bash (opcional para importar bibliotecas):
	$ export GOPATH={absolute_path}\projectary_api
	$ export GOBIN={absolute_path}\projectary_api\bin
	$ go get {repository}		
	
//Parte do readme proveniente da inspiração de @diogosantosmendes	