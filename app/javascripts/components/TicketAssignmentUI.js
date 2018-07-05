import React, { Component } from 'react'

class TicketAssignmentUI extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            recipient: '',
            number: 0
        }
        this.handleRChange = this.handleRChange.bind(this)
        this.handleNChange = this.handleNChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleRChange(event) {
        this.setState({recipient: event.target.value})
    }
    
    handleNChange(event) {
        this.setState({number: event.target.value})
    }
    
    handleSubmit(event) {
        this.props.sendTicket(this.state.number, this.state.recipient)
    }
    
    render() {
        return <form onSubmit={this.handleSubmit}>
            <label>
                Send ticket to: <input type="text" value={this.state.recipient} onChange={this.handleRChange}/>
            </label>
            <label>
                Number to send: <input type="text" value={this.state.number} onChange={this.handleNChange}/>
            </label>
            <input type="submit" value="submit"/>
        </form>
    }
    
    
    
}

export default TicketAssignmentUI