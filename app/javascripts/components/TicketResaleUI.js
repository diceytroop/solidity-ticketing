import React, { Component } from 'react'

class TicketAssignmentUI extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
    }
    
    handleChange(event) {
        this.setState({value: event.target.value})
    }
    
    handleSubmit(event) {
        this.props.sendTicket(this.state.value)
    }
    
    render() {
        return <form onSubmit={this.handleSubmit}>
            <label>
                Send ticket to: <input type="text" value={this.state.value} onChange={this.handleChange}/>
            </label>
            <input type="submit" value="submit"/>
        </form>
    }
    
    
    
}

export default TicketAssignmentUI