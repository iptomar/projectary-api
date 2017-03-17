# -*- mode: ruby -*-
# vi: set ft=ruby :

BOX_NAME = ENV['BOX_NAME'] || "ubuntu/xenial64"
SSH_PRIVKEY_PATH = ENV["SSH_PRIVKEY_PATH"]

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

Vagrant::Config.run do |config|
  config.vm.box = BOX_NAME

  if SSH_PRIVKEY_PATH
      config.ssh.private_key_path = SSH_PRIVKEY_PATH
  end

  config.ssh.forward_agent = true
end

Vagrant::VERSION >= "1.1.0" and Vagrant.configure("2") do |config|
  config.vm.provider :virtualbox do |vb, override|
    override.vm.provision :shell, :inline => $script
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  end
end
