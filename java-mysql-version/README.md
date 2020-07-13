# bdg-energia

* Usar Java 6+

## Uso :
> java -jar energia-1.0.jar [ SITE_FILES_PATH ]

> [Link Local - http://localhost:4567/](http://localhost:4567/)

## Banco :
```sql
CREATE DATABASE energia;
CREATE TABLE ponto (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    coordenadas GEOMETRY NOT NULL,
    endereco VARCHAR(120),
    classificacao VARCHAR(30),
    descricao VARCHAR(120)
);
```
```sql
INSERT INTO ponto(coordenadas,endereco,classificacao,descricao) VALUES
	(GeomFromText('POINT(-19.869502517006683 -43.955810715747134)'),'Antonio Carlos','Nenhum','Nada Ocorreu'),
	(GeomFromText('POINT(-19.859412056405496 -43.9595872660401)'),'Abrahao Caran','Nenhum','Sem Problemas'),
(GeomFromText('POINT(-19.86923008300448 -43.96415775020148)'),'ICEX','Falta de Energia','Corte de Energia'),
	(GeomFromText('POINT(-19.864941708330374 -43.97610967357184)'),'Alfredo Camarate','Nenhum','Nada Ocorreu'),
	(GeomFromText('POINT(-19.87914839693475 -43.976281334948794)'),'Carlos Luz','Nenhum','Sem Problemas');


SELECT id,AsText(coordenadas) AS coordenadas,endereco,classificacao,descricao FROM ponto WHERE
	Contains(GeomFromText('POLYGON((-19.869502517006683 -43.955810715747134,-19.859412056405496 -43.9595872660401,-19.864941708330374 -43.97610967357184,-19.87914839693475 -43.976281334948794,-19.869502517006683 -43.955810715747134))'),coordenadas);
```

## Chamadas :
```javascript
$.ajax({url:'salvar', dataType:'json',
	data:{latitude:'-19.8690827', longitude:'-43.9685728',
		endereco:'UFMG', classificacao:'Teste', descricao:'Testando'},
	success:function(data,textStatus,jqXHR) {
		alert(data.id +'\n'+ data.endereco +'\n'+ data.classificacao +'\n'+ data.latitude +'\n'+ data.longitude);
	}
});
```
```javascript
$.ajax({url:'remover/7', data:{},
	success:function(data,textStatus,jqXHR) { alert(data); }
});
```
```javascript
$.ajax({url:'pesquisar', dataType:'json', traditional:true, data:{
        id:3, endereco:'ICEX', classificacao:'Falta de Energia', descricao:'Corte',
        coordenadas:['-19.869502517006683 -43.955810715747134','-19.859412056405496 -43.9595872660401','-19.864941708330374 -43.97610967357184']
    },
	success:function(data,textStatus,jqXHR) {
        for(i in data)
            alert(data[i].id +'\n'+ data[i].endereco +'\n'+ data[i].classificacao +'\n'+ data[i].latitude +'\n'+ data[i].longitude);
	}
});
```
