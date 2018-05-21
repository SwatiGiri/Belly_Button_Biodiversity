# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from sqlalchemy import MetaData
from sqlalchemy import inspect
from sqlalchemy import Table

import pandas as pd


#################################################
# Flask Setup
#################################################
app = Flask(__name__)
db_path = "sqlite:///../Datasets/belly_button_biodiversity.sqlite"
from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = db_path
db = SQLAlchemy(app)



@app.route("/")
def home():
    return render_template("index.html")


@app.route("/names")
def get_otu_ids():
    # defining metatdata
    metadata = MetaData()
    metadata.reflect(bind=db.engine)
    # getting the samples table     
    samples = metadata.tables['samples']
    # converting table into something we can actually use  
    res = db.session.query(samples)
    # Final data
    data = res[0].keys()
    # 1 : beacuase the first element is just "otu_id"
    return jsonify(data[1 :])

@app.route("/otu")
def get_descriptions():
    # defining metatdata
    metadata = MetaData()
    metadata.reflect(bind=db.engine)
    # getting the samples table     
    otu = metadata.tables['otu']
    res = db.session.query(otu)
    descriptions = []
    for r in res:
        descriptions.append(r.lowest_taxonomic_unit_found)
    return jsonify(descriptions)


@app.route("/metadata/<sample>")
def get_sample_info(sample):
    sample = sample.replace("BB_", "")
    metadata = MetaData()
    metadata.reflect(bind=db.engine)
    # getting the samples table     
    samples_metadata = metadata.tables['samples_metadata']
    res = db.session.query(samples_metadata).filter_by(SAMPLEID=sample).first()
    data = {
        "AGE": res.AGE,
        "BBTYPE": res.BBTYPE,
        "ETHNICITY": res.ETHNICITY,
        "GENDER": res.GENDER,
        "LOCATION": res.LOCATION,
        "SAMPLEID": res.SAMPLEID
    }
    
    return jsonify(data)

@app.route('/wfreq/<sample>')
def get_washing_freq(sample):
    sample = sample.replace("BB_", "")
    metadata = MetaData()
    metadata.reflect(bind=db.engine)
    # getting the samples table     
    samples_metadata = metadata.tables['samples_metadata']
    res = db.session.query(samples_metadata).filter_by(SAMPLEID=sample).first()
    return jsonify(res.WFREQ)


@app.route('/samples/<sample>')
def get_filtered_sample_values(sample):
    df = pd.read_sql_table('samples', db_path)
    df = df.sort_values(sample, ascending=False)
    data = [
        {
            "otu_ids" : df['otu_id'].tolist()
        },
        {
            "sample_values": df[sample].tolist()
        }
    ] 
    
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)  