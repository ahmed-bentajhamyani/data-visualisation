from pyspark.sql.types import StringType
from connexion import get_publications
import json

from pyspark.sql.functions import countDistinct, count, col, year, explode, split, size, concat_ws, collect_list, struct


def getAllCountries():
    publications = get_publications()

    # Utilisez explode pour déplier la colonne des pays
    df_expanded_pays = publications.select(explode("countries").alias("pays"))

    # Utilisez distinct() pour obtenir une liste unique de pays
    unique_countries = df_expanded_pays.select("pays").distinct()

    # Convertir le résultat en liste Python et trier les pays
    unique_countries_list = [row.pays for row in unique_countries.collect()]
    unique_countries_list.sort()
    return unique_countries_list