from conf import get_config 
from pyspark.sql import SparkSession



def create_spark_session():
    return SparkSession.builder \
        .config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
        .config("spark.driver.memory", "40g") \
        .config("spark.executor.memory", "50g") \
        .appName("My App") \
        .getOrCreate()


def get_publications():
    try:
        spark = create_spark_session()
        mongo_ip = "mongodb://localhost:27017/collected_articles.articles"
        articles = spark.read.format("com.mongodb.spark.sql.DefaultSource").option("uri", mongo_ip).load()
        articles.createOrReplaceTempView("articles")

        print("-----------------------------------------------------------")
        print(articles)
        print("-----------------------------------------------------------")
        return articles
    except Exception as e:
        print(f"Error getting publications: {e}")
    
