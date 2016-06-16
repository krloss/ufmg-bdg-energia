package br.ufmg.dcc.bdg.energia;

import com.google.gson.Gson;
import spark.*;


public class Energia {
    public static void main(String[] args) {
        System.out.println("[Energia] >>> Inicio...");

        if(1 == args.length) {
            System.out.println("[Energia] >>> " + args[0]);
            Spark.externalStaticFileLocation(args[0]);
        }
        else
            Spark.staticFileLocation("/public"); // energia/src/main/resources/public
        
        Spark.get(new Route("/sobre") {
            @Override
            public Object handle(Request request, Response response) {
                return "<H1>Energia 1.0</H1>";
            }
        });

        // salvar?latitude=-19.8690827&longitude=-43.9685728&endereco=UFMG&classificacao=Teste&descricao=Testando
        // {"id":7,"endereco":"UFMG","classificacao":"Teste","descricao":"Testando","latitude":"-19.8690827","longitude":"-43.9685728"}
        Spark.get(new Route("/salvar","application/json") {
            @Override
            public Object handle(Request request, Response response) {
                Ponto ponto = new Ponto(request.queryParams("latitude"),request.queryParams("longitude"),
                    request.queryParams("endereco"),request.queryParams("classificacao"),request.queryParams("descricao"));

                try {
                    return new Gson().toJson(ponto.salvar());
                }
                catch(Exception e) {
                    return e.getMessage();
                }
            }
        });

        // remover/7
        Spark.get(new Route("/remover/:id","application/json") {
            @Override
            public Object handle(Request request, Response response) {
                String id = request.params(":id");

                if(null == id || "" == id) return "Identificador do Ponto é Obrigatório.";

                try {
                    Ponto.remover(Long.valueOf(id));
                    return "Registro Removido com Sucesso.";
                }
                catch(Exception e) {
                    return e.getMessage();
                }
            }
        });

        // pesquisar?id=3&endereco=ICEX&classificacao=Falta de Energia&descricao=Corte&coordenadas=-19.869502517006683 -43.955810715747134&coordenadas=-19.859412056405496 -43.9595872660401&coordenadas=-19.864941708330374 -43.97610967357184
        // [{"id":3,"endereco":"ICEX","classificacao":"Falta de Energia","descricao":"Corte de Energia","latitude":"-19.86923008300448","longitude":"-43.96415775020148"}]
        Spark.get(new Route("/pesquisar","application/json") {
            @Override
            public Object handle(Request request, Response response) {
                QueryParamsMap coordenadas = request.queryMap("coordenadas");

                try {
                    return new Gson().toJson(Ponto.pesquisar(request.queryMap("id").longValue(),
                        request.queryParams("endereco"),request.queryParams("classificacao"),
                        request.queryParams("descricao"),coordenadas.hasValue() ? coordenadas.values() : null));
                }
                catch(Exception e) {
                    return e.getMessage();
                }
            }
        });
        
        //Spark.get("/", (rq, rs) -> new ModelAndView("index.hbs"), new HandlebarsTemplateEngine());
        System.out.println("[Energia] >>> Fim...");
    }
}
