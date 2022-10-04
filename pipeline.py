from pyspark.sql import SparkSession
from datetime import datetime, date

from pyspark.sql import Row
import pyspark.sql.functions as F

spark = SparkSession.builder.getOrCreate()

history = spark.read.csv('sample_history.csv', sep='|', header=True)

print(history)
print(history.schema)

history.show(3)