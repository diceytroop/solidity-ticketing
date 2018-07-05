import React, { Component } from 'react'

class Event extends Component {
    
    constructor(props) {
        super(props)
    }
    
    
    render() {
        console.log(this.props)
        return <div className={this.props.selected ? "event-container selected-row":"event-container "} 
                onClick={(e) => this.props.selectEvent(this.props.row)}>
            <div className="event-artist">{this.props.artist}</div>
            <div className="event-thumbnail"><img src={this.props.thumbnailUrl}/></div>
            <div className="event-location">{this.props.location}</div>
            <div className="event-description">{this.props.description}</div>
            <div className="event-ticketsAvailable">Unsold: {this.props.numberRemaining}</div>
            <div className="event-ticketPrice">Retail Price: {this.props.ticketGroupPrice}</div>
            <div className="event-ticketResalePrice">Resale Price: {this.props.ticketResalePrice}</div>
        </div>
        
    }
    
    
}

export default Event

//            <div className="event-image">{this.props.image}</div>