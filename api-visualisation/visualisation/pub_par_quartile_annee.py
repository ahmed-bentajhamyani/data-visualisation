from connexion import get_publications 
import json
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, array_contains

def get_pub_par_quartile_annee(country: str):
    # Supposons que get_publications() renvoie un DataFrame avec toutes les publications
    publications = get_publications()

    # Filtrer les publications où le pays spécifié est dans le tableau de pays
    publications_par_pays = publications.filter(array_contains(col("countries"), country))

    # Regrouper les publications par année et quartile
    publications_par_an_et_quartile = publications_par_pays.groupBy("year").pivot("quartile").agg(count("*").alias("publication"))

    # Remplacer les valeurs null par 0
    publications_par_an_et_quartile = publications_par_an_et_quartile.na.fill(0)

    # Convertir le résultat en JSON
    json_result = publications_par_an_et_quartile.toJSON().collect()

    # Convertir le JSON en liste de dictionnaires
    result_list = [json.loads(x) for x in json_result]

    # Trier la liste de dictionnaires par année
    result_list = sorted(result_list, key=lambda x: x['year'], reverse=True)

    # Supprimer la clé "null" dans chaque objet
    result_list = [{k: v for k, v in item.items() if k != 'null'} for item in result_list]
    # Ajouter les clés manquantes avec des valeurs de 0
    for item in result_list:
        item.setdefault("Q1", 0)
        item.setdefault("Q2", 0)
        item.setdefault("Q3", 0)
        item.setdefault("Q4", 0)

    return result_list
