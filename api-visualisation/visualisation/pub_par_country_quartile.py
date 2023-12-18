from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, array_contains, explode
from connexion import get_publications 
import json

def get_pub_par_pays_et_quartile():
    # Supposons que get_publications() renvoie un DataFrame avec toutes les publications
    publications = get_publications()
    # Utilisez explode pour déplier la colonne des pays
    df_expanded_countries = publications.select("countries", "quartile").withColumn("country", explode("countries"))

    # Regrouper les publications par pays et quartile
    publications_par_country_et_quartile = df_expanded_countries.groupBy("country").pivot("quartile").agg(count("*").alias("nombre_publications"))

    # Remplacer les valeurs null par 0
    publications_par_country_et_quartile = publications_par_country_et_quartile.na.fill(0)

     # Trier le DataFrame par le nombre total de publications dans chaque pays
    publications_par_country_et_quartile = publications_par_country_et_quartile.orderBy("Q1", "Q2", "Q3", "Q4", ascending=False)


    # Convertir le résultat en JSON
    json_result = publications_par_country_et_quartile.toJSON().collect()

    # Convertir le JSON en liste de dictionnaires
    result_list = [json.loads(x) for x in json_result]

     # Supprimer la clé "null" dans chaque objet
    result_list = [{k: v for k, v in item.items() if k != 'null'} for item in result_list]

    # Ajouter les clés manquantes avec des valeurs de 0
    for item in result_list:
        item.setdefault("Q1", 0)
        item.setdefault("Q2", 0)
        item.setdefault("Q3", 0)
        item.setdefault("Q4", 0)

    return result_list