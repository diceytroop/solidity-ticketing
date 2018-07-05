import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import TimePicker from 'react-times'
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-times/css/classic/default.css';

class EventAdder extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            artist: "",
            location: "",
            description: "",
            numberOfTickets: 0,
            ticketPrice: 0,
            resalePrice: 0,
            date: undefined,
            startTime: "",
            doors: "",
            startTime: "",
            thumbnailUrl: ""
        }
        this.handleArtistChange = this.handleArtistChange.bind(this)
        this.handleLocationChange = this.handleLocationChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
        this.handleNumberOfTicketsChange = this.handleNumberOfTicketsChange.bind(this)
        this.handleTicketPriceChange = this.handleTicketPriceChange.bind(this)
        this.handleResalePriceChange = this.handleResalePriceChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleTimeChange = this.handleTimeChange.bind(this)
        this.handleDoorsChange = this.handleDoorsChange.bind(this)
        this.handleThumbnailUrlChange = this.handleThumbnailUrlChange.bind(this)
    }
    
    handleArtistChange(event) {
        this.setState({artist: event.target.value})
    }
    
    handleLocationChange(event) {
        this.setState({location: event.target.value})
    }
    
    handleDescriptionChange(event) {
        this.setState({description: event.target.value})
    }
    
    handleNumberOfTicketsChange(event) {
        this.setState({numberOfTickets: event.target.value})
    }
    
    handleTicketPriceChange(event) {
        this.setState({ticketPrice: event.target.value})
    }
    
    handleResalePriceChange(event) {
        this.setState({resalePrice: event.target.value})
    }
    
    handleSubmit(event) {
        var info = Object.assign({}, this.state, {})
        this.props.handleAddEvent(info)
    }
    
    handleDateChange(date) {
        this.setState({date})
    }
    
    handleTimeChange(time) {
        this.setState({startTime: time})
    }
    
    handleDoorsChange(doors) {
        this.setState({doors})
    }
    
    handleThumbnailUrlChange(event) {
        this.setState({thumbnailUrl: event.target.value})
    }
    
    render() {
        return <div className="event-adder">
            <form onSubmit={this.handleSubmit}>
            <label>
                Artist<input type="text" value={this.state.artist} onChange={this.handleArtistChange}/>
            </label>
            <label>
                Thumbnail URL<input type="text" value={this.state.thumbnailUrl} onChange={this.handleThumbnailUrlChange}/>
            </label>
            <label>
                Location <input type="text" value={this.state.location} onChange={this.handleLocationChange}/>
            </label>
            <label>
                Description <input type="text" value={this.state.description} onChange={this.handleDescriptionChange}/>
            </label>
            <label>
                # of Tickets<input type="number" value={this.state.numberOfTickets} onChange={this.handleNumberOfTicketsChange}/>
            </label>
            <label>
               Ticket Price<input type="number" value={this.state.ticketPrice} onChange={this.handleTicketPriceChange}/>
            </label>
            <label>
                Date <DatePicker selected={this.state.date} onChange={this.handleDateChange} />
            </label>
            <label>
                Time <TimePicker time={this.state.startTime} theme="classic" onTimeChange={this.handleTimeChange} />
            </label>
            <label>
                Doors <TimePicker time={this.state.doors} theme="classic" onTimeChange={this.handleDoorsChange} />
            </label>
            <input type="submit" value="submit"/>
        </form>
        </div>
    }
    
    
    
}

export default EventAdder