
import findspark
from sparknlp import DocumentAssembler, SparkSession
from sparknlp.annotator import ClassifierDLApproach, UniversalSentenceEncoder
from pyspark.sql import DataFrame
from pyspark.ml import Pipeline, Transformer
from pyspark.sql.functions import asc


findspark.init()


def spark_init():
    """Returns a spark session. Tries to reduce logging."""
    spark = (
        SparkSession.builder
        .appName("Spark NLP")
        .master("local[*]")
        .config("spark.driver.memory", "10G")
        .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
        .config("spark.kryoserializer.buffer.max", "2000M")
        .config("spark.driver.maxResultSize", "0")
        .config("spark.jars.packages", "com.johnsnowlabs.nlp:spark-nlp_2.12:4.2.0")
        .getOrCreate()
    )

    spark.sparkContext.setLogLevel("ERROR")

    print('spark version ' + spark.version)
    return spark


def prepare_data(history: DataFrame):
    """Expects kind, query, url columns in dataframe."""
    assert (set(history.schema.fieldNames()) == set(['kind', 'text', 'url']))

    print('history count: ' + str(history.count()))

    # Keep searches only
    search_history = history.filter(history.kind == 'Searched')

    print('search_history count: ' + str(search_history.count()))

    return search_history


def classifier_pipeline(training_data: DataFrame):
    """Expects 'text' column in dataframe,
    adds 'predicted_category' column.
    It will be further parsed by helpers.
    """
    document = (
        DocumentAssembler()
        .setInputCol("text")
        .setOutputCol("document")
    )

    # we can also use sentence detector here
    # if we want to train on and get predictions for each sentence
    # downloading pretrained embeddings
    sentence_encoder = (
        UniversalSentenceEncoder.pretrained()
        .setInputCols(["document"])
        .setOutputCol("sentence_embeddings")
    )
    # the classes/labels/categories are in label column
    classsifierdl = (
        ClassifierDLApproach()
        .setInputCols(["sentence_embeddings"])
        .setLabelColumn("label")
        .setOutputCol("prediction")
        .setMaxEpochs(80)
        .setEnableOutputLogs(True)
    )

    pipeline = Pipeline(
        stages=[
            document,
            sentence_encoder,
            classsifierdl
        ]
    )

    return pipeline.fit(training_data)


def run_classifier(classifier: Transformer, input_data_frama: DataFrame, label_to_score: str):
    """Expects 'prediction' column in dataframe, tested with ClassifierDLApproach.
    Adds a <label>_score column containing confidence.
    Expected to be used with binary classifier."""
    labeled = classifier.transform(input_data_frama)

    # To understand shema use classifier.printSchema()
    prediction = labeled.prediction.getItem(0)

    def category_score_column(category: str):
        return prediction.metadata.getItem(category).alias(f"{category}_score")

    labeled_pretty = labeled.select(
        [
            labeled.text.substr(0, 50).alias('text'),
            prediction.result.alias("predicted_label"),
            category_score_column(label_to_score)
        ]
    )

    return labeled_pretty


def work_fun_samples(spark: SparkSession):
    return spark.createDataFrame([
        # work
        ['how to make a python3 spark dataframe?', 'work'],
        ['swift objective-c inter operation', 'work'],
        ['bootstrapping deployment pipeline', 'work'],
        ['aws route 53 domain configuration', 'work'],
        # fun
        ['where to go out and eat with friends?', 'fun'],
        ['Best things to bring to a beach party', 'fun'],
        ['Were to buy a sex doll?', 'fun'],
        ['Is not yawning in response a sign of a maniac', 'fun'],
    ]).toDF("text", "label")


def history_features(spark: SparkSession, history: DataFrame):
    """Extracts a list of features, for now a single feature
    Example features:
    - Your top political searches
    - Main five topics you have searched for in the past year
    """
    search_history = prepare_data(history)

    # Non work feature
    # Filters out baring searches
    work_pipeline = classifier_pipeline(work_fun_samples(spark))
    work_labeled_search_history = run_classifier(
        work_pipeline, search_history, 'work')

    top_ten_non_work_searches = (
        work_labeled_search_history
        .sort(asc('work_score'))
        .limit(10)
        .collect()
    )

    return top_ten_non_work_searches
