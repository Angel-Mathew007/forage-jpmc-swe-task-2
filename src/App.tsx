import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
    data: any[],
    showGraph: boolean
}


/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
constructor(props: IProps) {
    super(props);
    this.state = {
        data: [],
        showGraph: false
    };
}

  /**
   * Render Graph react component with state.data parse as property data
   */
renderGraph() {
    if (this.state.showGraph) {
        return (<Graph data={this.state.data} />);
    }
    return null;
}


  /**
   * Get new data from server and update the state with the new data
   */
getDataFromServer() {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.setState((prevState) => ({
            data: [...prevState.data, ...data].filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t.stock === item.stock && t.timestamp === item.timestamp
                ))
            ),
            showGraph: true
        }));
    };

    setInterval(() => {
        ws.send('get_data');
    }, 1000);
}


  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
