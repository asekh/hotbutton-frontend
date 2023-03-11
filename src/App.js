import logo from './HotButton.png';
import './App.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Details from './DetailsPage.js'

const API_KEY_ERROR = 'No API Key provided.';
const SEARCH_TERM_ERROR = 'No search term provided.';
const storedTopics = ['abortion', 'ukraine']// ['abortion', 'hindutva', 'ukraine'];
const topicItems = storedTopics.map((topic, i) => (<MenuItem value={topic} key={i}>{topic}</MenuItem>));
const libraries = {
  'Vader': 'vader',
  'Vader minus stopwords': 'vader_stopwords',
  'TextBlob': 'textblob',
  'TextBlob minus stopwords': 'textblob_stopwords'
}
const libraryItems = Object.keys(libraries).map((library, i) => (<MenuItem value={libraries[library]} key={i}>{library}</MenuItem>))


class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      searchTerm: '',
      twitterAPIKey: '',
      presetSelection: '',
      presetLibrarySelection: '',
      errorText: [],
      response: undefined,
    };
    this.validateInput = this.validateInput.bind(this);
    this.submitBackendRequest = this.submitBackendRequest.bind(this);
  }

  validateInput() {
    console.log("Validate input called");
    const errors = [];
    if(this.state.presetSelection.length && this.state.presetLibrarySelection.length) {
      return true;
    }
    if(!this.state.presetSelection.length) {
      errors.push(SEARCH_TERM_ERROR);
    }
    if(!this.state.presetLibrarySelection.length) {
      errors.push(SEARCH_TERM_ERROR);
    }
    if(!this.state.twitterAPIKey.length) {
      errors.push(API_KEY_ERROR);
    }
    if(!this.state.searchTerm.length) {
      errors.push(SEARCH_TERM_ERROR);
    }
    this.setState({errorText: errors});
    return errors.length;
  }

  async submitBackendRequest() {
    if(!this.validateInput()) return;
    await axios.get("http://localhost:9000/data/" + this.state.presetSelection + '/' + this.state.presetLibrarySelection).then(res => {
      console.log(JSON.stringify(res.data));
      this.setState({response: JSON.stringify(res.data)})}).catch((e) => console.log(e));
  }

  render() {
    console.log(this.state.errorText);
      if(this.state.response) {
        console.log(this.state.response);
        return (
          <div>
            <Details responseData={this.state.response}></Details>
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
            <div style={{'display': 'inline-block'}}>
              <Select
                value={this.state.presetSelection}
                inputProps={{style: {width: '15rem', minWidth: '15rem'}}}
                autoWidth
                label="Select a pre-loaded term"
                style={{backgroundColor: 'white', minWidth: '15rem'}}
                sx={{backgroundColor: 'white',  minWidth: '15rem' }}
                onChange={(e)=> this.setState({presetSelection: e.target.value})}>
                {topicItems}
              </Select>
              <div style={{'padding': '1rem'}}></div>
              <Select
                value={this.state.presetLibrarySelection}
                inputProps={{style: {width: '15rem', minWidth: '15rem', color: 'white'}}}
                autoWidth
                label="Select a pre-loaded library"
                style={{backgroundColor: 'white', minWidth: '15rem'}}
                sx={{backgroundColor: 'white',  minWidth: '15rem' }}
                onChange={(e)=> this.setState({presetLibrarySelection: e.target.value})}>
                {libraryItems}
              </Select>
            </div>

              <p style={{'display': 'inline', 'fontWeight': 0, 'fontSize': '1rem'}}>Or, if you have a Twitter API key,</p>
              <div style={{margin: '1rem'}}>
                <TextField 
                  value={this.state.searchTerm}
                  onChange={(e) => this.setState({searchTerm: e.target.value})}
                  error={(this.state.errorText.includes(SEARCH_TERM_ERROR))}
                  variant="outlined"
                  label="Enter search term"
                  style={{color: 'white'}}
                  inputProps={{style: {color: 'white'}}}>
                </TextField>
              </div>
              <div style={{margin: '1rem'}}>
                <TextField 
                  value={this.state.twitterAPIKey} 
                  onChange={(e) => this.setState({twitterAPIKey: e.target.value})}
                  error={(this.state.errorText.includes(API_KEY_ERROR))}
                  variant="outlined"
                  label="Enter Twitter API Key"
                  style={{color: 'white'}}
                  inputProps={{style: {color: 'white'}}}>
                </TextField>
              </div>
            </div>
          </header>
        </div>)
      }
  }
}

export default App;
