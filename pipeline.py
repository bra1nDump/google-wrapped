from pyspark.sql import SparkSession
from datetime import datetime, date

from pyspark.sql import Row
import pyspark.sql.functions as F
import sparknlp 

spark = sparknlp.start()

history = spark.read.csv('sample_history.csv', sep='|', header=True).toDF("kind", "text", "url")

print(history)
print(history.schema)
print(history.columns)

history.show(3)

from pyspark.ml import Pipeline
from sparknlp.annotator import *
from sparknlp.common import *
from sparknlp.pretrained import *
from sparknlp.base import *

document_assembler = DocumentAssembler()\
 .setInputCol("text")\
 .setOutputCol("document")
sentenceDetector = SentenceDetector()\
 .setInputCols(["document"])\
 .setOutputCol("sentences")
tokenizer = Tokenizer() \
 .setInputCols(["sentences"]) \
 .setOutputCol("token")
normalizer = Normalizer()\
 .setInputCols(["token"])\
 .setOutputCol("normal")
word_embeddings=WordEmbeddingsModel.pretrained()\
 .setInputCols(["document","normal"])\
 .setOutputCol("embeddings")
nlpPipeline = Pipeline(stages=[
 document_assembler, 
 sentenceDetector,
 tokenizer,
 normalizer,
 word_embeddings,
 ])
pipelineModel = nlpPipeline.fit(history)

# results=pipelineModel.transform(history)
# results.show(200)

# Search summary
explainPipeline = PretrainedPipeline("explain_document_dl", lang="en")

explainResults = explainPipeline.transform(history).select("entities.result")

explainResults.show(30)