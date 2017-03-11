Por favor leiam.

Segue uma base para a criação da API, em baixo poderão encontrar a esturura das diretorias do projeto
Peço especial atenção para que comentem tudo, comentarios em inglês são a descrição do código e 
	comentários em português são notas para que todos os envolvidos percebam o que está feito, e falta 
	fazer. Todos os ficheiros .go têm um cabeçalho "AGENDA", servirá para nos orientarmos, peço-vos que 
	sigam o padrão. Cada um fica responsável de apagar os seus comentários, caso alguém ache que um 
	comentário não faz sentido comunique ao envolvido mas NÃO APAGUE sem o consentimento dele.

Já retirei os repositórios .git que se encontravam nas bibliotecas da pasta github.com para que baste descarregar ~
	a pasta "api" e correr o executável main.exe, os dados que introduzi na struct para codificar em JSON 
	são meramente exemplificativos.

O Projeto encontra-se organizdo da seguinte forma:

	api
	|	readme.txt
	|	bin
	|	|	main.exe
	|	pkg
	|	|	windows_amd64 (compilação de bibliotecas)
	|	src
	|	|	github.com
	|	|	|	gorilla	(biblioteca necessaria para roteamento)
	|	|	|	go-sql-driver (biblioteca necessária para ligação à base de dados)
	|	|	main
	|	|	|	controller.go (conjunto de handlers associados a uma rota)
	|	|	|	dbconnection.go (funções de manipulação de dados da base de dados)
	|	|	|	main.go (arranque do serviço)
	|	|	|	model.go (estruturas representantes da das views, necessárias para serialização JSON)
	|	|	|	router.go (definição das rotas)

Adotei uma organização dos ficheiros .go o mais aproximado com MVC para facilitar a compreensão do código e 
evitar conflitos de commits para assim podermos render melhor o trabalho.
A organização das pastas foi semelhante à proposta pelo Rui Marques, e o roteamento é parecido ao proposto pelo
Daniel Casimiro, apenas está a ser usada outra framework (mux em vez de gin), penso que é mais facil de aprender e tem
mais documentação.
Procurei o mais simples possivel.

Falta as bases para autenticação!!

Comandos necessários no prompt:
	> go env
	> set GOPATH={absolute_path}\api
	> set GOBIN={absolute_path}\api\bin
	> go install {absolute_path}\api\src\main
	> cd {absolute_path}\api\bin
	> main.exe

comandos necessários no git bash (opcional para importar bibliotecas):
	$ export GOPATH={absolute_path}\api
	$ export GOBIN={absolute_path}\api\bin
	$ go get {repository}
