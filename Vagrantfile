# -*- mode: ruby -*-
# vi: set ft=ruby :


$script = <<SCRIPT
user="$1"
if [ -z "$user" ]; then
    user=vagrant
fi


apt-get update -q
apt-get install -q -y apt-transport-https ca-certificates git

chown ubuntu:ubuntu -R /home/ubuntu/

export DEBIAN_FRONTEND=noninteractive
debconf-set-selections <<< "mysql-server mysql-server/root_password password 123qwe"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password 123qwe"

apt-get update -q
apt-get install -q -y mysql-server

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get update -q
apt-get install -q -y nodejs python-software-properties python g++ make software-properties-common


sudo /usr/bin/npm install -g forever tsc concurrently typescript

cd /vagrant/projectary-api
/usr/bin/npm install

cd /vagrant/projectary-frontend
/usr/bin/npm install

cd /tmp
wget https://raw.githubusercontent.com/iptomar/projectary-bd/master/projectary-bd-dump.sql
sudo mysql -u root -p123qwe -h localhost < projectary-bd-dump.sql
SCRIPT

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
	# nome da box a utilizar. Tem de ser o mesmo que utilizamos com o comando "vagrant box add hasicorp/precise64
	#config.vm.box="ubuntu/trusty64"
	config.vm.box="ubuntu/xenial64"
	# especificar forçando, a versao da box
	# config.vm.box_version="1.1.0"
	# tambem se pode especificar o url da box usando o comando
	# config.vm.box_url = "http://files.vagrantup.com/precise64.box"
	# mais boxes em https://atlas.hashicorp.com/boxes/search?_ga=1.250320517.2055987266.1489777101

	## override.vm.provision :shell, path:"ficheiro.sh" (corre um ficheiro bash de nome ficheiro.sh)
	config.vm.provider :virtualbox do |vb, override|
	override.vm.provision :shell, :inline => $script
	## configura um reencaminhamento de portas da porta 80 para a 4567 do host
	config.vm.network :forwarded_port, guest: 8080, host:8080
  config.vm.network :forwarded_port, guest: 3306, host:33060
	end
end
