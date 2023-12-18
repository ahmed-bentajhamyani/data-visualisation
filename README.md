# Data Visualisation
# FastAPI Project

## Setup Virtual Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment (Windows)
venv\Scripts\activate

# Activate the virtual environment (macOS/Linux)
source venv/bin/activate

# Install FastAPI and Uvicorn
pip install -r requirements.txt

# Run the FastAPI application with Uvicorn
uvicorn main:app --reload

# Access API Documentation
Swagger UI: http://127.0.0.1:8000/docs
ReDoc: http://127.0.0.1:8000/redoc
