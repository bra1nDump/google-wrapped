pip install -r requirements.txt
pip3 install -r requirements.txt

sudo apt-get install -yq openjdk-8-jre

# Spark needs 8/11
export PATH="/usr/lib/jvm/java-8-openjdk-amd64/jre/bin/:$PATH"
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

# !! For the exports to work run > source codespaces_setup.sh