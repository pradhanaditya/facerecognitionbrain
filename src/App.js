import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Register from './components/Register/Register.js';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

// initialize with our api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
 apiKey: 'cf93921d04464628a4081e4659590a85'
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }
  
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
      this.setState({box: box});
  }

  onInputChange = (event) => {
      this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
   this.setState({imageUrl: this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (input) => {
      if (input === 'signout')
      {
        this.setState({isSignedIn: false});
      }
      else if (input === 'home') {
        this.setState({isSignedIn: true});  
      }
    this.setState({route: input});
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles"
              params={particlesOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
    { this.state.route === 'home' ?
        <div>
          <Logo /> 
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div> : (
          this.state.route === 'signin' ? <Signin onRouteChange={this.onRouteChange}/> : <Register onRouteChange={this.onRouteChange}/>
        )
        }
        </div>
    );
  }
}

export default App;
