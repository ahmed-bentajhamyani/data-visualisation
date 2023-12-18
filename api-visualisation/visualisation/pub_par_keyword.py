from pyspark.sql import functions as F
from connexion import get_publications 
import json

def get_pub_par_keyword():

    publications = get_publications()
    
    # Utilisez explode pour déplier la colonne des mots-clés
    df_expanded_keywords = publications.select(F.explode("keywords").alias("key-word"))
    
    # Normaliser les mots-clés en minuscules
    df_expanded_keywords = df_expanded_keywords.withColumn("keyword", F.lower(F.col("key-word")))
    
    # Grouper par la nouvelle colonne normalisée et compter le nombre de publications
    nombre_publications_par_keyword = df_expanded_keywords.groupBy("keyword").agg(F.count("*").alias("publication")).orderBy("publication", ascending=False)

    # Convertir le résultat en JSON et le renvoyer
    json_result = nombre_publications_par_keyword.toJSON().collect()
    
    # Améliorer le résultat JSON
    json_result = [json.loads(x) for x in json_result]

    # Post-traitement pour rassembler les variantes orthographiques de "Blockchains" et "Blockchain" sous la clé "blockchain" et supprimer les redondances
    final_result = {}
    for item in json_result:
        keyword = item["keyword"]
        if "blockchain" in keyword:
            final_result["blockchain"] = final_result.get("blockchain", 0) + item["publication"]
        else:
            final_result[keyword] = item["publication"]

    return [{"keyword": key, "publication": value} for key, value in final_result.items()]
