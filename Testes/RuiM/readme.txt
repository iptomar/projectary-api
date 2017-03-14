estrutura de pastas dentro da pasta go 
(workspace criado por defeito na %userprofile% mas pode ser alterado na PATH)
src -> pastas com as sources. Qualquer excutavel terá a funcao main().
	   Tambem aqui são guardadas as dependencias sacadas com o go get <dependencia>
pkg -> pastas com as dependencias compiladas. Estas são necessarias depois de compilada a aplicação
       .As dependencias em go são compiladas para ficheiros com o mesmo nome mas de extensão .a
bin -> aqui ficam os executaveis das aplicações compiladas.

* ao executar o comando go install <pasta_da_source> o compilador encarrega-se de compilar as dependecias e
  rotina principal e colocá-las nas respectivas pastas pkg e bin.
  