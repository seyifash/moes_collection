from models import storage
from models.user import User
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request


@app_views.route('/users', methods=['GET'], strict_slashes=False)
def get_users():
    users =[]
    for user in  storage.all(User).values():
        users.append(user.to_dict())
    return jsonify(users)

@app_views.route('/users_api/<users_id>', methods=['GET'], strict_slashes=False)
def get_users_byid(users_id):
    users = storage.get_user_by_id(User, users_id)
    if users is None:
        abort(404)
    return jsonify(users.to_dict()) 

@app_views.route('/users_api/<users_id>', methods=['DELETE'], strict_slashes=False)
def delete_user(users_id):
    users = storage.get_user_by_id(User, users_id)
    if users is None:
        abort(404)
    users.delete()
    storage.save()
    return jsonify({})

@app_views.route('/users_api', methods=['POST'], strict_slashes=False)
def Post_user():
    if not request.get_json():
        abort(400, description="Not a JSON")
    data = request.get_json()
    user = User(**data)
    user.save()
    
    return make_response(jsonify(user.to_dict()), 201)

@app_views.route('/users_api/<users_id>', methods=['PUT'], strict_slashes=False)
def put_user(users_id):
    """update a user"""
    if not request.get_json():
        abort(400, description="Not a Json")
    user = storage.get_user_by_id(User, users_id)
    if user is None:
        abort(404)
    for key, value in request.get_json().items:
        if key not in ['id', 'created_at', 'updated_at']:
            setattr(user, key, value)
    storage.save()
    return make_response(jsonify(user.to_dict()))
        



    