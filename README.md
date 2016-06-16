# bdg-energia
* Usar Java 6+

* Uso: java -jar energia-1.0.jar Layout/

* Exemplos de chamadas:

$.ajax({url:'salvar', dataType:'json',
	data:{latitude:'-19.8690827', longitude:'-43.9685728',
		endereco:'UFMG', classificacao:'Teste', descricao:'Testando'},
	success:function(data,textStatus,jqXHR) {
		alert(data.id +'\n'+ data.endereco +'\n'+ data.classificacao +'\n'+ data.latitude +'\n'+ data.longitude);
	}
});

$.ajax({url:'remover/7', data:{},
	success:function(data,textStatus,jqXHR) { alert(data); }
});

$.ajax({url:'pesquisar', dataType:'json',
	data:{id:3,endereco:'ICEX', classificacao:'Falta de Energia', descricao:'Corte', coordenadas:[
		'-19.869502517006683 -43.955810715747134','-19.859412056405496 -43.9595872660401',-19.864941708330374 -43.97610967357184]},
	success:function(data,textStatus,jqXHR) {
		for(it in data) {
			alert(it.id +'\n'+ it.endereco +'\n'+ it.classificacao +'\n'+ it.latitude +'\n'+ it.longitude);
		}
	}
});
