import React, { Component } from 'react';
import './App.css';
import './ui-toolkit/css/nm-cx/main.css' //* Need to download these
import axios from 'axios';

const boldStyle = {
  fontWeight: 'bold'
}

const MovieInfo = (props) => {
  if (props.movieFound) {
    return (
      <div id='movieDiv'>
       <p><span style={boldStyle}>Year: </span>{props.movieInfo.year}</p>
       <p><span style={boldStyle}>Director: </span>{props.movieInfo.director}</p>
       <p><span style={boldStyle}>Plot: </span>{props.movieInfo.plot}</p>
      </div>
    );
  } else {return null;}
}

const MovieForm = (props) => {
  return (
    <form onSubmit={props.search}>
      <div className="md-text-field fillFlex">
        <input placeholder="Search for a movie title..." type="text" id="searchBox" onChange={props.setTitle}>{props.currentTitle}</input>
      </div>
      <button disabled={!props.validated} onClick={props.search} id='searchButton' className="button btn-cta small">Search</button>
    </form>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMovie: '',
      movieInfo: {
        year: '',
        director: '',
        plot: ''
      },
      movieFound: false,
      validated: false,
    }
    this.search = this.search.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.validate = this.validate.bind(this);
  }

  search(e) {
    e.preventDefault();

    const promise = axios.get('http://www.omdbapi.com/?apikey=b3427722&t=' + this.state.currentMovie)

    promise.then(({data}) => {
      console.log(data);
      let movieInfo = {
        year: data.Year,
        director: data.Director,
        plot: data.Plot
      }
      this.setState({movieInfo, movieFound: true})
    })

    promise.catch(err =>{
      window.alert("There was an error retrieving movie data.");
      console.log(err);
    })
  }

  setTitle({target}) {
    this.setState({currentMovie: target.value}, function() {
      this.validate();
    });
  }

  validate() {
    if (this.state.currentMovie.trim() !== ''){
      this.setState({validated: true});
    } else {
      this.setState({validated: false});
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Movie Data</h1>
        </header>
        <br />
        <MovieForm search={this.search} setTitle={this.setTitle} currentTitle={this.state.currentTitle} validated={this.state.validated}/>
        <br />
        <MovieInfo movieInfo={this.state.movieInfo} movieFound={this.state.movieFound}/>
      </div>
    );
  }
}

export default App;
