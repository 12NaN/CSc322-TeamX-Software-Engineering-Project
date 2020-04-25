from flask import Flask, jsonify, request, json
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

db = SQLAlchemy(app)
# In Python terminal "from app import db" then "db.create_all()"


class BlackBox(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))

    def __repr__(self):
        return f"BlackBox('{self.user_id}')"


class BlackList(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)
    user_name = db.Column(db.String(20), db.ForeignKey(
        'user.user_name'))

    def __repr__(self):
        return f"BlackList('{self.user_id}')"


class Groups(db.Model):
    group_id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"Groups('{self.group_id}')"


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False,
                            default=datetime.utcnow)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Post('{self.title}', '{self.date_posted}')"


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


class WhiteBox(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.id', ondelete="CASCADE"), primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey(
        'groups.group_id', ondelete="CASCADE"))

    def __repr__(self):
        return f"WhiteBox('{self.user_id}')"


"""
class RequestResetForm(FlaskForm):
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    submit = SubmitField('Request Password Reset')

    def validate_email(self, email):
        user = User.query.filter_by(email = email.data).first()
        if user is None:
            raise ValidationError(
                'There is no account with that email. You must register first.')

class ResetPasswordForm(FlaskForm):
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[
                                     DataRequired(), EqualTo('')])

    submit = SubmitField('Reset Password')
"""
app.config['JWT_SECRET_KEY'] = 'secret'

# mysql = MySQL(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)


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
  #  created = datetime.utcnow()

    user = User(user_name=user_name, first_name=first_name, last_name=last_name, email=email,
                password=password, interest=interest, references=references)  # , created=created)
    db.session.add(user)
    db.session.commit()
#    cur.execute("INSERT INTO users (first_name, last_name, email, password, created) VALUES ('" +
#		str(first_name) + "', '" +
#		str(last_name) + "', '" +
#		str(email) + "', '" +
#		str(password) + "', '" +
#		str(created) + "')")
#    mysql.connection.commit()
    result = {
        'user_name': user_name,
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password,
        'interest': interest,
        'references': references
    }

    return jsonify({'result': result})


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


@app.route("/profile")
def account():
    image_file = url_for(
        'static', filename='client/src/components/ProfileImages/user.jpg')


if __name__ == '__main__':
    app.run(debug=True)
