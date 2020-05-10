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


app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'


app.config['SECRET_KEY'] = 'top-secret!'
app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'apikey'
app.config['MAIL_PASSWORD'] = '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'
app.config['MAIL_DEFAULT_SENDER'] = 'admin@friends.com'


# API Key needed for the post function of the program
pusher = Pusher(
    app_id='989464',
    key='5481efcb3669a7275fd2',
    secret='ae4b5727ee6f310f7985',
    cluster='us2',
    ssl=True
)


mail = Mail(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)
# In Python terminal "from app import db" then "db.create_all()"


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
    group_name = db.Column(db.String(20), nullable=False)
    group_desc = db.Column(db.Text, nullable=False)
    visi_posts = db.Column(db.Boolean, nullable=False)
    visi_members = db.Column(db.Boolean, nullable=False)
    visi_eval = db.Column(db.Boolean, nullable=False)
    visi_warn = db.Column(db.Boolean, nullable=False)
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
    
class Poll(db.Model):
    poll_id = db.Column(db.Integer, primary_key=True)
    desc = db.Column(db.String(100), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id'), nullable=False)
        
class PollOptions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    option = db.Column(db.String(100), nullable=False)
    poll_id = db.Column(db.Integer, db.ForeignKey(
        'poll.poll_id'), nullable=False)
    count = db.Column(db.Integer, nullable=True)

# This class creates the Post table in SQLITE


class Notification(db.Model):
    id = db.Column(db.Integer)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))
    sender_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    recipient_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    body = db.Column(db.String(140), primary_key=True)

    def __repr__(self):
        return '<Message {}>'.format(self.body)


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

# This class creates the User table in SQLITE


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


class Todo(db.Model):
    __tablename__ = 'todo'
    id = db.Column('id', db.Integer, primary_key=True)
    text = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"))
    status = db.Column(db.Integer, nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('id', 'user_name', 'email', 'interest', 'rating')


class GroupSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('group_id', 'group_name', 'group_desc',
                  'visi_posts', 'visi_members', 'visi_eval', 'visi_warn', 'rating')


class GroupMemSchema(ma.SQLAlchemySchema):
    class Meta:
        fields = ('group_id', 'user_id')


class PostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ('title', 'date_posted', 'content', 'user_id', 'user_name', 'group_id')


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

class PollSchema():
    class Meta:
        fields = ('desc', 'group_id')

class PollOptionsSchema():
    class Meta:
        fields = ('id', 'option', 'poll_id', 'count')

    
        
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

    # Getting the rows within the black_list table
    find_user = BlackListSchema(many=True)
    banned_list = find_user.dump(
        BlackList.query.filter_by(user_name=user_name))
    # Getting the blacklisted user_names and storing them in a list
    banned_users = [each_user['user_name'] for each_user in banned_list]

    # Checking if the filled out user name is within the black listed user_names
    if (user_name in banned_users):
        print("CURRENT_USER:", user_name, "HAS BEEN BLACK LISTED!")
        # Not sure what to return when a user is black listed, but this works without any erorrs...
        return jsonify({'result': None})
    else:  # The user_name is not black listed and is added to the database
        user = User(user_name=user_name, first_name=first_name, last_name=last_name, email=email,
                    password=password, interest=interest, references=references, user_type=user_type, rating=rating)  # , created=created)

    notification = Notification(
        id=3, group_id=NULL, sender_id=2, recipient_id=1, body="A new visitor has just registered.!!")

    db.session.add(user)
    db.session.add(notification)
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
    print("ACCUNT CREATED:\n", result)
    return jsonify({'result': result})


@app.route('/projects', methods=['GET'])
def groups():
    groups = Groups.query.order_by(Groups.rating)
    group = GroupSchema(many=True)
    output = group.dump(groups)
    result = {
        'Groups': output
    }
    return jsonify(result)


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

    print("POSSSSSSSSSST")
    result = group.dump(Groups.query.filter_by(group_name=name))
    print(result)
    return jsonify({'result': result})


@app.route('/users', methods=['GET'])
def profiles():
    users = User.query.order_by(User.rating)
    user = UserSchema(many=True)
    output = user.dump(users)
    result = {
        'Users': output
    }
    return jsonify(result)


@app.route('/notifications', methods=['GET'])
def showNotifications():
    notifications = Notification.query.filter(Notification.sender_id)
    n = NotificationSchema(many=True)
    output = n.dump(notifications)

    result = {
        'Notifications': output,
    }

    return jsonify(result)


@app.route('/notifications', methods=['POST'])
def approve():
    print("HELLO")
    id = request.json['id']
    sender_id = request.json['sender_id']
    recipient_id = request.json['recipient_id']
    body = "yyyyy"

    notification = Notification(
        id=id, group_id=NULL, sender_id=sender_id, recipient_id=2, body=body)
    db.session.add(notification)
    db.session.commit()
    msg = Message('Twilio SendGrid Test Email',
                  recipients=['bareval001@citymail.cuny.edu'])

    msg.body = 'This is a test email!'
    msg.html = '<p>This is a test email!</p>'
    mail.send(msg)

    result = {
        'id': id,
        'group_id': NULL,
        'sender_id': sender_id,
        'recipient_id': recipient_id,
        'body': body,
    }
    return jsonify(result)


@app.route("/users/<user_id>", methods=['GET'])
def profile(user_id):
    user = User.query.filter_by(id=user_id)
    users = User.query.all()
    black = BlackBox.query.filter_by(user_id=user_id)
    white = WhiteBox.query.filter_by(user_id=user_id)
    group = Groups.query
    groupMem = GroupMembers.query.filter_by(user_id=user_id)
    print(groupMem)
    print("helllllllllllllllo")
    blk = BlackBoxSchema(many=True)
    wht = WhiteBoxSchema(many=True)
    us = UserSchema(many=True)
    us2 = UserSchema(many = True)
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


@app.route("/projects/<id>", methods=['GET'])
def groupsPage(id):
    print(id)
    group = Groups.query.filter_by(group_id=id)
    groupMem = GroupMembers.query.filter_by(group_id=id)
    users = User.query.all()
    posts = Post.query.filter_by(group_id=id)
    u = UserSchema(many=True)
    g = GroupSchema(many=True)
    gM = GroupMemSchema(many=True)
    p = PostSchema(many=True)
    output = g.dump(group)
    output2 = gM.dump(groupMem)
    output3 = u.dump(users)
    output4 = p.dump(posts)
    result = {
        'Group': output,
        'GroupMembers': output2,
        'Users': output3,
        'Posts': output4
    }
    return jsonify(result)


@app.route('/', methods=['GET'])
def profilesAndGroups():
    users = User.query.order_by(User.rating).limit(3)
    groups = Groups.query.order_by(Groups.rating).limit(3)
    user = UserSchema(many=True)
    group = GroupSchema(many=True)
    output = user.dump(users)
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

    user = User.query.filter_by(email=str(email)).first()

    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity={'id': user.id, 'user_name': user.user_name,
                                                     'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email, 'rating': user.rating, 'id': user.id})
        result = access_token
    else:
        result = jsonify({"error": "Invalid username and password"})

    return result
# This route redirects the removeToDo function to be used at the group page


@app.route("/projects/<group_id>/remove-todo/<item_id>")
def removeTodo(group_id, item_id):
    data = {'id': item_id}
    pusher.trigger("room", 'item-removed', data)
    print(group_id)
    return jsonify(data)

    # endpoint for updating todo item


@app.route('/projects/<group_id>', methods=['GET'])
def getTodo(group_id):
    todo = Todo.query.filter_by(group_id=group_id)
    to = todoSchema(many=True)
    output = to.dump(todo)

    result = {
        'Todo': output
    }
    return result


@app.route('/projects/<group_id>', methods=['POST'])
def posts(group_id):
  #  id = request.json['id']
    post = PostSchema()
    taboo = open('taboo.txt', 'r')
    title = request.json['title']
    content = request.json['content']
    date_posted = datetime.strptime(
        request.json['date_posted'], "%a, %d %b %Y %H:%M:%S %Z")
    print(date_posted)
    reduce_points = 0  # Amount of points to reduce if taboo word is found
    penalty = 5  # Number of points to reduce if a taboo word is found within the title or content
    for line in taboo:
        stripped_line = line.strip()
        # print(stripped_line)
        if stripped_line in title:
            reduce_points -= penalty  # Reduce points if taboo is in title
            print(stripped_line)
            title = title.replace(stripped_line, '*'*len(stripped_line))
        if stripped_line in content:
            reduce_points -= penalty  # Reduce Reduce points if taboo is in content
            print(stripped_line)
            content = content.replace(stripped_line, '*'*len(stripped_line))
    taboo.close()
    user = request.json['user_id']
    name = request.json['user_name']
    group = request.json['group_id']

    if reduce_points != 0:  # If the reduction_points is < 0, then reduce the necessary points to the user who used the taboo words
        modify_user = User.query.get_or_404(
            user)  # Might need exception handling
        print("BEFORE", modify_user)  # Debugging
        db.session.query(User).filter(User.id == user).update(
            {User.rating: User.rating + reduce_points})  # Querying for the user data and updating
        print("AFTER", modify_user)  # Debugging

#    date = request.json['date_posted']
    # Adding the new post along with the time stamp
    new_post = Post(title=title, date_posted=date_posted,
                    content=content, user_id=user, user_name=name, group_id=group)
    db.session.add(new_post)
    db.session.commit()

    print("Post_Added")
    result = post.dump(Post.query.filter_by(group_id=group_id))
    print(result)
    return jsonify({'result': result})


@app.route('/projects/<group_id>', methods=['POST'])
def addTodo():
    data = json.loads(request.data)  # load JSON data from request
    # trigger `item-added` event on `todo` channel
    pusher.trigger('room', 'item-added', data)
    return jsonify(data)
# This route redirects the updateToDo function to be used at the group page


@app.route('/projects/<group_id>', methods=['POST'])
def updateTodo(group_id):
    data = {
        'id': item_id,
        'completed': json.loads(request.data).get('completed', 0)
    }
    # 'private-'+str(group_id)
    pusher.trigger("room", 'item-updated', data)
    print("pushed")
    return jsonify(data)

@app.route('/projects/<group_id>/createpoll', methods=['POST'])
def createPoll(group_id):
    poll = PollSchema()
    polloptions = PollOptionsSchema()
    group_id = request.json['group_id']
    desc = request.json['description'] 
    polls = request.json['polls']
    print(polls)
    print(group_id)
    results = poll.dump(Poll.query.filter_by(group_id=group_id))
    return jsonify({'result': results})


# This route redirects the account function to be used at the profile page


@app.route("/profile")
def account():
    image_file = url_for(
        'static', filename='client/src/components/ProfileImages/user.jpg')


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
        id=1, sender_id=2, recipient_id=3, body='Hello Frank')

    notification2 = Notification(
        id=2, sender_id=3, recipient_id=5, body='Hello Peter')

    notification3 = Notification(
        id=3, sender_id=2, recipient_id=4, body='Hello Henry')

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
