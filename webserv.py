#
#
# Aircrack-NG plugin for Kismet
# This provides the REST server that interfaces between the UI and the Aircrack-NG Suite.
# Author: soliforte@protonmail.com
# December, 2017
from flask import Flask, request
from flask_restful import Resource, Api
from json import dumps
from flask.ext.jsonpify import jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

class injectionTest(Resource):
    def get(self, interfacename):
        subprocess.Popen(['notify-send','Testing interface: ' + interfacename])
        output = []
        cmd = subprocess.Popen(['sudo', '/usr/local/sbin/aireplay-ng', '-9', interfacename], stdout=subprocess.PIPE) #wlp0s20f0u1mon
        #output = subprocess.call(['sudo', '/usr/local/sbin/aireplay-ng', '-9', 'wlp58s0']).stdout.readlines()
        print("Injection Test Request received...")

        for ln in cmd.stdout:
            output.append(ln)
        if len(output) > 1:
            subprocess.Popen(['notify-send', output[1]])
            #return jsonify("Injection test succeeded")
        else:
            subprocess.Popen('notify-send', output[0])
            #return jsonify("Injection test failed")
        #return jsonify(output)

class deauth(Resource):
    def get(self, deauths, bssid, client, interfacename):
        print("Deauth request received...")
        subprocess.Popen(['notify-send', 'Sending deauth to client: '+client,])
        output = []
        cmd = subprocess.Popen(['sudo', '/usr/local/sbin/aireplay-ng', '-0', deauths, '-a', bssid, '-c', client, interfacename], stdout=subprocess.PIPE)
        return jsonify("Sending a deauth...")
        for ln in cmd.stdout:
            output.append(ln)
            print(ln)
        if len(output) > 1:
            subprocess.Popen(['notify-send', "I guess it sent?"])
            return jsonify("Deauthentication sent!")
        else:
            subprocess.Popen(['notify-send', "It didn't send"])
            return jsonify("Some sort of error ocurred.")

class testPage(Resource):
    def get(self):
        return jsonify("This test has succeeded")

api.add_resource(injectionTest, '/injectiontest/<interfacename>') # Route_1
api.add_resource(deauth, '/deauth/<deauths>/<bssid>/<client>/<interfacename>/response')
api.add_resource(testPage, '/test')


if __name__ == '__main__':
     app.run(port=2566)
