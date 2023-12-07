from flask import Flask, make_response, jsonify
from models import storage
from api.v1.views import app_views


app = Flask(__name__)
app.register_blueprint(app_views)

@app.teardown_appcontext
def teardown_appcontext(error):
    """close method close()"""
    storage.close()
    
@app.errorhandler(404)
def page_not_found(error):
    """Load error page 404"""
    return make_response(jsonify({"error": "Not found"}), 404)
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True, threaded=True)