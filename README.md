# Air Quality Prediction - Kathmandu Valley

A full-stack web application for predicting air quality (PM2.5) in Kathmandu Valley using machine learning models and real-time data from PurpleAir sensors.

## Features

### Frontend (React.js)
- **Real-time Dashboard**: Displays current PM2.5, AQI, and weather data
- **24-hour Forecast**: Interactive chart showing predicted PM2.5 levels
- **Color-coded Status**: Visual indicators for air quality levels (Good, Moderate, Unhealthy, etc.)
- **Model Comparison**: Performance metrics for different ML models (MAE, RMSE, R²)
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-refresh**: Updates every 2 minutes with latest sensor data

### Backend (Django REST Framework)
- **RESTful APIs**: Clean endpoints for data access
- **PurpleAir Integration**: Fetches real-time PM2.5 data from sensor network
- **Meteostat Integration**: Weather data for enhanced predictions
- **Data Processing**: Handles missing values, normalization, and sensor averaging
- **Model Management**: Trains and serves multiple ML models

### Machine Learning Models
1. **LSTM**: Long Short-Term Memory neural network for temporal patterns
2. **SARIMA**: Seasonal ARIMA for capturing daily/seasonal cycles
3. **Multiple Linear Regression**: Weather and temporal features
4. **ARIMA**: AutoRegressive model for trend analysis
5. **Linear Regression**: Baseline model for comparison

## API Endpoints

### Current Data
```
GET /api/current
```
Returns current air quality and weather data averaged from multiple PurpleAir sensors in Kathmandu Valley.

### Forecast
```
GET /api/forecast
```
Returns 24-hour PM2.5 predictions using the best performing model.

### Model Metrics
```
GET /api/models
```
Returns performance metrics (MAE, RMSE, R²) for all trained models.

### Model-specific Predictions
```
GET /api/predict/<model_name>
```
Returns predictions from a specific model for comparison.

### Sensor Data
```
GET /api/sensors
```
Returns raw data from PurpleAir sensors in the region.

## Data Sources

### PurpleAir API
- **Real-time PM2.5 data** from citizen science sensor network
- **High frequency updates** (every 2 minutes)
- **Multiple sensors** in Kathmandu Valley for data validation
- **Quality assurance** through sensor averaging and outlier detection

### Meteostat API
- **Weather conditions**: Temperature, humidity, wind speed, pressure
- **Historical data** for model training
- **Meteorological context** for air quality predictions

## Technology Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons
- Date-fns for date handling

### Backend
- Django with Django REST Framework
- PostgreSQL database
- Celery for background tasks
- Redis for caching
- Docker for containerization

### Machine Learning
- Python with scikit-learn, TensorFlow/Keras
- Pandas and NumPy for data processing
- Jupyter notebooks for model development
- MLflow for experiment tracking

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL
- Redis
- Docker (optional)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:8000/api
```

**Backend (.env)**
```
PURPLEAIR_API_KEY=your_purpleair_api_key
METEOSTAT_API_KEY=your_meteostat_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/airquality
REDIS_URL=redis://localhost:6379/0
```

## Production Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment
1. Build React app: `npm run build`
2. Configure Django to serve static files
3. Set up PostgreSQL and Redis
4. Configure reverse proxy (Nginx)
5. Set up SSL certificates
6. Configure environment variables

## Model Training

The application includes scripts for:
- **Data Collection**: Fetching historical data from PurpleAir and Meteostat
- **Data Preprocessing**: Cleaning, normalization, feature engineering
- **Model Training**: Training all ML models with cross-validation
- **Model Evaluation**: Computing performance metrics
- **Model Deployment**: Saving trained models for production use

### Training Pipeline
```bash
cd ml
python collect_data.py
python preprocess_data.py
python train_models.py
python evaluate_models.py
```

## API Integration Details

### PurpleAir API Integration
- **Sensor Selection**: Filters for outdoor sensors in Kathmandu Valley
- **Data Quality**: Validates sensor readings and removes outliers
- **Averaging**: Combines multiple sensor readings for robust measurements
- **Rate Limiting**: Respects API limits with proper caching

### Model Serving
- **Real-time Predictions**: Models serve predictions via REST API
- **Model Comparison**: Multiple models available for performance comparison
- **Automatic Retraining**: Periodic model updates with new data
- **Fallback Mechanisms**: Graceful handling of model failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- PurpleAir for providing open access to air quality sensor data
- Meteostat for weather data API
- The open source community for the excellent tools and libraries used in this project