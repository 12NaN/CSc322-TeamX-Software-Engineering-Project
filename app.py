from flask import Flask, jsonify, request, json
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from flask_socketio import SocketIO, send
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)
from pusher import Pusher
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import json
app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

# API Key needed for the post function of the program
pusher = Pusher(
    app_id='989464',
    key='5481efcb3669a7275fd2',
    secret='ae4b5727ee6f310f7985',
    cluster='us2',
    ssl=True
)
db = SQLAlchemy(app)
# In Python terminal "from app import db" then "db.create_all()"
"""
class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(500))
    def __repr__(self):
        return f"History('{self.user_id}')"
"""

# This class creates the BlackBox table in SQLITE


class BlackBox(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)
    blkbxd_prsn_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))

    def __repr__(self):
        return f"BlackBox('{self.user_id}')"

# This class creates the BlackList table in SQLITE


class BlackList(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)
    user_name = db.Column(db.Integer, db.ForeignKey(
        'user.user_name'))

    def __repr__(self):
        return f"BlackList('{self.user_id}')"

# This class creates the Groups table in SQLITE


class Groups(db.Model):
    group_id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(20), nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Groups('{self.group_id}')"


class GroupMembers(db.Model):
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)

    def __repr__(self):
        return f"GroupMembers('{self.group_id}')"

# This class creates the Post table in SQLITE


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False,
                            default=datetime.utcnow)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Post('{self.title}', '{self.date_posted}')"

# This class creates the User table in SQLITE


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(20), unique=True, nullable=False)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    interest = db.Column(db.String(120), nullable=False)
    references = db.Column(db.String(20), nullable=False)
    image_file = db.Column(db.String(20), nullable=False,
                           default='client/src/components/ProfileImages/user.jpg')
    password = db.Column(db.String(60), nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)
    user_type = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    def get_reset_token(self, expires_sec=1800):
        s = Serializer(app.config['SECRET_KEY'], expires_sec)
        return s.dumps({'user_id': self.id}).decode('utf-8')

    @staticmethod
    def verify_reset_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token)['user_id']
        except:
            return None
        return User.query.get(user_id)

    def __repr__(self):
        return f"User('{self.user_name}', '{self.email}', '{self.image_file}')"

# This class creates the WhiteBox table in SQLITE


class WhiteBox(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)
    whtbxd_prsn_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))

    def __repr__(self):
        return f"WhiteBox('{self.user_id}')"

# This class creates the Results table in SQLITE


class Results(db.Model):
    __tablename__ = 'results'
    id = db.Column('id', db.Integer, primary_key=True)
    vote = db.Column('data', db.Integer)


app.config['JWT_SECRET_KEY'] = 'secret'
socketIo = SocketIO(app, cors_allowed_origins="*")

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)


@socketIo.on('vote')
# This function handles voting results and sends them to the results database.
def handleVote(ballot):
    vote = Results(vote=ballot)
    db.session.add(vote)
    db.session.commit()

    mon = Results.query.filter_by(vote="Monday").count()
    tue = Results.query.filter_by(vote="Tuesday").count()
    wed = Results.query.filter_by(vote="Wednesday").count()
    thur = Results.query.filter_by(vote="Thursday").count()
    fri = Results.query.filter_by(vote="Friday").count()
    sat = Results.query.filter_by(vote="Saturday").count()
    sun = Results.query.filter_by(vote="Sunday").count()

    emit('vote_results', {'Monday': mon, 'Tuesday': tue, 'Wednesday': wed,
                          'Thursday': thur, 'Friday': fri, 'Saturday': sat, 'Sunday': sun}, broadcast=True)


"""
@socketIo.on("connect")
def chatHistory():
    messages = History.query.all()
    send(messages, broadcast=True)
    return None
"""
@socketIo.on("message")
def handleMessage(msg):
    print(msg)
    #message = History(message=msg)
    # db.session.add(message)
    # db.session.commit()
    send(msg, broadcast=True)
    return None


# The register() function grabs the input from the register UI page and stores them in a database. Also
# the password is hashed using an API.
@app.route('/users/register', methods=['POST'])
def register():
    print(request.get_json())
#    cur = mysql.connection.cursor()
    user_name = request.get_json()['user_name']
    first_name = request.get_json()['first_name']
    last_name = request.get_json()['last_name']
    user_name = request.get_json()['user_name']
    email = request.get_json()['email']
    password = bcrypt.generate_password_hash(
        request.get_json()['password']).decode('utf-8')
    interest = 'cs'  # request.get_json()['interest']
    references = request.get_json()['references']
    user_type = 0
    rating = 0

  #  created = datetime.utcnow()

    user = User(user_name=user_name, first_name=first_name, last_name=last_name, email=email,
                password=password, interest=interest, references=references, user_type=user_type, rating=rating)  # , created=created)
    db.session.add(user)
    db.session.commit()

    result = {
        'user_name': user_name,
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password,
        'interest': interest,
        'references': references,
        'user_type': user_type,
        'rating': rating,

    }

    return jsonify({'result': result})

# This route redirects the login function to be used at the /users/login page


@app.route('/users/login', methods=['POST'])
def login():
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""

    user = User.query.filter_by(email=str(email)).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity={
                                           'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email})
        result = access_token
    else:
        result = jsonify({"error": "Invalid username and password"})

    return result

# This route redirects the removeToDo function to be used at the group page


@app.route("/group/remove-todo/<item_id>")
def removeTodo(item_id):
    data = {'id': item_id}
    pusher.trigger('todo', 'item-removed', data)
    return jsonify(data)

    # endpoint for updating todo item

# This route redirects the updateToDo function to be used at the group page


@app.route('/group/update-todo/<item_id>', methods=['POST'])
def updateTodo(item_id):
    data = {
        'id': item_id,
        'completed': json.loads(request.data).get('completed', 0)
    }
    pusher.trigger('todo', 'item-updated', data)
    return jsonify(data)

# This route redirects the account function to be used at the profile page


@app.route("/profile")
def account():
    image_file = url_for(
        'static', filename='client/src/components/ProfileImages/user.jpg')


# Deletes all rows from the following tables. BlackBox, BlackList, Groups, User, WhiteBox
def delete_table_data():
    db.session.query(BlackBox).delete()
    db.session.query(BlackList).delete()
    db.session.query(Groups).delete()
    db.session.query(User).delete()
    db.session.query(WhiteBox).delete()
    db.session.commit()


# Populates rows in the following tables.
def populate_table_data():

    # populate rows for user table.
    x = 'password'
    passkey = bcrypt.generate_password_hash(x).decode('utf-8')

    admin = User(user_name='admin', first_name='John', last_name='Doe', email='admin@gmail.com',
                 password=passkey, interest='cs', references='none', user_type=4, rating=30)

    # group 1

    bryan = User(user_name='bryare', first_name='Bryan', last_name='Arevalo', email='bareval001@citymail.cuny.edu',
                 password=passkey, interest='cs', references='John Doe', user_type=1, rating=0)
    frank = User(user_name='franko', first_name='Frank', last_name='Orefice', email='frank@gmail.com',
                 password=passkey, interest='cs', references='none', user_type=1, rating=0)
    henry = User(user_name='henryp', first_name='Henry', last_name='Puma', email='henry@gmail.com',
                 password=passkey, interest='cs', references='none', user_type=1, rating=0)
    peter = User(user_name='petery', first_name='Peter', last_name='Ye', email='peter@gmail.com',
                 password=passkey, interest='cs', references='none', user_type=1, rating=0)
    # group 2

    arun = User(user_name='mynemesis', first_name='Arun', last_name='Ajay', email='arun@gmail.com',
                password=passkey, interest='cs', references='John Doe', user_type=1, rating=0)
    ahsan = User(user_name='mynemesis2', first_name='Ahsan', last_name='Fayyaz', email='ahsan@gmail.com',
                 password=passkey, interest='cs', references='none', user_type=1, rating=0)
    abdul = User(user_name='mynemesis3', first_name='Abdul', last_name='Imtiaz', email='abdul@gmail.com',
                 password=passkey, interest='cs', references='none', user_type=1, rating=0)
    sajad = User(user_name='mynemesis4', first_name='Sajad', last_name='Golamdezhri', email='sajad@gmail.com',
                 password=passkey, interest='cs', references='none', user_type=1, rating=0)

    jiewei = User(user_name='jiewei', first_name='Jie', last_name='Wei', email='jiewei@gmail.com',
                  password=passkey, interest='cs', references='none', user_type=1, rating=0)

    blacklistUser = User(user_name='blacklistUser', first_name='black', last_name='list', email='blacklist@gmail.com',
                         password=passkey, interest='cs', references='none', user_type=1, rating=0)

    # populate rows for blackbox.
    blackbox1 = BlackBox(
        user_id=3, blkbxd_prsn_id=5, group_id=0)

    # populate rows for blacklist.
    blacklist1 = BlackList(
        user_id=5, user_name='blacklistUser')

    # populate rows for groups.
    groups1 = Groups(
        group_id=1, group_name='Team X', rating=20)

    groups2 = Groups(
        group_id=2, group_name='Team A', rating=0)

    groups3 = Groups(
        group_id=3, group_name='Students', rating=0)

    gm2 = GroupMembers(group_id=1, user_id=2)
    gm3 = GroupMembers(group_id=1, user_id=3)
    gm4 = GroupMembers(group_id=1, user_id=4)
    gm5 = GroupMembers(group_id=1, user_id=5)

    gm6 = GroupMembers(group_id=2, user_id=6)
    gm7 = GroupMembers(group_id=2, user_id=7)
    gm8 = GroupMembers(group_id=2, user_id=8)
    gm9 = GroupMembers(group_id=2, user_id=9)

    gm22 = GroupMembers(group_id=3, user_id=2)
    gm23 = GroupMembers(group_id=3, user_id=3)
    gm24 = GroupMembers(group_id=3, user_id=4)
    gm25 = GroupMembers(group_id=3, user_id=5)

    gm26 = GroupMembers(group_id=3, user_id=6)
    gm27 = GroupMembers(group_id=3, user_id=7)
    gm28 = GroupMembers(group_id=3, user_id=8)
    gm29 = GroupMembers(group_id=3, user_id=9)

    # populate rows for whitebox.
    whitebox1 = WhiteBox(
        user_id=1, whtbxd_prsn_id=5, group_id=0)

    # add users and relations
    db.session.add(admin)

    db.session.add(bryan)
    db.session.add(frank)
    db.session.add(henry)
    db.session.add(peter)

    db.session.add(arun)
    db.session.add(ahsan)
    db.session.add(abdul)
    db.session.add(sajad)

    db.session.add(jiewei)
    db.session.add(blacklistUser)

    db.session.add(blackbox1)
    db.session.add(blacklist1)

    db.session.add(groups1)
    db.session.add(groups2)
    db.session.add(groups3)

    db.session.add(gm2)
    db.session.add(gm3)
    db.session.add(gm4)
    db.session.add(gm5)

    db.session.add(gm6)
    db.session.add(gm7)
    db.session.add(gm8)
    db.session.add(gm9)

    db.session.add(gm22)
    db.session.add(gm23)
    db.session.add(gm24)
    db.session.add(gm25)
    db.session.add(gm26)
    db.session.add(gm27)
    db.session.add(gm28)
    db.session.add(gm29)

    db.session.add(whitebox1)

    # commit additions
    db.session.commit()


if __name__ == '__main__':
    # app.run(debug=True)

    # delete_table_data()
    populate_table_data()

    socketIo.run(app)
