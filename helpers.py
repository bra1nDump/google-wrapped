
import findspark

from sparknlp import DocumentAssembler, SparkSession
from sparknlp.annotator import ClassifierDLApproach, UniversalSentenceEncoder

from pyspark.sql import DataFrame, Window, Column
from pyspark.sql.functions import asc, row_number, col, desc

from pyspark.ml import Pipeline, Transformer


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
        .setMaxEpochs(40)
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
        return prediction.metadata.getItem(category).alias(f"confidence")

    labeled_pretty = labeled.select(
        [
            labeled.text.substr(0, 80).alias('text'),
            prediction.result.alias("predicted_label"),
            category_score_column(label_to_score)
        ]
    )

    return labeled_pretty

# Feature code

# Helpers

# Stolen from https://github.com/apache/datafu


def dedup_top_n(df: DataFrame,
                n: int,
                group_col: Column,
                order_col: Column):
    """
    Used get the top N records (after ordering according to the provided order columns)
    in each group.
    @param df DataFrame to operate on
    @param n number of records to return from each group
    @param group_col column to group by the records
    @return DataFrame representing the data after the operation
    """
    window = Window.partitionBy(group_col).orderBy(order_col)
    return df.withColumn("rn", row_number().over(window)).where(
        col("rn") <= n).drop("rn")


def work_non_work_samples(spark: SparkSession):
    return spark.createDataFrame([
        # work
        ['how to make a python3 spark dataframe?', 'work'],
        ['swift objective-c inter operation', 'work'],
        ['bootstrapping deployment pipeline', 'work'],
        ['aws route 53 domain configuration', 'work'],
        # non_work
        ['where to go out and eat with friends?', 'non_work'],
        ['Best things to bring to a beach party', 'non_work'],
        ['Were to buy a sex doll?', 'non_work'],
        ['Is not yawning in response a sign of a maniac', 'non_work'],
    ]).toDF("text", "label")


def sexual_samples(spark: SparkSession):
    return spark.createDataFrame([
        # work
        ['how to make a python3 spark dataframe?', 'work'],
        ['swift objective-c inter operation', 'work'],
        ['bootstrapping deployment pipeline', 'work'],
        ['aws route 53 domain configuration', 'work'],

        # Teacher
        ['My students are not listening to me what do I do?', 'work'],

        # Boring things
        ['How do I get to the nearest airport', 'work'],
        ['Jobs around me', 'work'],
        ['Which industry should I work in', 'work'],

        # sexual
        ['How to use a dating website to get laid', 'sexual'],
        ['Nudist beach near me', 'sexual'],
        ['Were to buy a sex doll?', 'sexual'],

        # https://www.maxim.com/maxim-man/most-common-sex-questions-on-google-2017-9/
        ['Where is the G-spot?', 'sexual'],
        ['How to make a woman orgasm', 'sexual'],
        ['Can you get rid of herpes?', 'sexual'],
        ['How to get rid of genital warts', 'sexual'],
        ['How to get a bigger penis manually', 'sexual'],
        ['How to measure a penis', 'sexual'],
        ['How to insert a male organ into a female organ', 'sexual'],
    ]).toDF("text", "label")


def political_samples(spark: SparkSession):
    return spark.createDataFrame([
        # work
        ['how to make a python3 spark dataframe?', 'work'],
        ['swift objective-c inter operation', 'work'],
        ['bootstrapping deployment pipeline', 'work'],
        ['aws route 53 domain configuration', 'work'],

        # Teacher
        ['My students are not listening to me what do I do?', 'work'],

        # Boring things
        ['How do I get to the nearest airport', 'work'],
        ['Jobs around me', 'work'],
        ['Which industry should I work in', 'work'],

        # https://www.ourmidland.com/news/article/Google-Trends-election-insights-17348435.php
        # I used the topics for inspiration, and came up with something from self
        ['Which presidential candidate has the best wages increase plan for the working class', 'political'],
        ['Protests against the government', 'political'],
        ['Sign petition against abortion', 'political'],
        ['why is inflation so high', 'political'],
        ['How can I persuade my spouse Donald trump is a good guy', 'political'],
        ['Latest dirt on president biden', 'political'],
        ['Why communism would never work in America', 'political'],
        ['How do we reach equal opportunity employment for minorities', 'political'],
        ['Find relative in a immigration detention center', 'political'],
        ['What is the government doing with homelessness, Los angeles budgets', 'political'],
    ]).toDF("text", "label")


def illness_samples(spark: SparkSession):
    return spark.createDataFrame([
        # work
        ['how to make a python3 spark dataframe?', 'work'],
        ['swift objective-c inter operation', 'work'],
        ['bootstrapping deployment pipeline', 'work'],
        ['aws route 53 domain configuration', 'work'],

        # Teacher
        ['My students are not listening to me what do I do?', 'work'],

        # Boring things
        ['How do I get to the nearest airport', 'work'],
        ['Jobs around me', 'work'],
        ['Which industry should I work in', 'work'],
        ['Setting up an email campaign', 'work'],

        # illness
        ['My stomach hearts what should I do', 'illness'],
        ['Constant diarrhea after eating milk', 'illness'],
        ['What or first signs of cancer', 'illness'],
        ['doctors around me', 'illness'],
        ['Cant fall asleep do I have insomnia', 'illness'],
        ['Is everybody depressed?', 'illness'],
        ['spots on my body that wont go away', 'illness'],
        ['when should I go to a doctor after a headache', 'illness'],
        ['concussion side effects', 'illness'],
        ['mood stabilizers side effects', 'illness'],
    ]).toDF("text", "label")


def top_n(learning_data: DataFrame, input_data: DataFrame, label: str, n: int):
    pipeline = classifier_pipeline(learning_data)
    labeled = run_classifier(pipeline, input_data, label)

    # I have been getting strange scores in scientific notation, drop them for now
    # Might as well drop all scores below 0.5
    without_outliers = labeled.where(
        col("confidence") > 0.5).where(col('confidence') <= 1)

    return (
        without_outliers
        .sort(desc('confidence'))
        .take(n)
    )


def history_features(spark: SparkSession, history: DataFrame):
    """Extracts a list of features, for now a single feature
    Example features:
    - Your top political searches
    - Main five topics you have searched for in the past year
    """
    search_history = prepare_data(history)
    search_history_dedup = dedup_top_n(
        search_history, 1, col('text'), col('url'))

    # Split the pipeline into stages
    # 1. Create text embeddings
    # 2. Create a classifier

    top_count = 100

    features = {
        # Non work feature
        # Filters out boring searches
        # Do we event want the boring filter?
        # 'Top non work searches': top_n(
        #     work_non_work_samples(spark),
        #     search_history_dedup,
        #     'non_work',
        #     top_count
        # ),

        "Clearly nobody talked to you about 'the birds and the bees'. Thankfully you know where to go with these questions": top_n(
            sexual_samples(spark),
            search_history_dedup,
            'sexual',
            top_count
        ),

        'Your quite an activist ... although we are unsure what party you are in just yet': top_n(
            political_samples(spark),
            search_history_dedup,
            'political',
            top_count
        ),

        "I'm surprised you are not dead yet, these are the things you have searched for": top_n(
            illness_samples(spark),
            search_history_dedup,
            'illness',
            top_count
        ),

    }

    return features
