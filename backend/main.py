from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import Agent

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Hello World"


@app.route('/summary', methods=['POST'])
def summary():
    data = request.json
    user_query = data.get("query")

    if not user_query:
        return jsonify({"error": "Missing query"}), 400
    
    try:
        agent = Agent(query=user_query)
        summary = agent.get_summary()
        tasks = agent.get_tasks()
        followup_email = agent.generate_followup_email()
        data["summary"] = summary
        data["tasks"] = tasks
        data["followup_email"] = followup_email
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/tasks', methods=['POST'])
def extract_tasks():
    data = request.json
    user_query = data.get("query")

    if not user_query:
        return jsonify({"error": "Missing query"}), 400
    
    try:
        # Use the Agent class to extract tasks
        agent = Agent(query=user_query)
        tasks = agent.get_tasks()  # Call the agent's get_tasks method
        data["tasks"] = tasks
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/followup', methods=['POST'])
def followup_email():
    data = request.json
    user_query = data.get("query")

    if not user_query:
        return jsonify({"error": "Missing query"}), 400
    
    try:
        # Use the Agent class to generate the follow-up email
        agent = Agent(query=user_query)
        followup_email = agent.generate_followup_email()  # Call the followup email generation method
        data["followup_email"] = followup_email
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == '__main__':
    app.run(host="localhost", port=5002, debug=True)