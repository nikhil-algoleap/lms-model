## Path A — ML / Data POC

**Stack:** Python · scikit-learn / XGBoost · Streamlit · SQLite  
**Deploy to:** Streamlit Community Cloud  
**Use when:** The demo is a predictive model, dashboard, or data analysis tool

### Folder structure
```
poc-[client]-[topic]/
├── POC_SETUP.md
├── .env
├── .gitignore
├── requirements.txt
├── README.md
├── data/
│   ├── raw/                  # original or synthetic input data
│   └── processed/            # cleaned datasets, feature-engineered outputs
├── models/
│   └── trained/              # saved .pkl model files
├── notebooks/
│   └── exploration.ipynb     # optional: Colab-style EDA notebook
├── src/
│   ├── generate_data.py      # synthetic data generation script
│   ├── train_model.py        # model training and evaluation
│   └── utils.py              # shared helper functions
└── app.py                    # Streamlit dashboard (entry point)
```

### Setup commands

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install standard ML stack
pip install streamlit pandas numpy scikit-learn plotly

# For higher accuracy + explainability POCs (XGBoost + SHAP)
pip install xgboost shap

# Freeze dependencies
pip freeze > requirements.txt
```
### Create a Starter file `app.py`

### Run locally

```bash
streamlit run app.py
# Opens at http://localhost:8501
```

### Heavy model training → use Google Colab

If training requires more than ~500MB RAM or uses PyTorch/TensorFlow:

1. Open [colab.research.google.com](https://colab.research.google.com)
2. Mount your GitHub repo or upload data manually
3. Train the model, save as `model.pkl` using `joblib.dump(model, "model.pkl")`
4. Download `model.pkl` → place in `models/trained/`
5. Load it in `app.py` with `joblib.load("models/trained/model.pkl")`

```python
# In Colab
import joblib
joblib.dump(trained_model, "model.pkl")
```

### Deploy to Streamlit Community Cloud

```
1. Push all code to GitHub (model.pkl included)
2. Go to share.streamlit.io
3. Click "New app" → connect your GitHub repo
4. Set Main file path: app.py
5. Add your .env variables under "Advanced settings → Secrets"
6. Click Deploy → get a .streamlit.app URL in ~60 seconds
7. Share the URL with the client
```