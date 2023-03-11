import React from 'react';
import WordCloud from './WordCloud';
import { Radar, PolarArea } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, PointElement,LineElement,Filler,Tooltip,Legend);

const Details = ({ responseData }) => {

  const data = JSON.parse(responseData);
  console.log(data);
  const polarities = [data.polarity[0].length, data.polarity[1].length, data.polarity[2].length]
  const allPolarities = data.polarity[0].concat(data.polarity[1]).concat(data.polarity[2]).map(item => Math.abs(item));
  const totalPolarities = polarities.reduce((total, current) => total + current, 0);
  const polarityPercentages = polarities.map(elem => (elem * 100 / totalPolarities))
  console.log(polarities)
  const polarDataPercentages = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: '% of Tweets',
        data: polarityPercentages,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };
  const polarData = {
    labels: Array.from({ length: polarities[0] }, () => '')
    .concat(Array.from({ length: polarities[1] }, () => ''))
    .concat(Array.from({ length: polarities[2] }, () => '')),
    datasets: [
      {
        label: 'Intensity of Tweets',
        data: allPolarities,
        backgroundColor: 
        Array.from({ length: polarities[0] }, () => 'rgba(0, 255, 0, 0.9)')
        .concat(Array.from({ length: polarities[1] }, () => 'rgba(0, 0, 255, 0.9)'))
        .concat(Array.from({ length: polarities[2] }, () => 'rgba(255, 0, 0, 0.9)')),
        borderWidth: 1,
      },
    ],
  };
  return (
    <div>
      <div>
      <WordCloud words={data.wordCounter} />
      <div style={{maxHeight: '30rem', alignItems: 'center', display: 'flex'}}>
        <Radar data={polarDataPercentages} />
        <Radar data={polarData} />
      </div>
      </div>
    </div>
  );
};

export default Details;

