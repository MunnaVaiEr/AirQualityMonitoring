from fastapi import FastAPI
from api import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Air Quality Prediction API",
    description="Backend using Random Forest and Open-Meteo live data",
    version="1.0.0"
)

app.include_router(router, prefix="/api")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] if using React dev server
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)



