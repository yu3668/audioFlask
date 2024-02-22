from flask import Flask, render_template,  request, Response

from jinja2 import Environment, FileSystemLoader
from googletrans import Translator
import json

import whisper
import os

app = app = Flask(__name__, template_folder='templateFiles', static_folder='staticFiles')
 

@app.route("/")
def index():
    return render_template('index.html')
@app.route('/receiver',methods=['GET'])
def receiver():
  data=request.json
  print("the method called")
  print(data)
  
  

@app.route("/result",methods=['GET'])


def result():
    
    #options=whisper.DecodingOptions(language='ja',task='translate', fp16=False)
    #results = whisper.decode(model,'sampleSuper.mp3', options)
    try:
       model=whisper.load_model("small")
       result_jp=model.transcribe('sampleSuper.mp3',language='ja',fp16=False)
       translator=Translator()
       result_en=translator.translate(result_jp['text'])
       #print(result_en.text)
       #print(result_en)
       #print(result['text'])
       #content={result_jp:result_jp['text'],result_en:result_en}
    except :
        print ('an exception has been occured')

    
    return render_template('index.html',result_jp=result_jp['text'],result_en=result_en.text)

# ...
    
    
 


if __name__=='__main__':
    app.run(debug=True,port='5000')