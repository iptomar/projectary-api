-A vagrant file irá criar uma máquina virtual com mysql (mariadb), nodejs e go
-Instalar o Vagrant de https://www.vagrantup.com/downloads.html
-Instalar o Cygwin e nos plugins instalar o openssh (procurar em net)
-Instalar a Virtualbox (a máquina virtual irá ser criada na Virtualbox, mas não é necessario abrir a Virtualbox)
-ir a linha de comandos e aceder a pasta onde está a VagrantFile (Ex. cd\PSI\Trabalho)
-Convem que esta pasta tenha os repositorios do GIT porque a máquina virtual mapeia a pasta onde está a VagrantFile tornando-a acessivel
 a partir do sistema operativo Host e do Guest.
-executar o comando "vagrant up" dentro da pasta da VagrantFile, irá sacar a maquina e configurá-la de acordo com o ficheiro
-para aceder por ssh, fazer "vagrant ssh" e terá acesso à shell da máquina (é necessário o cygwin instalado, com o putty não dá)
-em shell do ubuntu, a pasta partilhada com o SO do host está em /vagrant (nao confundir com /home/vagrant). Esta pasta é a mesma onde está
 a VagrantFile e tudo o que for aqui criado está sincronizado entre a máquina virtual e a pasta no host
-para sair da shell fazer "exit" na shell da máquina virtual
-para parar a máquina virtual, depois de ter saído da shell para a linha de comandos do Sistema operativo host, fazer "vagrant halt"
-se quiser "destruir" a máquina virtual (por exemplo pra libertar espaço), basta fazer "vagrant destroy". A VagrantFile continua na pasta e
 todo o processo pode ser repetido, no entanto todos os dados criados na maquina virtual são eliminados quando se faz "vagrant destroy"
-Se quiser remover definitivamente a máquina virtual, fazer "vagrant box remove ubuntu/xenial64" (vagrant box remove nome_da_maquina)
