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
