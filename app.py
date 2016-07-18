from flask_socketio import SocketIO,emit
from flask import Flask
import rethinkdb as r
from datetime import datetime

app = Flask(__name__, static_url_path="")
socketio = SocketIO(app)

@socketio.on('connect',namespace='/blackspace')
def on_connect():
    print('connected')

@socketio.on('message',namespace='/blackspace')
def get_questions(get):
    print(get)
    qs = []
    r.connect("localhost", 28015, db="meetup").repl()
    cursor = r.table("question").run()
    for doc in cursor:
        qs.append(doc)
    emit('allquestions',qs)

@socketio.on('addquestion',namespace='/blackspace')
def add_question(qData):
    quname = qData['quname']
    que = qData['que']
    i = datetime.now()
    created = i.strftime('%Y/%m/%d %H:%M:%S')
    r.connect("localhost", 28015, db="meetup").repl()
    # check if username exists
    exist = r.table('people').pluck(quname).distinct().count().run()
    if exist <= 0:
        emit('notreg','Username is not registered')
    else:
        obj = r.table("question").insert([{"username": quname, "question": que,'created':created}]).run()
        if obj["errors"] == 0:
            print('Que added')
            emit('added','Question added')

@socketio.on('register',namespace='/blackspace')
def on_register(regData):
    uname = regData['uname']
    fname = regData['fname']
    lname = regData['lname']
    email = regData['uemail']
    r.connect("localhost", 28015, db="meetup").repl()
    #check if it exists
    exist = r.table('people').pluck(uname,fname,lname,email).distinct().count().run()
    if exist >= 1:
        emit('exist','User exists')
    else:
        obj = r.table("people").insert([{"username":uname,"firstname":fname,"lastname": lname, "email":email}]).run()
        if obj["errors"] == 0:
            print('created')
            emit('created', 'user created')




@app.route('/')
def root():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    socketio.run(app,host="localhost",port=7777,debug=True)
    #socketio.run(app)