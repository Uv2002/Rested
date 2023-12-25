import React, { useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

const MetricesView = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [tablemetricsData, settableMetricsData] = useState(null);
  const [chartInstance, setChartInstance] = useState(null); // chart instance for dish metrice
  const [tablechartInstance, tablesetChartInstance] = useState(null); // chart instance for table metrices
  
  

  const fetchData = async () => {
    try {
      const response = await fetch('api/dish/getCount');
      if (response.ok) {
        const data = await response.json();
        setMetricsData(data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const tablefetchData = async () => {
    try {
      const response = await fetch('api/tables/getCount');
      if (response.ok) {
        const data = await response.json();
        settableMetricsData(data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    tablefetchData();
  }, []);

  useEffect(() => {
    if (metricsData) {
      const ctx = document.getElementById('myChart').getContext('2d');

      // Destroy the existing chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create a new Chart instance
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: metricsData.map(item => item.name),
          datasets: [
            {
              label: 'Dish Count',
              data: metricsData.map(item => item.dishCount),
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      

      // Save the new chart instance
      setChartInstance(newChartInstance);
      
    }
  }, [metricsData]);

  useEffect(() => {
    if (tablemetricsData) {
      const cty = document.getElementById('tableChart').getContext('2d');

      // Destroy the existing chart instance if it exists
      if (tablechartInstance) {
        tablechartInstance.destroy();
      }

      // Create a new Chart instance
      const newtableChartInstance = new Chart(cty, {
        type: 'bar',
        data: {
          labels: tablemetricsData.map(item => item.title),
          datasets: [
            {
              label: 'Number Of time Assigned',
              data: tablemetricsData.map(item => item.totalAssignedTimes),
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      

      // Save the new chart instance
      tablesetChartInstance(newtableChartInstance);
      
    }
  }, [tablemetricsData]);

  return (
    <div>
       <div class="w3-container">
        <div class="w3-row">
            <div class="w3-half"><div class="" style={{
        height:'100vh',
        width:'100vh',
        overflow:'hidden',
        
        backgroundColor:'black'
      }}>
      <canvas id="myChart" width="100%" height="100%"></canvas>
      </div></div>
          <div class="w3-half"><div class="" style={{
        height:'100vh',
        width:'100vh',
        overflow:'hidden',
    
        backgroundColor:'black'
      }}>
      <canvas id="tableChart" width="100%" height="100%"></canvas>
      </div></div>

        </div>
    </div>

</div>
    
  );
};

export default MetricesView;
