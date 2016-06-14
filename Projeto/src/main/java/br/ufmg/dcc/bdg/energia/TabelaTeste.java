package br.ufmg.dcc.bdg.energia;

/*
CREATE TABLE teste (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    autor VARCHAR(30) NOT NULL,
    nome VARCHAR(30) NOT NULL
);

INSERT INTO teste(autor,nome) VALUES
('Primeiro','Um'),('Segundo','Dois');

SELECT * FROM teste;
 */

import java.sql.ResultSet;

public class TabelaTeste {
    public String autor,nome;

    public TabelaTeste(String autor, String nome) {
        this.autor = autor;
        this.nome = nome;
    }

    public TabelaTeste(ResultSet resultado) throws Exception {
        this(resultado.getString("autor"),resultado.getString("nome"));
        System.out.println(">>> " + autor + ": " + nome);
    }
}

/*
CREATE TABLE teste_geom (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	ponto GEOMETRY NOT NULL);

INSERT INTO teste_geom(ponto) VALUES
(GeomFromText('POINT(-19.86923008300448 -43.96415775020148)'));

INSERT INTO teste_geom(ponto) VALUES
	(GeomFromText('POINT(-19.869502517006683 -43.955810715747134)')),
	(GeomFromText('POINT(-19.859412056405496 -43.9595872660401)')),
	(GeomFromText('POINT(-19.864941708330374 -43.97610967357184)')),
	(GeomFromText('POINT(-19.87914839693475 -43.976281334948794)'));

SELECT id,AsText(ponto) FROM teste_geom WHERE Contains(
	GeomFromText('POLYGON((
        -19.869502517006683 -43.955810715747134,
		-19.859412056405496 -43.9595872660401,
		-19.864941708330374 -43.97610967357184,
		-19.87914839693475 -43.976281334948794,
		-19.869502517006683 -43.955810715747134
    ))'),ponto);
 */
