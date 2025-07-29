
import React from 'react';
import Innovators from './Innovators';

const AboutPM25 = () => {
  // Safety label data
  const safetyLabels = [
    { level: "Good", range: "<12 μg/m³", color: "bg-green-500", textColor: "text-white" },
    { level: "Moderate", range: "13-35 μg/m³", color: "bg-yellow-400", textColor: "text-gray-800" },
    { level: "Unhealthy", range: ">36 μg/m³", color: "bg-red-500", textColor: "text-white" }
  ];


 

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <h1 className='md:text-6xl'>ABOUT US</h1>
&nbsp;
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Understanding PM2.5: Kathmandu's Invisible Threat
        </h1>
        <div className="text-lg text-gray-600 max-w-xl mx-auto">
          <ol>
            <li>PM2.5 is a major air pollutant in Kathmandu, especially during winter.</li>        
            <li>PM2.5 stands for Particulate Matter that is less than or equal to 2.5 micrometers in diameter.</li>
            <li>These particles are extremely small — about 30 times smaller than the diameter of a human hair.</li>
            <li>Because of their tiny size, they can penetrate deep into the lungs and even enter the bloodstream.</li>
          </ol>
        </div>
      </section>

      {/* Why PM2.5 Matters */}
      <section className="mb-full bg-blue-50 rounded-xl p-8 object-cover">
        <h2 className="text-2xl font-bold text-gray-1000 mb-6 flex items-center">
          <span className="mr-2">📌</span> Why PM2.5 Matters in Kathmandu
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Dominant Pollutant</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Accounts for ~60% of Kathmandu's air pollution</li>
              <li>Peaks during <span className="font-semibold">winter (Dec-Feb)</span></li>
              <li>Causes: Temperature inversion, low wind, biomass burning</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Key Sources</h3>
            <div className="flex flex-wrap gap-2">
              {['🚗 Vehicle exhaust', '🏗️ Construction dust', '🪔 Biomass burning', '🌬️ Regional pollution'].map((source) => (
                <span key={source} className="bg-white px-3 py-1 rounded-full text-sm shadow-sm">
                  {source}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Prediction System */}
      <section className="mb-12 bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔮</span> How We Predict PM2.5
        </h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Our Prediction System</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Temperature', 'Wind speed', 'Rainfall', 'Historical PM2.5'].map((item) => (
              <span key={item} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {item}
              </span>
            ))}
          </div>
          <p>
            Using machine learning (Random Forest model) with accuracy of 
            <span className="font-semibold mx-1">MAE = 4.78</span> and 
            <span className="font-semibold mx-1">R² = 0.91</span>
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-lg mb-2">Safety Labels</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safetyLabels.map((label) => (
              <div 
                key={label.level} 
                className={`${label.color} ${label.textColor} rounded-lg p-4 text-center shadow-md`}
              >
                <div className="font-bold text-xl">{label.level}</div>
                <div className="mt-1">{label.range}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
     
    </div>
  );
};

export default AboutPM25;