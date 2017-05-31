Atualização de 29-05-2017 19:58

- A vagrant file irá criar uma máquina virtual com mysql e nodejs
- Instalar o Vagrant de https://www.vagrantup.com/downloads.html
- Instalar o Cygwin e nos plugins, instalar o openssh (procurar em net)
- Instalar a Virtualbox (a máquina virtual irá ser criada na Virtualbox, mas não é necessario abrir a Virtualbox)
- ir a linha de comandos e aceder a pasta onde está a Vagrantfile (Ex. cd\PSI\Trabalho)
- Convem que esta pasta tenha os repositorios do GIT porque a máquina virtual mapeia a pasta onde está a VagrantFile tornando-a acessivel
 a partir do sistema operativo Host e do Guest.
- P.S. SE EXISTIR ALGUMA VAGRANT MACHINE CRIADA, UTILIZAR O COMANDO "vagrant destroy"
- executar o comando "vagrant up" dentro da pasta da VagrantFile, irá sacar a maquina e configurá-la de acordo com o ficheiro
- para aceder por ssh, fazer "vagrant ssh" e terá acesso à shell da máquina (é necessário o cygwin instalado, com o putty não dá)
- em shell do ubuntu, a pasta partilhada com o SO do host está em /vagrant (nao confundir com /home/vagrant). Esta pasta é a mesma onde está
 a VagrantFile e tudo o que for aqui criado está sincronizado entre a máquina virtual e a pasta no host
- para sair da shell fazer "exit" na shell da máquina virtual
- para parar a máquina virtual, depois de ter saído da shell para a linha de comandos do Sistema operativo host, fazer "vagrant halt"
- se quiser "destruir" a máquina virtual (por exemplo pra libertar espaço), basta fazer "vagrant destroy". A VagrantFile continua na pasta e
 todo o processo pode ser repetido, no entanto todos os dados criados na maquina virtual são eliminados quando se faz "vagrant destroy"
- Se quiser remover definitivamente a máquina virtual, fazer "vagrant box remove ubuntu/xenial64" (vagrant box remove nome_da_maquina)


- Mysql Instalado
- node js instalado
- yarn instalado (pode ser utilizado em vez do npm)
- alteradas credenciais do root do mysql para a password '123qwe'
- alterados os hosts com permissão para aceder ao mysql para todos (%)
- alterado o bind-address do mysql para 0.0.0.0 e permitir ligação a partir de outros hosts
- portas redirecionadas : 8080 -> 8080 (backend api), 3306 -> 33060 (mysql)
- portas redirecionadas : 3000 -> 3000 e 3001 -> 3001 (frontend)
- portas redirecionadas : 80 -> 10000 (nginx - testes)
- existe uma linha comentada de não utilização de links simbolicos para quem tiver problemas em 
  linha de comandos de windows (de acordo com o André apenas em modo normal, em modo de Admin não dá erro)

IMPORTANTE : Alguns colegas estão a ter problemas com a instalação automática do script da Vagrantfile.
Em alguns casos foi detetado que tal se devia a terem a pasta do projecto numa path demasiado longa ou com
caracteres especiais. Devem ter a pasta do projecto o mais junto da rais e numa pasta com o nome limpo, 
exemplo : c:\PSI 
e ter os repositorios clonados dentro dessa pasta

para executar o servidor da aplicação, entrar na vagrant machine com "vagrant ssh" e fazer :
cd /vagrant/projectary-api
npm run frontend
ou
yarn run frontend

e no host aceder a http://127.0.0.1:8080

- Se pretenderem alterar a porta 80 do servidor nginx, o ficheiro de configuração está em 
  /etc/nginx/sites-enabled e se estiver a utilizar a configuração por defeito, existe um ficheiro de nome "default"
  nesta pasta. Editar o ficheiro e alterar a porta 80 na directiva server{} para a porta pretendida. 
  É depois necessário alterar o ficheiro Vagrantfile para que o mapeamento coincida com a nova porta e 
  reiniciar o serviço na maquina virtual (sudo service nginx restart)