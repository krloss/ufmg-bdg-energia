package br.ufmg.dcc.bdg.energia;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

/*
Estrutura do Banco:

CREATE DATABASE energia;
 */

public class BancoDados {
    private static final String DRIVER_NAME = "com.mysql.jdbc.Driver";
    private static final String SERVIDOR = "localhost";
    private static final String BANCO = "energia";
    private static final String URL = "jdbc:mysql://";
    private static final String USUARIO = "root";
    private static final String SENHA = "toor";

    private static BancoDados instacia;
    public Connection conexao;

    public BancoDados() throws Exception {
        Class.forName(DRIVER_NAME);
        conexao = DriverManager.getConnection(URL + SERVIDOR + '/' + BANCO, USUARIO, SENHA);
    }

    public static BancoDados getInstacia() throws Exception {
        if(null == instacia || instacia.conexao.isClosed()) instacia = new BancoDados();

        return instacia;
    }

    public PreparedStatement criaInstrucao(String sql) throws Exception {
        return conexao.prepareStatement(sql);
    }
}
