package br.ufmg.dcc.bdg.energia;

import com.google.gson.Gson;
import spark.*;

import java.sql.ResultSet;

public class Energia {
    public static void main(String[] args) {
        System.out.println("[Energia] >>> Inicio...");

        if(1 == args.length) {
            System.out.println("[Energia] >>> " + args[0]);
            Spark.externalStaticFileLocation(args[0]);
        }
        else
            Spark.staticFileLocation("/"); // energia/src/main/resources

        Spark.get(new Route("/oi") {
            @Override
            public Object handle(Request request, Response response) {
                return "Olá, testado!";
            }
        });

        Spark.get(new Route("/consulta","application/json") {
            @Override
            public Object handle(Request request, Response response) {
                TabelaTeste teste = null;

                try {
                    ResultSet resultado = new BancoDados().criaInstrucao("SELECT * FROM teste;").executeQuery();

                    while(resultado.next()) {
                        teste = new TabelaTeste(resultado);
                    }
                }
                catch(Exception e) {
                    System.out.println(">>> " + e.getMessage());
                }

                if(teste == null) teste = new TabelaTeste("Autor","Nome");

                return new Gson().toJson(teste);
            }
        });

        System.out.println("[Energia] >>> Fim...");
    }
}
