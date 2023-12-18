from pyspark.sql.types import StringType
from connexion import get_publications 
import json

from pyspark.sql.functions import countDistinct, count, col, year,explode,split,size ,concat_ws, collect_list, struct


def get_pub_par_anne():

    publications = get_publications()
    nombre_publications_par_annee = publications.groupBy("year").agg(count("*").alias("publication")).orderBy("year")

    # convertir le resultat en json et renvoyer la
    json_result = nombre_publications_par_annee.toJSON().collect()
    # improuve the json result
    json_result = [json.loads(x) for x in json_result]

    return json_result
