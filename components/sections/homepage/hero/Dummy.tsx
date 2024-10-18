import { Component, ReactNode } from 'react';

export default class Calculator extends Component {
  constructor() {
    // @ts-ignore
    super();
    this.state = { color: 'red' };
  }
  render(): ReactNode {
    return (
      // @ts-ignore
      <div style={{ backgroundColor: this.state.color }}>
        <h1>Hello, World!</h1>
      </div>
    );
  }
}
