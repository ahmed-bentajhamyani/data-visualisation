import pyspark

def get_config():
    return  pyspark.SparkConf().set("spark.jars.packages","org.mongodb.spark:mongo-spark-connector_2.12:3.0.1").setMaster("local").setAppName("My App").setAll([("spark.driver.memory","40g"), ("spark.executer.memory","50g")])