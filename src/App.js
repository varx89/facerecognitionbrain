import React from 'react';
import { Component } from 'react';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Particle from './components/Particle/Particle';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  box: '',
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = JSON.parse(data, null, 2).outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace);
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onEnter = (event) => {
    if (event.key === 'Enter') {
      this.onButtonSubmit();
      console.log('working')
    }
  }

  onButtonSubmit = () => {
    // this.setState({imageUrl: this.state.input});
  
    fetch('https://rocky-bayou-01851.herokuapp.com//imageurl', {
           method: 'post',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({
            input: this.state.input,
           })
        })
    .then(response => response.text())
    .then(response => {
      if (response) {
        fetch('https://rocky-bayou-01851.herokuapp.com//image', {
           method: 'put',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({
            id: this.state.user.id,
           })
        })
        .then(response => response.json())
        // .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}));
        })
        .catch(console.log);
        this.displayFaceBox(this.calculateFaceLocation(response));
      }  
    })
    // .then(response => response.text())
    // // .then(result => console.log(JSON.parse(result, 2 , null)))
    // .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
    .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedIn, route, box} = this.state;
    return (
      <div className="App">
      <Particle />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
      {route === 'home' 
      ? <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm onEnter={this.onEnter} onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition box={box} imageUrl={this.state.input}/>
        </div>
        : (route === 'signin') 
        ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      }
      </div>
    );
  }
  
}

export default App;
