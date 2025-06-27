from flask import Flask, render_template, request, jsonify, url_for

app = Flask(__name__)

# This dictionary maps feeling choices to video filenames
VIDEO_MAP = {
    'greatest': 'video1.mp4',
    'gustong': 'video2.mp4',
    'miss': 'video3.mp4'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_video', methods=['POST'])
def get_video():
    data = request.get_json()
    feeling = data.get('feeling')

    if feeling in VIDEO_MAP:
        video_filename = VIDEO_MAP[feeling]
        # Use url_for to generate the correct URL for the static video file
        video_url = url_for('static', filename=f'videos/{video_filename}')
        return jsonify({'video_url': video_url})
    else:
        # This will be returned if 'default' or any other unknown feeling is sent
        return jsonify({'error': 'Invalid feeling selected'}), 400

# --- Main execution block ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000)) 
    _ensure_database_schema() # Ensure schema on startup
    app.run(debug=debug_mode, host='0.0.0.0', port=port) # Use 0.0.0.0 for Render deployment
