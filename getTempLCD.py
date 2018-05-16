# -*- coding: utf-8 -*-
import urllib2
import json
import serial
import time

port = serial.Serial("/dev/ttyUSB0", baudrate=9600, timeout=3.0)

def parser(res_data):
    data = res_data.split()
    if data:
    # j = 0
    # for i in data:
    #     print str(j), ': ', i
    #     j += 1
      json_data = {}
      json_data.update({'date':data[74]})
      json_data.update({'time':data[32]})
      json_data.update({'weather':data[49]})
      json_data.update({'tempC':data[99]})
    return json_data

def clrscr():
    # clear display
    port.write(str(bytearray([254, 128])))
    port.write("                ")
    port.write("                ")
    port.write(str(bytearray([254, 128])))

while True:
    # http://www.vremetolmin.si/clientraw.txt
    try:
      request = urllib2.urlopen('http://www.vremetolmin.si/clientraw.txt')
   
      response = request.read()
      jsonResponse = json.dumps({'response': parser(response)}) # jsondata for API
      jsonData = json.loads(jsonResponse)
      if jsonData['response']:
          ob = jsonData['response']
          print "The current weather in Tolmin is %s with a temperature of %s" % (ob['weather'], ob['tempC'])
          count = 0
          while count < 24:
              weatherStr = ob['weather'].split('/')
              clrscr()
              port.write(weatherStr[0].encode())
              port.write(str(bytearray([254, 192])))  # next line
              port.write(weatherStr[1].encode())
              time.sleep(5)

              clrscr()
              port.write('Temperatura')
              port.write(str(bytearray([254, 197]))) # next line
              port.write(ob['tempC'].encode() + "\337C")
              time.sleep(5)
              count += 1
      else:
          print "An error occurred: %s" % (json['error']['description'])
    #except urllib2.HTTPError as err:
    except:
      print "Error on request..."
      time.sleep(10)
    request.close()

