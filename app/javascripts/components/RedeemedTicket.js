import React, { Component } from 'react'
import QRCode from 'qrcode.react'

class RedeemedTicket extends Component {
    
    constructor(props) {
        super(props)
    }
    
    
    render() {
        console.log(this.props)
        return <div className="redeemed-ticket">
            <div className="ticket-date">{this.props.date}</div>
            <div className="ticket-artist">{this.props.artist}</div>
            <div className="ticket-location">{this.props.location}</div>
            <div className="ticket-description">{this.props.description}</div>
            <div className="ticket-startTime">Starts at: <span className="ticket-starttimespan">{this.props.startTime}</span></div>
            <div className="ticket-doors">Doors open at: <span className="ticket-doorstimespan">{this.props.doors}</span></div>
            <div className="ticket-redeemed">"Redeemed - show your photo and QR below"</div>
            <div className="ticket-photo"><img src={this.props.userPic}/></div>
            <div className="ticket-id-qr"><QRCode value={this.props.ticketId}/></div>
        </div>
        
    }
    
    
}

export default RedeemedTicket