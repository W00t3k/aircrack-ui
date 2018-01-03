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
import subprocess

app = Flask(__name__)
api = Api(app)

class injectionTest(Resource):
    def get(self, interfacename):
        output = []
        cmd = subprocess.Popen(['sudo', '/usr/local/sbin/aireplay-ng', '-9', interfacename], stdout=subprocess.PIPE) #wlp0s20f0u1mon
        #output = subprocess.call(['sudo', '/usr/local/sbin/aireplay-ng', '-9', 'wlp58s0']).stdout.readlines()
        print("Request received...")
        for ln in cmd.stdout:
            output.append(ln)
        if len(output) > 1:
            return jsonify("Injection test succeeded")
            print(output[1])
        else:
            return jsonify("Injection test failed")
        #return jsonify(output)

class testPage(Resource):
    def get(self):
        return jsonify("This test has succeeded")

api.add_resource(injectionTest, '/injectiontest/<interfacename>') # Route_1
api.add_resource(testPage, '/test')


if __name__ == '__main__':
     app.run(port=2566)
