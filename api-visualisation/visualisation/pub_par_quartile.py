from pyspark.sql import SparkSession
from pyspark.sql.functions import count, explode
import json
from connexion import get_publications


def get_pub_par_quartile():
    publications = get_publications()

    nombre_publications_par_quartile = publications.groupBy("quartile").agg(count("*").alias("publication")).orderBy("publication", ascending=False)

    # Convertir le résultat en JSON et le renvoyer
    json_result = nombre_publications_par_quartile.toJSON().collect()
    
    # Améliorer le résultat JSON
    json_result = [json.loads(x) for x in json_result]

    return json_result
