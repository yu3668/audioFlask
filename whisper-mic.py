from whisper_mic import WhisperMic
import os
import time
while True:
  mic = WhisperMic()
  result = mic.listen()
  print(result)
  time.sleep(1)
  #os.system('cls')
  mic=None
  result=None
