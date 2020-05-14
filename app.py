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
from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import ModelSchema
from pymysql import NULL
from flask_mail import Mail, Message
import os.path
from os import path
import smtplib

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

# In Python terminal "from app import db" then "db.create_all()"

db = SQLAlchemy(app)
ma = Marshmallow(app)


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
        # String representation of a query
        return f"User('{self.user_name}', '{self.email}', '{self.image_file}','{self.rating}')"


# This class creates the BlackBox table in SQLITE


class BlackBox(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)
    blkbxd_prsn_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))

    def __repr__(self):
        return f"BlackBox('{self.user_id}','{self.blkbxd_prsn_id}','{self.group_id}')"


# This class creates the BlackList table in SQLITE


class BlackList(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)
    user_name = db.Column(db.Integer, db.ForeignKey(
        'user.user_name'))

    def __repr__(self):
        return f"BlackList('{self.user_id}', {self.user_name})"


# This class creates the Groups table in SQLITE


class Groups(db.Model):
    group_id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(20), unique=True, nullable=False)
    group_desc = db.Column(db.Text, nullable=False)
    visi_posts = db.Column(db.Boolean, nullable=False)
    visi_members = db.Column(db.Boolean, nullable=False)
    visi_eval = db.Column(db.Boolean, nullable=False)
    visi_warn = db.Column(db.Boolean, nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Groups('{self.group_id}')"


# This class creates the GroupMembers table in SQLITE


class GroupMembers(db.Model):
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)

    def __repr__(self):
        return f"GroupMembers('{self.group_id}')"


# This class creates the Poll table in SQLITE


class Poll(db.Model):
    poll_id = db.Column(db.Integer, primary_key=True)
    desc = db.Column(db.String(100), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id'), nullable=False)

    def __repr__(self):
        return f"Poll('{self.desc}', '{self.group_id}')"


# This class creates the PollOptions table in SQLITE


class PollOptions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    option = db.Column(db.String(100), nullable=False)
    poll_id = db.Column(db.Integer, db.ForeignKey(
        'poll.poll_id'), nullable=False)
    votes = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        return f"PollOptions('{self.option}', '{self.poll_id}', '{self.votes}')"


# This class creates the VoteHandle table in SQLITE


class VoteHandle(db.Model):
    vote_id = db.Column(db.Integer, primary_key=True)
    desc = db.Column(db.String(300), nullable=False)
    user_id_issuer = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=False)
    user_id_subject = db.Column(db.Integer, db.ForeignKey(
        'user.id'), nullable=True)
    group_id_subject = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id'), nullable=True)
    vote_type = db.Column(db.Integer, nullable=False)
    # 0=>Compliment, 1=>Warn, 2=>Kick, 3=>GroupClosure, 4=>VoteforSU
    vote_yes = db.Column(db.Integer, nullable=True)
    vote_no = db.Column(db.Integer, nullable=True)
    status = db.Column(db.Integer, nullable=False)
    # 0=>inactive, 1=>active, 2=completed

    def __repr__(self):
        return f"VoteHandle('{self.vote_id}', '{self.desc}', '{self.user_id_issuer}', '{self.user_id_subject}', '{self.group_id_subject}', '{self.vote_type}', '{self.vote_yes}', '{self.vote_no}', '{self.status}')"


# This class creates the Voters table in SQLITE


class Voters(db.Model):
    vote_id = db.Column(db.Integer, db.ForeignKey(
        'vote_handle.vote_id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id'), primary_key=True)
    status = db.Column(db.Integer, nullable=False)
    # 0=>NoVote, 1=>Voted

    def __repr__(self):
        return f"Voters('{self.vote_id}', '{self.user_id}', '{self.status}')"


# This class creates the Notification table in SQLITE


class Notification(db.Model):
    notif_id = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.Integer)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))
    sender_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    recipient_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    body = db.Column(db.String(140))

    def __repr__(self):
        return '<Message {}>'.format(self.body)


# This class creates the Post table in SQLITE


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False,
                            default=datetime.utcnow)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_name = db.Column(db.String(20), unique=True, nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id'), nullable=False)

    def __repr__(self):
        return f"Post('{self.title}', '{self.content}', '{self.user_id}', '{self.user_name}', {self.group_id}, '{self.date_posted}')"


# This class creates the WhiteBox table in SQLITE


class WhiteBox(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)
    whtbxd_prsn_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))

    def __repr__(self):
        return f"WhiteBox('{self.user_id}','{self.whtbxd_prsn_id}','{self.group_id}')"


# This class creates the Results table in SQLITE


class Results(db.Model):
    __tablename__ = 'results'
    id = db.Column('id', db.Integer, primary_key=True)
    vote = db.Column('data', db.Integer)


# This class creates the Todo table in SQLITE


class Todo(db.Model):
    __tablename__ = 'todo'
    id = db.Column('id', db.Integer, primary_key=True)
    text = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    status = db.Column(db.Integer, nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))


# Generate marshmallow Schemas from your models using SQLAlchemySchema.

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('id', 'user_name', 'email',
                  'interest', 'rating', 'user_type')


class GroupSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('group_id', 'group_name', 'group_desc',
                  'visi_posts', 'visi_members', 'visi_eval', 'visi_warn', 'rating')


class GroupMemSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('group_id', 'user_id')


class PostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ('title', 'date_posted', 'content',
                  'user_id', 'user_name', 'group_id')


class NotificationSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('id', 'sender_id', 'recipient_id', 'body')


class BlackBoxSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('user_id', 'blkbxd_prsn_id', 'group_id')


class WhiteBoxSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('group_id', 'whtbxd_prsn_id', 'group_id')
# Used to get blacklisted users


class BlackListSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('user_id', 'user_name')


class PollSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ('poll_id', 'desc', 'group_id')


class PollOptionsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ('id', 'option', 'poll_id', 'votes')


class VoteHandleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ('vote_id', 'desc', 'user_id_issuer',
                  'user_id_subject', 'group_id_subject', 'vote_type', 'vote_yes', 'vote_no', 'status')


class VotersSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ('vote_id', 'user_id', 'status')


class TodoSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ('id', 'text', 'user_id', 'status', 'group_id')


app.config['JWT_SECRET_KEY'] = 'secret'
# socketIo = SocketIO(app, cors_allowed_origins="*")

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)

"""
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
    banned_users = getBlackListUsers(user_name)
    # Checking if the filled out user name is within the black listed user_names
    if (user_name in banned_users):
        print("CURRENT_USER:", user_name, "HAS BEEN BLACK LISTED!")
        # Not sure what to return when a user is black listed, but this works without any erorrs...
        return jsonify({"Error": "This user is banned from registering"})

    # The user_name is not black listed and is added to the database
    user = User(user_name=user_name, first_name=first_name, last_name=last_name, email=email,
                password="password", interest=interest, references=references, user_type=user_type, rating=rating)  # , created=created)
    db.session.add(user)
    db.session.commit()

    last_item = Notification.query.order_by(
        Notification.notif_id.desc()).first()
    print(last_item.notif_id)
    notification1 = Notification(
        notif_id=last_item.notif_id+1, id=3, group_id=NULL, sender_id=user.id, recipient_id=1, body=user.user_name + " just signed up and is awaiting your approval.")

    db.session.add(notification1)
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
    print("ACCOUNT CREATED:\n", result)
    return jsonify({'result': result})


# The groups() function gets all of the groups from the database.

@app.route('/projects', methods=['GET'])
def groups():
    groups = Groups.query.order_by(Groups.rating)
    group = GroupSchema(many=True)
    output = group.dump(groups)
    result = {
        'Groups': output
    }
    return jsonify(result)

# The create() function instantiates a new group page with all user settings personalized and puts it in the database.


@app.route('/projects/create', methods=['POST'])
def create():
    """
    group_id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(20), nullable=False)
    group_desc = db.Column(db.Text, nullable=False)
    visi_posts = db.Column(db.Boolean, nullable=False)
    visi_members = db.Column(db.Boolean, nullable=False)
    visi_eval = db.Column(db.Boolean, nullable=False)
    visi_warn = db.Column(db.Boolean, nullable=False)
    rating = db.Column(db.Integer, nullable=False)

                group_name: this.state.name,
            group_desc: this.state.desc,
            visi_post: this.state.post,
            visi_members: this.state.members,
            visi_eval: this.state.eval,
            visi_warn: this.state.warn,
            rating: 0
"""
    group = GroupSchema(many=True)
    groupM = GroupMemSchema(many=True)
    name = request.json['group_name']
    desc = request.json['group_desc']
    posts = bool(request.json['visi_post'])
    members = bool(request.json['visi_members'])
    evaluate = bool(request.json['visi_eval'])
    warn = bool(request.json['visi_warn'])
    rating = request.json['rating']
    new_group = Groups(group_name=name, group_desc=desc, visi_posts=posts,
                       visi_members=members, visi_eval=evaluate, visi_warn=warn, rating=rating)
    db.session.add(new_group)
    db.session.commit()
    #obj = session.query(ObjectRes).order_by(ObjectRes.id.desc()).first()
#    new_group_mem = GroupMembers(id=db.session.query(Groups.group_id).filter(group_name == name).first(), user_id = user_id)
#    db.session.add(new_group_mem)
#    db.session.commit()
    print("POSSSSSSSSSST")
    result = group.dump(Groups.query.filter_by(group_name=name))
    return jsonify({'result': result})

# This route invites members to a group.
@app.route('/projects/create/mem', methods=['POST'])
def createMem():
    group = request.json['group_id']
    user = request.json['user_id']
    new_mem = GroupMembers(group_id=group, user_id=user)
    db.session.add(new_mem)
    db.session.commit()
    mem = GroupMemSchema(many=True)
    result = mem.dump(GroupMembers.query.filter_by(group_id=group))
    return jsonify({"result": result})

@app.route('/users', methods=['POST'])
def rating():

    users = User.query.filter_by(id = request.json['user_id']).update({'rating': request.json['rating']})
    db.session.commit()
    user = UserSchema(many=True)
    print(request.json['user_id'])
    output = user.dump(User.query.filter(id == request.json['user_id']))
    result = {
        'Users': output
    }
    return jsonify(result)
# This route displays users on the users page.


@app.route('/users', methods=['GET'])
def profiles():
    users = User.query.order_by(User.rating)
    user = UserSchema(many=True)
    output = user.dump(users)
    result = {
        'Users': output
    }
    return jsonify(result)


# The notifications() function gets all of the functions and users to be displayed on the notifications page.

@app.route('/notifications', methods=['GET'])
def showNotifications():

    notifications = Notification.query.filter(Notification.sender_id)
    users = User.query.order_by(User.id)
    user = UserSchema(many=True)
    output2 = user.dump(users)
    n = NotificationSchema(many=True)
    output = n.dump(notifications)

    result = {
        'Notifications': output,
        'Users': output2
    }

    return jsonify(result)

# The approve() function gets the data of a user that has been approved and sends them an email and a notification.


@app.route('/notifications', methods=['POST'])
def approve():
    print("HELLO")
    email = request.json['email']
    id = request.json['id']
    sender_id = 1
    recipient_id = id
    notif_type = request.json['type']
    body = "You have been approved"
    if(notif_type >= 0):
        notification = Notification(
            id=notif_type, group_id=NULL, sender_id=sender_id, recipient_id=recipient_id, body=body)
        db.session.add(notification)
        db.session.commit()
        if(notif_type >= 0):
            conn = smtplib.SMTP('smtp.gmail.com', 587)
            type(conn)
            conn.ehlo()
            conn.starttls()
            conn.login('bryarebryare@gmail.com', 'lrdyjaqhafhluolu')
            conn.sendmail('bryarebryare@gmail.com',
                          email, 'Subject:', "PASSWORD")
            conn.quit()
    else:
        body = "DENIED. FILE AN APPEAL."
        notification = Notification(
            id=notif_type, group_id=NULL, sender_id=sender_id, recipient_id=recipient_id, body=body)

    result = {
        'id': id,
        'group_id': NULL,
        'sender_id': sender_id,
        'recipient_id': recipient_id,
        'body': body,
    }
    return jsonify(result)


# The profile(used_id) retreives all associated data with the user such as the groups theyre involved in,
# the white box people and black box people.

@app.route("/users/<user_id>", methods=['GET'])
def profile(user_id):
    user = User.query.filter_by(id=user_id)
    users = User.query.all()
    black = BlackBox.query.filter_by(user_id=user_id)
    white = WhiteBox.query.filter_by(user_id=user_id)
    group = Groups.query
    groupMem = GroupMembers.query.filter_by(user_id=user_id)
    print("Searching for Profile")
    blk = BlackBoxSchema(many=True)
    wht = WhiteBoxSchema(many=True)
    us = UserSchema(many=True)
    us2 = UserSchema(many=True)
    g = GroupSchema(many=True)
    gM = GroupMemSchema(many=True)
    output = us.dump(user)
    output2 = wht.dump(white)
    output3 = blk.dump(black)
    output4 = g.dump(group)
    output5 = gM.dump(groupMem)
    output6 = us2.dump(users)
    result = {
        'User': output,
        'White': output2,
        'Black': output3,
        'Groups': output4,
        'GroupMembers': output5,
        'Users': output6
    }
    return jsonify(result)


# The groupsPage(id) function retrieves all of the groups and associated data for the groups,
# such as users, polls, votes.

@app.route("/projects/<id>", methods=['GET'])
def groupsPage(id):
    print(id)
    group = Groups.query.filter_by(group_id=id)
    groupMem = GroupMembers.query.filter_by(group_id=id)
    users = User.query.all()
    posts = Post.query.filter_by(group_id=id)
    polls = Poll.query.filter_by(group_id=id)
    pollopts = PollOptions.query.join(
        Poll, PollOptions.poll_id == Poll.poll_id).filter_by(group_id=id)
    vote = VoteHandle.query.filter_by(group_id_subject=id)
    todo = Todo.query.filter_by(group_id=id)
    u = UserSchema(many=True)
    g = GroupSchema(many=True)
    gM = GroupMemSchema(many=True)
    p = PostSchema(many=True)
    pl = PollSchema(many=True)
    plo = PollOptionsSchema(many=True)
    vt = VoteHandleSchema(many=True)
    td = TodoSchema(many=True)
    output = g.dump(group)
    output2 = gM.dump(groupMem)
    output3 = u.dump(users)
    output4 = p.dump(posts)
    output5 = pl.dump(polls)
    output6 = plo.dump(pollopts)
    output7 = vt.dump(vote)
    output8 = td.dump(todo)
    result = {
        'Group': output,
        'GroupMembers': output2,
        'Users': output3,
        'Posts': output4,
        'Polls': output5,
        "PollOptions": output6,
        'Vote': output7,
        'Todo': output8
    }
    print(result['PollOptions'])
    return jsonify(result)


# The profilesAndGroups() function gets all of the users and groups and displayed the top rated profiles in
# the landing page.

@app.route('/', methods=['GET'])
def profilesAndGroups():
    users = User.query.order_by(User.rating.desc()).limit(3)
    groups = Groups.query.order_by(Groups.rating).limit(3)
    user = UserSchema(many=True)
    group = GroupSchema(many=True)
    output = user.dump(users)
    output.reverse()
    output2 = group.dump(groups)

    result = {
        'Users': output,
        'Groups': output2
    }

    return result

# This route redirects the login function to be used at the /users/login page


@app.route('/users/login', methods=['POST'])
def login():
    email = request.get_json()['email']
    password = request.get_json()['password']

    result = ""
    members = User.query.join(GroupMembers, User.id == GroupMembers.user_id)
    
    user = User.query.filter_by(email=str(email)).first()
    banned_emails = getBlackListEmails(email)
    if (email in banned_emails):
        print(email, " IS BANNED! --py")
        return jsonify({"login_banned": True})
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity={'id': user.id, 'user_name': user.user_name,
                                                     'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email, 'rating': user.rating, 'id': user.id})
        result = access_token
    else:
        result = jsonify({"login_error": True})

    return result

# This route redirects the removeToDo function to be used at the group page


@app.route("/projects/<group_id>/remove-todo/<item_id>", methods=["POST"])
def removeTodo(group_id, item_id):
    print(group_id)
    print(item_id)
    #db.session.query(Todo).filter(group_id == group_id).filter(id==item_id).delete(synchronize_session=False)
    # db.session.query(User).filter(User.id == user).update(
    #       {User.rating: User.rating + reduce_points})
    #removeTodo = Todo.query.filter(group_id == group_id).filter(id==item_id).delete(synchronize_session=False)
    #removeTodo = db.session.query(Todo).filter(group_id == group_id).filter(id==item_id)
    Todo.query.filter_by(group_id=group_id, id=item_id).delete()
    db.session.commit()
    todo = TodoSchema(many=True)
    result = todo.dump(Todo.query.filter(group_id == group_id).all())
    print("Todo removed")
    return jsonify(result)

    # endpoint for updating todo item


@app.route('/projects/<group_id>', methods=['POST'])
def posts(group_id):
  #  id = request.json['id']
    post = PostSchema()
    taboo = open('taboo.txt', 'r')
    title = request.json['title']
    content = request.json['content']
    user = request.json['user_id']
    name = request.json['user_name']
    group = request.json['group_id']

    date_posted = datetime.strptime(
        request.json['date_posted'], "%a, %d %b %Y %H:%M:%S %Z")
    print(date_posted)
    reduce_points = 0  # Amount of points to reduce if taboo word is found
    taboo_found = []
    for line in taboo:
        stripped_line = line.strip()
        # print(stripped_line)
        if stripped_line in title:
            taboo_found.append(stripped_line)
            title = title.replace(stripped_line, '*'*len(stripped_line))
        if stripped_line in content:
            taboo_found.append(stripped_line)
            content = content.replace(stripped_line, '*'*len(stripped_line))
    reduce_points = pointDeduction(name, taboo_found)
    taboo.close()

    violation = False
    if reduce_points < 0:  # If the reduction_points is < 0, then reduce the necessary points to the user who used the taboo words
        print("POST VIOLATION:")
        print(taboo_found)
        print(reduce_points)
        updateRep(user, reduce_points)
        violation = True

#    date = request.json['date_posted']
    # Adding the new post along with the time stamp
    new_post = Post(title=title, date_posted=date_posted,
                    content=content, user_id=user, user_name=name, group_id=group)
    db.session.add(new_post)
    db.session.commit()

    print("Post_Added")
    result = post.dump(Post.query.filter_by(group_id=group_id))
    print(result)
    return jsonify({'result': result, "violation": violation, "reduced": reduce_points})


@app.route('/projects/<group_id>/add-todo', methods=['POST'])
def addTodo(group_id):
    todo = TodoSchema(many=True)

    text = request.json['text']
    user_id = request.json['user_id']
    status = request.json['status']
    group_id = group_id

    new_todo = Todo(text=text,
                    user_id=user_id, status=status, group_id=group_id)
    db.session.add(new_todo)
    db.session.commit()
    new_todo = Todo.query.filter(group_id == group_id)
    print("New Todo added")
    result = todo.dump(new_todo)
    return jsonify({'result': result})
# This route redirects the updateToDo function to be used at the group page


@app.route('/projects/<group_id>/update-todo/<item_id>', methods=['POST'])
def updateTodo(group_id, item_id):
    #users = User.query.order_by(User.rating)
    #user = UserSchema(many=True)
    #output = user.dump(users)
    # result = {
    #    'Users': output
    # }
    #       db.session.query(User).filter(User.id == user).update(
    #       {User.rating: User.rating + reduce_points})
    todo = TodoSchema(many=True)
  #  id = request.json['id']
    print("aaaah")
    new_todo = db.session.query(Todo).filter(Todo.group_id == group_id).filter(id == item_id).update({
        'status': request.json['status']
    }, synchronize_session='fetch')
    print("Todo Updated")
    db.session.commit()
    new_todo = Todo.query.filter(group_id == group_id).filter(id == item_id)
    result = todo.dump(new_todo)
    return jsonify({'result': result})


# This route puts data in the database regarding a newly created poll where
# users can vote.

@app.route('/projects/<group_id>/createpoll', methods=['POST'])
def createPoll(group_id):
    poll = PollSchema()
    polloptions = PollOptionsSchema()
    group_id = request.json['group_id']
    taboo = open('taboo.txt', 'r')
    desc = request.json['description']
    user_id = request.json['user_id']

    reduce_points = 0  # Total amount of points to reduce if a taboo word is found
    penalty = 1  # Number of points to reduce for each word found in the description
    words_found = []
    for line in taboo:
        stripped_line = line.strip()
        # print(stripped_line)
        if stripped_line in desc:
            reduce_points -= penalty  # Reduce points if taboo is in the poll description
            desc = desc.replace(stripped_line, '*'*len(stripped_line))
            words_found.append(stripped_line)
    taboo.close()
    # Penalizing the User for using a taboo word when creating a poll
    if(reduce_points < 0):
        print("POLL VIOLATION:")
        print(words_found)
        updateRep(user_id, reduce_points)

    creation_poll = Poll(desc=desc, group_id=group_id)
    db.session.add(creation_poll)
    db.session.commit()
    cur_poll = db.session.query(db.func.max(Poll.poll_id)).scalar()
    for i in request.json['polls']:
        date = i['date']
        start = i['startTime']
        end = i['endTime']
        print(date)
        print(start)
        print(end)
        new_poll = PollOptions(
            option='On '+date+': Start -'+start+' End - '+end, poll_id=cur_poll, votes=0)
        db.session.add(new_poll)
        db.session.commit()
    new_poll = PollOptions(option='None of these choices.',
                           poll_id=cur_poll, votes=0)
    db.session.add(new_poll)
    db.session.commit()
    results = poll.dump(Poll.query.filter_by(group_id=group_id))
    return jsonify({'result': results})


# This route gets a specific groups poll on displays it on the respective group page.

@app.route('/projects/<group_id>/poll/<poll_id>', methods=['GET'])
def getpoll(group_id, poll_id):
    placeholder = poll_id
    polls = Poll.query.filter_by(poll_id=placeholder)
    pollopts = PollOptions.query.join(
        Poll, PollOptions.poll_id == Poll.poll_id).filter_by(poll_id=placeholder)
    pl = PollSchema(many=True)
    plo = PollOptionsSchema(many=True)
    output1 = pl.dump(polls)
    output2 = plo.dump(pollopts)
    result = {
        'Polls': output1,
        "PollOptions": output2
    }
    print(result['PollOptions'])
    print(result['Polls'])
    return jsonify(result)


# This route posts data collected from the poll into a database.

@app.route('/projects/<group_id>/poll/<poll_id>', methods=['POST'])
def pollvote(group_id, poll_id):
    placeholder = poll_id
    polloptions = PollOptionsSchema()
    data = request.json['NewPollData']
    pollopts = PollOptions.query.filter_by(poll_id=placeholder)
    pl = PollOptionsSchema(many=True)
    inputinto = pl.dump(pollopts)
    print(inputinto[0]['id'])
    print(data)
    for i in range(len(data)):
        update = PollOptions.query.filter_by(id=inputinto[i]['id']).first()
        update.votes = data[i]['votes']
        db.session.commit()
    results = polloptions.dump(Poll.query.filter_by(group_id=group_id))
    return jsonify({'result': results})


# This route displays the users and members in a group so that they can be
# displayed when going to give a complaint/warning/praise

@app.route('/projects/<group_id>/createissue/handler', methods=['GET'])
def createissues(group_id):
    placeholder = group_id
    users = UserSchema()
    members = User.query.join(GroupMembers, User.id == GroupMembers.user_id)
    u = UserSchema(many=True)
    output1 = u.dump(members)
    print(output1)
    results = {
        "Users": output1
    }
    return jsonify(results)


# This route posts the information collected from a user regarding the actions
# they performed in the create issue page.

@app.route('/projects/<group_id>/createissue/handler', methods=['POST'])
def issuedvote(group_id):
    vote = VoteHandleSchema()
    voters = VotersSchema()
    group = request.json['group_id']
    desc = request.json['description']
    issuer = request.json['issuer_id']
    members = request.json['user_list']
    subject = request.json['subject_name']
    vote_type = request.json['vote_type']
    creation_vote = VoteHandle(desc=desc, user_id_issuer=issuer,
                               user_id_subject=subject, group_id_subject=group, vote_type=vote_type, vote_yes=1, vote_no=0, status=1)
    db.session.add(creation_vote)
    db.session.commit()
    cur_vote = db.session.query(db.func.max(VoteHandle.vote_id)).scalar()
    for i in request.json['user_list']:
        users_id = i['id']
        print(users_id)
        if(users_id != issuer):
            new_voter = Voters(vote_id=cur_vote, user_id=users_id, status=0)
            db.session.add(new_voter)
            db.session.commit()

    results = vote.dump(VoteHandle.query.filter_by(group_id_subject=group))
    return jsonify({'result': results})


# This route gets voters who voted in a poll.

@app.route("/projects/<group_id>/votefor/issue/<vote_id>", methods=['GET'])
def voteresponder(group_id, vote_id):
    placeholder = vote_id
    p2 = group_id
    votes = VoteHandle.query.filter_by(vote_id=placeholder)
    voters = Voters.query.filter_by(vote_id=placeholder)
    users = User.query.join(
        Voters, User.id == Voters.user_id).filter_by(vote_id=placeholder)
    users2 = User.query.join(GroupMembers, User.id ==
                             GroupMembers.user_id).filter_by(group_id=p2)
    pl = VoteHandleSchema(many=True)
    plo = VotersSchema(many=True)
    u = UserSchema(many=True)
    u2 = UserSchema(many=True)
    output1 = pl.dump(votes)
    output2 = plo.dump(voters)
    output3 = u.dump(users)
    output4 = u2.dump(users2)
    print(output4)
    result = {
        'VoteInfo': output1,
        "Voters": output2,
        'Users': output3,
        "Members": output4
    }
    print(result['VoteInfo'])
    print(result['Voters'])
    return jsonify(result)

# This route records voters reponses.


@app.route("/projects/<group_id>/votefor/issue/<vote_id>", methods=['POST'])
def pushvote(group_id, vote_id):
    placeholder = vote_id
    p2 = group_id
    vote = VoteHandleSchema()
    voters = VotersSchema()
    data = request.json['NewVoteData']
    voter = request.json['user_id_access']
    casted_vote = VoteHandle.query.filter_by(vote_id=placeholder)
    v1 = VoteHandleSchema(many=True)
    inputinto = v1.dump(casted_vote)
    print(inputinto[0]['vote_id'])
    print(data)
    update = VoteHandle.query.filter_by(
        vote_id=inputinto[0]['vote_id']).first()
    update.vote_yes = data[0]['votes']
    db.session.commit()
    update2 = VoteHandle.query.filter_by(
        vote_id=inputinto[0]['vote_id']).first()
    update2.vote_no = data[1]['votes']
    update3 = Voters.query.filter_by(
        vote_id=placeholder, user_id=voter).first()
    update3.status = int(1)
    db.session.commit()
    results = voters.dump(Voters.query.filter_by(vote_id=placeholder))
    return jsonify({'result': results})


# This route redirects the account function to be used at the profile page


@app.route("/profile")
def account():
    image_file = url_for(
        'static', filename='client/src/components/ProfileImages/user.jpg')


# ---------------------------- SUPPLEMENTARY FUNCTIONS FOR ACCOUNT RETRIEVAL-------------------------


def pointDeduction(user_name, guilty_words):
    if len(guilty_words) == 0 or "".join(guilty_words).isspace():
        return 0
    target_path = os.getcwd() + "/UserTaboos/" + user_name + "Taboo.txt"
    if path.exists(target_path):
        print("TABOO FILE FOUND")
        with open(target_path, "r+") as current_file:
            taboo_lines = set(current_file.read().splitlines())
            content_lines = set([i.lower() for i in guilty_words])
            check_repeats = list(content_lines.intersection(taboo_lines))

            penalty = 0
            if len(check_repeats) == 0:
                for new_taboo in content_lines:
                    if new_taboo not in taboo_lines:
                        current_file.write(new_taboo.lower() + "\n")
                        penalty -= 1
                return penalty
            else:
                for new_taboo in content_lines:
                    if new_taboo not in taboo_lines:
                        current_file.write(new_taboo.lower() + "\n")
                        penalty -= 1
                return (len(check_repeats)*-5) + penalty
        print("TABOO PROCESSED")
    else:
        print("FIRST TIME OFFENDER")
        content_lines = set(guilty_words)
        with open(target_path, "w") as current_file:
            for new_taboo in content_lines:
                current_file.write(new_taboo.lower() + "\n")
        return -1 * len(content_lines)

# Updates the reputation points of a particular user given their id


def updateRep(user_id, rep_points):
    modify_user = User.query.get_or_404(
        user_id)  # Might need exception handling
    print("USER:\t", user_id)
    print("PENALTY:\t", rep_points)
    print("BEFORE", modify_user)  # Debugging
    db.session.query(User).filter(User.id == user_id).update(
        {User.rating: User.rating + rep_points})  # Querying for the user data and updating
    print("AFTER", modify_user)  # Debugging
    db.session.commit()

# Returns the list of black_listed_user names given the target user_name


def getBlackListUsers(user_name):
    # Getting the rows within the black_list table
    find_user = BlackListSchema(many=True)
    # Querying the Black list for the target user
    banned_list = find_user.dump(
        BlackList.query.filter_by(user_name=user_name))

    # Getting the blacklisted user_names and returning them in a list
    return [each_user['user_name'] for each_user in banned_list]

# Returns the list of black_listed emails given a user_email


def getBlackListEmails(user_email):
    if len(user_email) == 0:  # Base case
        return None

    # Getting the rows within the user table
    find_user = UserSchema(many=True)
    # Getting the target user accounts based on their email
    target_user = find_user.dump(
        User.query.filter_by(email=user_email))
    # Getting the target user names based on the given email
    email_to_user_name = [account['user_name'] for account in target_user]

    # Getting the banned users associated with each target user
    banned_users = [getBlackListUsers(i) for i in email_to_user_name]
    # Folding the banned users list from the given email
    black_list = [
        user_name for banned_list in banned_users for user_name in banned_list]

    # There were no emails associated with the target user from email
    if len(black_list) == 0 or black_list is None:
        print(user_email, " IS NOT BANNED!")
        return []
    else:  # We found users in the black_list by the given target user, then return the email itself
        print(user_email, " IS BANNED!")
        return [user_email]


# Deletes all rows from the following tables. BlackBox, BlackList, Groups, User, WhiteBox
"""
def delete_table_data():
    db.session.query(BlackBox).delete()
    db.session.query(BlackList).delete()
    db.session.query(Groups).delete()
    db.session.query(GroupMembers).delete()
    db.session.query(Notification).delete()
    db.session.query(User).delete()
    db.session.query(Todo).delete()
    db.session.query(WhiteBox).delete()
    db.session.commit()
"""

# Populates rows in the following tables.

"""
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
        group_id=1, group_name='Team X', rating=20, group_desc="Good", visi_posts=True, visi_members=True, visi_eval=True, visi_warn=True)
    # fields = ('group_id', 'group_name', 'rating', 'group_desc', 'visi_posts', 'visi_members', 'visi_eval', 'visi_warn')

    groups2 = Groups(
        group_id=2, group_name='Team A', rating=0, group_desc="Bad", visi_posts=True, visi_members=False, visi_eval=False, visi_warn=True)

    groups3 = Groups(
        group_id=3, group_name='Students', rating=0, group_desc="Ugly", visi_posts=False, visi_members=False, visi_eval=False, visi_warn=False)

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

    todo1 = Todo(id=1, text="Get em", user_id=9, status=0, group_id=3)
    todo2 = Todo(id=2, text="Rule", user_id=8, status=1, group_id=3)
    todo3 = Todo(id=3, text="Buy food", user_id=6, status=1, group_id=2)
    todo4 = Todo(id=4, text="Buy food again", user_id=2, status=0, group_id=1)
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
    db.session.add(todo1)
    db.session.add(todo2)
    db.session.add(todo3)
    db.session.add(todo4)


    notification1 = Notification(
        notif_id=1, id=1, sender_id=2, recipient_id=3, body='Hello Frank')

    notification2 = Notification(
        notif_id=2, id=2, sender_id=3, recipient_id=5, body='Hello Peter')

    notification3 = Notification(
        notif_id=3, id=3, sender_id=2, recipient_id=4, body='Hello Henry')

    db.session.add(notification1)
    db.session.add(notification2)
    db.session.add(notification3)

    # commit additions
    db.session.commit()

    print("Done")
"""

if __name__ == '__main__':

    # delete_table_data()
    # populate_table_data()
    app.run(debug=True)

   # socketIo.run(app)
