from pyspark.sql import SparkSession
from datetime import datetime, date

from pyspark.sql import Row
import pyspark.sql.functions as F
import sparknlp 
from pyspark.ml import Pipeline
from sparknlp.annotator import *
from sparknlp.common import *
from sparknlp.pretrained import *
from sparknlp.base import *

spark = sparknlp.start()

history = spark.read.csv('sample_history.csv', sep='|', header=True).toDF("kind", "text", "url")

document = DocumentAssembler()\
    .setInputCol("text")\
    .setOutputCol("document")
    
# we can also use sentence detector here 
# if we want to train on and get predictions for each sentence
# downloading pretrained embeddings
use = UniversalSentenceEncoder.pretrained()\
 .setInputCols(["document"])\
 .setOutputCol("sentence_embeddings")
# the classes/labels/categories are in category column
classsifierdl = ClassifierDLApproach()\
  .setInputCols(["sentence_embeddings"])\
  .setOutputCol("class")\
  .setLabelColumn("category")\
  .setMaxEpochs(50)\
  .setEnableOutputLogs(True)
use_clf_pipeline = Pipeline(
    stages = [
        document,
        use,
        classsifierdl
    ])
    
training_data = spark.createDataFrame([
    ['How to make a python3 spark dataframe', 'work'],
    ['where to go out and eat with friends?', 'fun'],
    ]).toDF("text", "category")

use_pipelineModel = use_clf_pipeline.fit(training_data)

#unknown = use_clf_pipeline.transform(history)
#unknown.show(30)

unknown2 = use_pipelineModel.transform(history)
unknown2.show(30)
data = unknown2.collect()

def sortkey(row):
    try:
        return float(row[5][0][4]["fun"])
    except IndexError:
        return 0



data.sort(key=sortkey)

for x in data[-20:]:
    print(x[1])

light_model = LightPipeline(use_pipelineModel)
text="Euro 2020 and the Copa America have both been moved to the summer of 2021 due to the coronavirus outbreak."
text="loading settings :: url = jar:file:/root/.local/lib/python3.10/site-packages/pyspark/jars/ivy-2.5.0.jar"
print(light_model.annotate(text)['class'][0])

# Search summary
# explainPipeline = PretrainedPipeline("explain_document_dl", lang="en")
# explainResults = explainPipeline.transform(dataset)

#search_history_embeddings.show(30)
#search_history_embeddings.select("entities.result").show(30)

#print(explainResults.count())
#
#
#training_embeddings = get_embeddings(training_data)
#
#def get_embeddings(dataset):

    # document_assembler = (
    #     DocumentAssembler()
    #         .setInputCol("text")
    #         .setOutputCol("document")
    # )
    # sentenceDetector = (
    #     SentenceDetector()
    #         .setInputCols(["document"])
    #         .setOutputCol("sentences")
    # )
    # tokenizer = (
    #     Tokenizer()
    #         .setInputCols(["sentences"])
    #         .setOutputCol("token")
    # )
    # normalizer = (
    #     Normalizer()
    #         .setInputCols(["token"])
    #         .setOutputCol("normal")
    # )
    # word_embeddings= (
    #     WordEmbeddingsModel.pretrained()
    #         .setInputCols(["document","normal"])
    #         .setOutputCol("embeddings")
    # )
    # nlpPipeline = Pipeline(stages=[
    # document_assembler, 
    # sentenceDetector,
    # tokenizer,
    # normalizer,
    # word_embeddings,
    # ])
    # pipelineModel = nlpPipeline.fit(dataset)

    # results=pipelineModel.transform(dataset)
    # results.show(200)