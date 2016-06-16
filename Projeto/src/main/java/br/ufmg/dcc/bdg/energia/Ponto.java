package br.ufmg.dcc.bdg.energia;

/*
CREATE TABLE ponto (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    coordenadas GEOMETRY NOT NULL,
    endereco VARCHAR(120),
    classificacao VARCHAR(30),
    descricao VARCHAR(120)
);

INSERT INTO ponto(coordenadas,endereco,classificacao,descricao) VALUES
	(GeomFromText('POINT(-19.869502517006683 -43.955810715747134)'),'Antonio Carlos','Nenhum','Nada Ocorreu'),
	(GeomFromText('POINT(-19.859412056405496 -43.9595872660401)'),'Abrahao Caran','Nenhum','Sem Problemas'),

	(GeomFromText('POINT(-19.86923008300448 -43.96415775020148)'),'ICEX','Falta de Energia','Corte de Energia'),

	(GeomFromText('POINT(-19.864941708330374 -43.97610967357184)'),'Alfredo Camarate','Nenhum','Nada Ocorreu'),
	(GeomFromText('POINT(-19.87914839693475 -43.976281334948794)'),'Carlos Luz','Nenhum','Sem Problemas');

SELECT id,AsText(coordenadas) AS coordenadas,endereco,classificacao,descricao FROM ponto
    WHERE Contains(GeomFromText('POLYGON((
        -19.869502517006683 -43.955810715747134,
        -19.859412056405496 -43.9595872660401,
        -19.864941708330374 -43.97610967357184,
        -19.87914839693475 -43.976281334948794,
        -19.869502517006683 -43.955810715747134))'
    ),coordenadas);
 */

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class Ponto {
    private static final String PONTO = "POINT(<COORDENADAS>)";

    public Long id;
    public String endereco,classificacao,descricao;
    private String coordenadas,latitude,longitude;

    public Ponto(String endereco, String classificacao, String descricao) {
        this.endereco = endereco;
        this.classificacao = classificacao;
        this.descricao = descricao;
    }
    public Ponto(String latitude, String longitude, String endereco, String classificacao, String descricao) {
        this(endereco,classificacao,descricao);
        setCoordenadas(latitude,longitude);
    }
    private Ponto(ResultSet resultado) throws Exception {
        this(resultado.getString("endereco"),resultado.getString("classificacao"),resultado.getString("descricao"));
        this.id = resultado.getLong("id");
        this.coordenadas = resultado.getString("coordenadas");
        setCoordenadas(getLatitude(),getLongitude());
    }

    public String getLatitude() {
        if(null == latitude && null == coordenadas) return null;
        if(null == latitude)
            latitude = coordenadas.replaceAll(".*\\(| .*","");

        return latitude;
    }
    public String getLongitude() {
        if(null == longitude && null == coordenadas) return null;
        if(null == longitude)
            longitude = coordenadas.replaceAll(".* |\\).*","");

        return longitude;
    }
    public String getCoordenadas() {
        return getLatitude() +' '+ getLongitude();
    }
    public void setCoordenadas(String latitude, String longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        coordenadas = PONTO.replace("<COORDENADAS>",getCoordenadas());
    }

    public Ponto salvar() throws Exception {
        PreparedStatement instrucao = BancoDados.getInstacia().conexao.prepareStatement(
            "INSERT INTO ponto(coordenadas,endereco,classificacao,descricao) VALUES (GeomFromText(?),?,?,?);",new String[]{"id"});

        instrucao.setString(1,coordenadas);
        instrucao.setString(2,endereco);
        instrucao.setString(3,classificacao);
        instrucao.setString(4,descricao);

        if(1 > instrucao.executeUpdate()) throw new Exception("Registro não Adicionado ao Banco de Dados.");

        ResultSet resultado = instrucao.getGeneratedKeys();

        if(!resultado.next()) throw new Exception("Registro sem Id.");

        id = resultado.getLong(1);
        return this;
    }

    public static void remover(Long id) throws Exception {
        PreparedStatement instrucao = BancoDados.getInstacia().criaInstrucao("DELETE FROM ponto WHERE id = ?;");

        instrucao.setLong(1,id);

        if(1 > instrucao.executeUpdate()) throw new Exception("Registro não Removido do Banco de Dados.");
    }

    public static List<Ponto> pesquisar(Long id, String endereco, String classificacao,
        String descricao, Collection<String> coordenadas) throws Exception {

        return pesquisar(id,endereco,classificacao,descricao,coordenadas.toArray(new String[coordenadas.size()]));
    }
    public static List<Ponto> pesquisar(
        Long id, String endereco, String classificacao, String descricao, String... coordenadas) throws Exception {

        ArrayList<Ponto> retorno = new ArrayList<Ponto>();
        StringBuilder sql = new StringBuilder("SELECT id,AsText(coordenadas) AS coordenadas,endereco,classificacao,descricao FROM ponto");
        boolean possuiCoordenadas = null != coordenadas && 2 < coordenadas.length;

        if(null != id || null != endereco || null != classificacao || null != descricao || possuiCoordenadas) sql.append(" WHERE ");
        if(null != id) sql.append("id = "+ id +" AND ");
        if(null != classificacao) sql.append("classificacao = '"+ classificacao +"' AND ");
        if(null != endereco) sql.append("endereco LIKE '%"+ endereco.replaceAll("\\s","%") +"%' AND ");
        if(null != descricao) sql.append("descricao LIKE '%"+ descricao.replaceAll("\\s","%") +"%' AND ");

        if(possuiCoordenadas) {
            sql.append("Contains(GeomFromText('POLYGON((");

            for(String ponto : coordenadas) sql.append(ponto.replaceAll("[\\s,;/:\\|@#_]+"," ") +",");

            sql.append(coordenadas[0].replaceAll("[\\s,;/:\\|@#_]+"," ") +"))'),coordenadas)");
        }

        ResultSet resultado = BancoDados.getInstacia().criaInstrucao(
            sql.toString().replaceAll(" AND $","") +";").executeQuery();

        while(resultado.next()) retorno.add(new Ponto(resultado));

        return retorno;
    }
}
/*
Ponto ponto = new Ponto("-19.8690827","-43.9685728","UFMG","Teste","Testando inserção pela aplicação.").salvar();
Ponto.pesquisar(null,null,null,null)
ponto.remover(ponto.id);
Ponto.pesquisar(3L,null,null,null)
Ponto.pesquisar(null,"A Car",null,null)
Ponto.pesquisar(null,null,null,"d r")
List<Ponto> pontos = Ponto.pesquisar(null,null,"Nenhum",null)

ArrayList<String> coordenadas
coordenadas.add(pontos.getCoordenadas())
Ponto.pesquisar(null,null,null,null,coordenadas)

Ponto.pesquisar(1L,"A Car","Nenhum","d r",coordenadas)
 */
