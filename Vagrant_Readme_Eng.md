Update 29-05-2017 19:58

- The vagrant file will create a virtual machine with MySql and nodejs
- Install Virtualbox (the virtual machine will be set up in Virtualbox, but you don't have to open Virtualbox to run it)
- Install Vagrant from https://www.vagrantup.com/downloads.html
  * tested with versions 1.92 and 1.93 so far
- Install Cygwin and from the plugins, choose to install openssh (search at 'net')
  * this is usefull to access the vagrant machine via ssh 

- go to the command line (in Admin mode if you're using windows) and access the folder where the Vagrantfile is
  located (Ex. cd\PSI\project)
- This folder is where the GIT repositories should be cloned, since the virtual machine maps the folder where the vagrantfile is
  as a shared folder between host and guest machines.
- P.S. IF THERE'S A VAGRANT MACHINE ALREADY, USE "vagrant destroy" to create a new one with the current settings
- Executing the command "vagrant up" within the Vagrantfile's folder, will download the machine file and configure it according to
  the settings present in the file
- in order for you to have access via ssh, you should use "vagrant ssh", and you'll be taken to the virtual machine linux shell
  ( at this stage you need cygwin and openssh. Putty won't work)
- when at the ubuntu's shell, the shared folder is at /vagrant (do not mistake it with /home/vagrant, they're not the same). This folder is
  the one where the Vagrantfile is and everyting you put in here is accessible on both machines.
- to leave the shell just do "exit"
- to stop the virtual machine, after you've left the shell to the host command line, do "vagrant halt"
- if you'd like to remove the virtual machine (to free up some space or so), do "vagrant destroy", the Vagrantfile will remain at the folder
  and when you call "vagrant up", a new machine will be created, however, all data you have within the virtual machine (not shared between the
  host and guest), will be lost. Pay attention to this.
- If you want to remove the virtual machine definetly, do "vagrant box remove ubuntu/xenial64" (or generic "vagrant box remove machine_name")
 

- Mysql Installed
- node js installed
- yarn installed (may be used instead of npm)
- Nginx webserver installed
- MySql root's password changed to '123qwe'
- permited MySql hosts changed to all (%)
- MySql's bind-address changed to 0.0.0.0 in order to allow connections from other hosts
  (this is how you can access MySql from the host OS, via Workbench for instance)
- redirected ports : 8080 -> 8080 (backend api), 3306 -> 33060 (MySql)
					 3000 -> 3000                3001 -> 3001 (both for the frontend)
					 80 -> 10000 (nginx webserver, accessible at host's browser via http://127.0.0.1:10000)
- There's a commented line to not use sym links for those having problems when using windows' command line
  (According to Andre, this happens only when not using admin mode command line).
IMPORTANT : some colleagues are having problems with the Vagrantfile's automatic installation script.
In some cases has been detected that such behaviour was due to having the project in a very long path and 
with special characters. You should put your project folder as close to the root folder as possible and with a
"clean" name, like "c:\PSI".
npm run frontend
ou
yarn run frontend
- to execute the application server, enter the machine shell "vagrant ssh" and type : 
cd /vagrant/projectary-api
npm run frontend
or
yarn run frontend
at the host's browser access it via http://127.0.0.1:8080

- if you'd like to change nginx default port for some other than 80, the configuration file is at
  /etc/nginx/sites-enabled and if this is the default configuration, there should be a file called "default"
  edit the file and replace port 80 at server {} directive with the one you prefer, just remember 2 things : 
  - you must edit the Vagranfile port mapping to match the newly created port, and the service must be restarted.
  