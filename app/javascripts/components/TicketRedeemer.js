import React, { Component } from 'react'

class TicketRedeemer extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            photoUrl: "",
            redeemed: false,
        }
        this.handlePhotoUrlChange = this.handlePhotoUrlChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handlePhotoUrlChange(event) {
        this.setState({photoUrl: event.target.value})
    }
    
    handleSubmit() {
        this.props.redeemTicket(this.props.ticketId, this.state.photoUrl)
    }
    
    render() {
        return <div>
            <span>Redeem Ticket</span>
            <form onSubmit={this.handleSubmit}>
            <label>
                Take a Photo <input type="text" value={this.state.photoUrl} onChange={this.handlePhotoUrlChange}/>
            </label>
            <input type="submit" value="submit"/>
            </form>
        </div>
    }
}

export default TicketRedeemer;