# -*- mode: ruby -*-
# vi: set ft=ruby :

$script = <<SCRIPT
user="$1"
if [ -z "$user" ]; then
    user=vagrant
fi



apt-get update -q
apt-get install -q -y apt-transport-https ca-certificates git

mkdir /home/ubuntu/goroot
mkdir -p /home/ubuntu/gopath/bin
chown ubuntu:ubuntu -R /home/ubuntu/

mkdir /home/ubuntu/goroot
mkdir -p /home/ubuntu/gopath/bin
curl https://storage.googleapis.com/golang/go1.8.linux-amd64.tar.gz \
           | tar xvzf - -C /home/ubuntu/goroot --strip-components=1

export GOROOT=/home/ubuntu/goroot
export GOPATH=/home/ubuntu/gopath
export PATH=$GOROOT/bin:$GOPATH/bin:$PATH
echo 'export GOROOT=/home/ubuntu/goroot' > /home/ubuntu/.bashrc
echo 'export GOPATH=/home/ubuntu/gopath' >> /home/ubuntu/.bashrc
echo 'export PATH=$GOROOT/bin:$GOPATH/bin:$PATH' >> /home/ubuntu/.bashrc



apt-get update -q
apt-get install -q -y mariadb-server

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get update -q
apt-get install -q -y nodejs python-software-properties python g++ make software-properties-common


SCRIPT

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
	# nome da box a utilizar. Tem de ser o mesmo que utilizamos com o comando "vagrant box add hasicorp/precise64
	#config.vm.box="ubuntu/trusty64"
	config.vm.box="ubuntu/xenial64"
	#config.ssh.username = "ubuntu"
	#config.ssh.password = ""
	#master.vm.box = "ubuntu/xenial64"
	#master.vm.hostname = "master"
	#master.vm.network :private_network, ip: "127.0.0.1"
	#config.ssh.insert_key = true
	#config.ssh.forward_agent = true
	# especificar forçando, a versao da box 
	# config.vm.box_version="1.1.0"
	# tambem se pode especificar o url da box usando o comando
	# config.vm.box_url = "http://files.vagrantup.com/precise64.box"
	# mais boxes em https://atlas.hashicorp.com/boxes/search?_ga=1.250320517.2055987266.1489777101
	
	## override.vm.provision :shell, path:"ficheiro.sh" (corre um ficheiro bash de nome ficheiro.sh)
	config.vm.provider :virtualbox do |vb, override|
	override.vm.provision :shell, :inline => $script
	## configura um reencaminhamento de portas da porta 80 para a 4567 do host
	#config.vm.network :forwarded_port, guest: 80, host:4567
	end
end
  