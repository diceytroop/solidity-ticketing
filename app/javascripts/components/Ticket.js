import React, { Component } from 'react'

class Ticket extends Component {
    
    constructor(props) {
        super(props)
    }
    
    
    render() {
        console.log(this.props)
        return <div className={this.props.selected ? "ticket-container selected-row":"ticket-container "} 
                onClick={(e) => this.props.selectTicket(this.props.row)}>
            <div className="ticket-date">{this.props.date}</div>
            <div className="ticket-artist">{this.props.artist}</div>
            <div className="ticket-location">{this.props.location}</div>
            <div className="ticket-description">{this.props.description}</div>
            <div className="ticket-startTime">Starts at: <span className="ticket-starttimespan">{this.props.startTime}</span></div>
            <div className="ticket-doors">Doors open at: <span className="ticket-doorstimespan">{this.props.doors}</span></div>
            <div className="ticket-redeemed">{this.props.redeemed ? "Redeemed" : "Waiting for Redemption"}</div>
        </div>
        
    }
    
    
}

export default Ticket