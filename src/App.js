import logo from './HotButton.png';
import './App.css';
import * as React from 'react';
import axios from 'axios';
import WordCloud from './WordCloud';
import { Radar } from 'react-chartjs-2';

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

const storedTopics = ['abortion', 'ukraine'];
const topicItems = storedTopics.map((topic, i) => (<option value={topic} key={i}>{topic}</option>));
const libraries = {
  'Vader': 'vader',
  'Vader with stopwords': 'vader_stopwords',
  'TextBlob': 'textblob',
  'TextBlob with stopwords': 'textblob_stopwords'
}
const libraryItems = Object.keys(libraries).map((library, i) => (<option value={libraries[library]} key={i}>{library}</option>))

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      presetSelection: 'abortion',
      presetLibrarySelection: 'vader',
      response: undefined,
    };
    this.submitBackendRequest = this.submitBackendRequest.bind(this);
  }

  async submitBackendRequest() {
    await axios.get("http://localhost:9000/data/" + this.state.presetSelection + '/' + this.state.presetLibrarySelection).then(res => {
      this.setState({response: JSON.stringify(res.data)})}).catch((e) => console.log(e));
  }

  render() {
      if(this.state.response) {
        const data = JSON.parse(this.state.response);
      console.log(data);
      const polarities = [data.polarity[0].length, data.polarity[1].length, data.polarity[2].length]
      const allPolarities = data.polarity[0].concat(data.polarity[1]).concat(data.polarity[2]).map(item => Math.abs(item));
      const totalPolarities = polarities.reduce((total, current) => total + current, 0);
      const polarityPercentages = polarities.map(elem => (elem * 100 / totalPolarities));
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
            <div>
            <WordCloud words={data.wordCounter} />
            <div style={{maxHeight: '30rem', alignItems: 'center', display: 'flex'}}>
              <Radar data={polarDataPercentages} />
              <Radar data={polarData} />
            </div>
            </div>
          </div>            
          <button onClick={() => this.setState({response: undefined})}>Clear</button>
          </div>
        )
      } else {
        return (      
        <div className="App">
          <header className="App-header">
            <p style={{'display': 'inline', 'fontWeight': 220, 'fontSize': '5rem'}}>Welcome to <b>Hot</b>Button.</p>
            <div onClick={(e) => this.submitBackendRequest()}>
              <img src={logo} className="App-logo" alt="logo"/>
            </div>
            <p style={{'display': 'inline', 'fontWeight': 300, 'fontSize': '2rem'}}>What are you curious about today?</p>
            <div style={{color: 'white', display: 'contents'}}>
            <p style={{'display': 'inline', 'fontWeight': 300, 'fontSize': '1rem'}}>Select from one of these pre-loaded options to try out:</p>
            <div>
              <select value={this.state.presetSelection.length ? this.state.presetSelection : ""} onChange={(e) => this.setState({presetSelection: e.target.value})}>
                {topicItems}
              </select>
              <select value={this.state.presetLibrarySelection.length ? this.state.presetLibrarySelection : ""} onChange={(e) => this.setState({presetLibrarySelection: e.target.value})}>
                {libraryItems}
              </select>
            </div>
            </div>
          </header>
        </div>)
      }
  }
}

export default App;
