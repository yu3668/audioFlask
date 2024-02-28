// collect DOMs
const display = document.querySelector('.display')
const controllerWrapper = document.querySelector('.controllers')

const State = ['Initial', 'Record', 'Download']
let stateIndex = 0
let mediaRecorder, chunks = [], audioURL = ''
var blob1=null

// mediaRecorder setup for audio
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    console.log('mediaDevices supported..')

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.ondataavailable = (e) => {
            
            chunks.push(e.data)
            
        }

        mediaRecorder.onstop = () => {
            //const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
            
            //audioURL = window.URL.createObjectURL(blob)
            
            const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
            chunks=[]
            audioURL = window.URL.createObjectURL(blob)
            /*fetch("http://127.0.0.1:8000/reci", 
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
            
            body:JSON.stringify(blob)}).then(res=>{
                    if(res.ok){
                        return res.json()
                    }else{
                        alert("something is wrong")
                    }
                }).then(jsonResponse=>{
                    
                    // Log the response data in the console
                    console.log(jsonResponse)
                } 
                ); */
            /*const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display:inline";
            a.href = url;
            a.download = "test.ogg";
            a.click();
            window.URL.revokeObjectURL(url); */
            
            //const data=[{"url":str(url)}];
            
           /* const cars = [
                { "make":"Porsche", "model":"911S" },
                { "make":"Mercedes-Benz", "model":"220SE" },
                { "make":"Jaguar","model": "Mark VII" }
               ];
               
            const url=audioURL.toString()
            fetch("http://127.0.0.1:8000/reci", 
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
        
        body:JSON.stringify(chunks.length)}).then(res=>{
                if(res.ok){
                    return res.json()
                }else{
                    alert("something is wrong")
                }
            }).then(jsonResponse=>{
                
                // Log the response data in the console
                console.log(jsonResponse)
            } 
            ); */
            var xhr=new XMLHttpRequest();
      xhr.onload=function(e) {
          if(this.readyState === 4) {
              console.log("Server returned: ",e.target.responseText);
          }
      };
      var fd=new FormData();
      fd.append("audio_data",blob, "filename.ogg");
      xhr.open("POST","http://127.0.0.1:5000/reci",true);
      xhr.send(fd);
      
        }
    }).catch(error => {
        console.log('Following error has occured : ',error)
    })
}else{
    stateIndex = ''
    application(stateIndex)
}

const clearDisplay = () => {
    display.textContent = ''
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}

const record = () => {
    stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
}

const stopRecording = () => {
    stateIndex = 2
    mediaRecorder.stop()
    application(stateIndex)
}

const downloadAudio = () => {
    
    audioURL = window.URL.createObjectURL(blob)
    document.querySelector('audio').src = audioURL
    const downloadLink = document.createElement('a')
    downloadLink.href = audioURL
    
    downloadLink.setAttribute('download','audio')
    
    //downloadLink.download(')
    
    downloadLink.click()
    alert(audioURL.toString())
    
    
}
const process=()=>{
    const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
    var xhr=new XMLHttpRequest();
      xhr.onload=function(e) {
          if(this.readyState === 4) {
              console.log("Server returned: ",e.target.responseText);
          }
      };
    
    var fd=new FormData();
      fd.append("audio_data",blob, "filename.ogg");
      xhr.open("POST","http://127.0.0.1:5000/reci",true);
      xhr.send(fd);
      chunks=[]
}
const addButton = (id, funString, text,href) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.setAttribute('onclick', funString)
    btn.textContent = text
    if (href!=''){
        btn.addEventListener("click",function name() {
            window.location.href=href
            
        });

    }

   
    controllerWrapper.append(btn)
}

const addMessage = (text) => {
    const msg = document.createElement('p')
    msg.textContent = text
    display.append(msg)
}

const addAudio = () => {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = audioURL
    
    display.append(audio)
}

const application = (index) => {
    switch (State[index]) {
        case 'Initial':
            clearDisplay()
            clearControls()

            addButton('record', 'record()', 'Start Recording','')
            break;

        case 'Record':
            clearDisplay()
            clearControls()
            
            addMessage('Recording...')
            addButton('stop', 'stopRecording()', 'Stop Recording','')
            break

        case 'Download':
            clearControls()
            clearDisplay()

            addAudio()
            //blob1=null
            //chunks=[]
            addButton('record', 'record()', 'Record Again','')
            addButton('process','process()','script','http://127.0.0.1:5000/result')
            //downloadAudio()
            break

        default:
            clearControls()
            clearDisplay()

            addMessage('Your browser does not support mediaDevices')
            break;
    }

}
//downloadAudio()
application(stateIndex)
