# Backlog

- Cluster all things - print from each cluster
- Revisit parsing
  - figure out what was causing the weird bugs
  - Extract time stamps
- Ed and endpoint to return all history
- Implement top features

# Server Architecture

- Spark started in the background
- upload form request
  - Receive job title or keywords they don't want to know about
- Run xidel, Read, create data frame on the fly without intermediate format
  - Alternatively (preffered for future?) use takeout parsing library https://github.com/seanbreckenridge/google_takeout_parser
- Filter searches in the past year only
- Filter english searches only
- Filter out on interesting things (job)

# Features

Top

- Sex
- Political, left most, right most
- LGBTQ
- Ilnesses
- Financial

Cluster all activity

- Unbiased cluster
- Live problems you were experiencing (split by months)

Top could also be combined with a cluster

Stats

- Total searches last year
- Total searches google stores (a hook into sailing morer()

# Log

# October 22

Added top X feature for sexual, political and medical searches.
Serving simple HTML with lists for each feature.
Updated container to start gunicorn on attach.

There's a lot of duplication of labeled data, and some redundancy in creating new samples.

The process is also very slow, because embeddings are computed for each feature.
