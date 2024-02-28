from flask import Flask, render_template, Response, request
from jinja2 import Environment, FileSystemLoader
from googletrans import Translator
import base64
import json
import whisper
import os
import struct
def remove_bytes(buffer, start, end):
    fmt = '%ds %dx %ds' % (start, end-start, len(buffer)-end)  # 3 way split
    return b''.join(struct.unpack(fmt, buffer))

app = app = Flask(__name__, template_folder='templateFiles', static_folder='staticFiles')
 

@app.route("/")
def index():
    return render_template('index.html')
@app.route('/reci',methods=['POST'])
def receiver():
  data=request.get_data()
  data=remove_bytes(data,0,176)
  data=remove_bytes(data,len(data)-62,len(data))
  with open('media/nim.ogg','wb') as f:
      f.write(data)
 
      f.close()
  
  print(data)
  return '200 OK'
  
  

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