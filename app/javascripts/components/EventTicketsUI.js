import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import Async from 'async'

import EventList from './EventList'
import TicketAssignmentUI from './TicketAssignmentUI'
import EventAdder from './EventAdder'
import TicketRedeemer from './TicketRedeemer'
import TicketResaleUI from './TicketResaleUI'
import MyTickets from './MyTickets'

import moment from 'moment'

import 'react-dropdown/style.css'

class EventTicketsUI extends Component {
    
    constructor(props) {
        super(props)
        this.styles = {
        }
        this.state = {
            currentAccountId: 0,
            currentAccount: undefined,
            isIssuer: undefined,
            issuerEvents: [],
            currentEvent: undefined,
            myTickets: undefined,
            selectedRow: -1,
            showInputs: false,
            selectedInput: undefined,
            ticketsOwned: [],
            statusMessage: "",
            ticketSetsByEventId: {}
        }
        this.switchAccount = this.switchAccount.bind(this)
        this.w3 = this.props.w3
        this.EventTickets = this.props.abi
        this.isIssuer = this.isIssuer.bind(this)
        this.renderIssuerUI = this.renderIssuerUI.bind(this);
        this.renderUserUI = this.renderUserUI.bind(this);
        this.getEventsForIssuer = this.getEventsForIssuer.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.updateSelection = this.updateSelection.bind(this);
        this.handleAddEvent = this.handleAddEvent.bind(this);
        this.handleTicketSend = this.handleTicketSend.bind(this);
        this.handleTicketResale = this.handleTicketResale.bind(this);
        this.redeemTicket = this.redeemTicket.bind(this);
    }   
    
    isIssuer(account = this.state.currentAccount, next) {
        this.EventTickets.deployed().then(function(instance){
            instance.isIssuer({from: account}).then(function(res) 
            {   
                next(res)
            })
        })
    }
    
    getEventsForIssuer(account = this.state.currentAccount, next) {
        var allEvents = [];
        var that = this
        this.EventTickets.deployed().then(function(instance){
            instance.getEventIdsForIssuer({from: account}).then(function(res) {
                window.EventTickets = that.EventTickets;
                console.log(res.toString)
                Async.eachOfSeries(res, function(id, key, callback) { 
                        that.EventTickets.deployed().then(function(instance) {
                            instance.getEventDetailById(id.toString(10), {from: account}).then(function(details) {
                                that.EventTickets.deployed().then(function(instance) {
                                    instance.getTicketSetInfoById(id.toString(10), 0).then(function(ticketSet) {
                                        
                                        details.push(id)
                                        details.push(ticketSet)
                                        allEvents.push(details)
                                        callback()
                                    })
                                })
                            })
                        })}, 
                function(err) { if(err){console.log(err.message)} next(allEvents) })
            })
        })
    }
    
    getTicketsForAddress(account = this.state.currentAccount, next) {
        var allTickets = []
        var that = this
        this.EventTickets.deployed().then(function(instance) {
            instance.getTicketIdsByHolderAddress(account, {from: account}).then(function(res) {
                window.EventTickets = that.EventTickets;
                Async.eachOfSeries(res, function(id, key, callback) {
                    that.EventTickets.deployed().then(function(instance) {
                        instance.getTicketInfoById(id.toString(10), {from: account}).then(function(ticketInfo) {
                            instance.getEventDetailById(ticketInfo[1].toString(10)).then(function(eventInfo) {
                              
                              allTickets.push({
                                ticketId: id.toString(10),
                                ticketowner: ticketInfo[0],
                                eventId: ticketInfo[1].toString(10),
                                ticketSetId: ticketInfo[2].toString(10),
                                redeemed: ticketInfo[3],
                                userPic: ticketInfo[4],
                                issuer: eventInfo[0].toString(10),
                                artist: eventInfo[1].toString(10),
                                location: eventInfo[2],
                                description: eventInfo[3],
                                doors:  eventInfo[4],
                                startTime: eventInfo[5],
                                numberOfSeats: eventInfo[6]
                            })
                            callback()  
                            })
                            
                        })
                    })
                }, function(err) { if(err){console.log(err.message)} else {
                    next(allTickets)
                }})
            })
        })
    }
    
    addEvent(account = this.state.currentAccount, eventInfo) {
        console.log(eventInfo.date,eventInfo.doors, eventInfo.startTime)
        var [ doorHour, doorMinute ] = eventInfo.doors.split(':')
        var [ startHour, startMinute ] = eventInfo.startTime.split(':')
        console.log(doorHour, doorMinute, startHour, startMinute)
        var doors = new moment(eventInfo.date).hour(doorHour)
        doors = doors.minute(doorMinute)
        var startTime = new moment(eventInfo.date).hour(startHour)
        startTime = startTime.minute(startMinute)
                console.log(doors, startTime)
        var that = this
        this.EventTickets.deployed().then(function(instance) {
            console.log('ready to submit event')
            instance.defineEvent("slug", eventInfo.artist, eventInfo.location, 
			              eventInfo.description, parseInt(eventInfo.date.valueOf()), 
			             parseInt(doors.valueOf), parseInt(startTime.valueOf), 
			              eventInfo.thumbnailUrl, {from: account}).then(function(res) {
			                  console.log('submitted event, creating ticket range')
			                  var description = (eventInfo.description ? eventInfo.description : "General Admission")
			                  this.EventTickets.deployed().then(function(instance) {
			                      instance.defineTicketSet(res.toString(10), "slug", description, eventInfo.ticketPrice, eventInfo.resalePrice, eventInfo.numberOfTickets, eventInfo.thumbnailUrl, {from: account, gas:1000000}).then(function(res) {
			                    //this.switchAccount(account)
			                  })
			                  })
			              })
			             
        })
    }
    
    handleAddEvent(eventInfo) {
        this.addEvent(this.state.currentAccount, eventInfo)
    }
    
    // instance.sellTicketsToRecipient (eventId, ticketSetId, numberOfSeats, recipientAddress)
    handleTicketSend(numberOfTickets, recipientAddress) {
        var that = this;
        console.log(that.state.currentEvent, 0, numberOfTickets, recipientAddress)
        this.EventTickets.deployed().then(function(instance) {
            instance.sellTicketsToRecipient(that.state.currentEvent, 0, numberOfTickets, 
            recipientAddress, {from: that.state.currentAccount}).then(function(res) {
                that.getEventsForIssuer(that.props.currentAddress, function(events) {
                    console.log(events)
                    that.setState({
                        issuerEvents: events,
                        showInputs: false,
                        selectedInput: undefined
                        
                    })
                })
            })
        })
    }
    
    getFirstTicketSetForEventById(eventId, callback) {
        this.EventTickets.deployed().then(function(instance) {
            instance.getTicketSetInfoById(eventId, 0).then(function(res) {
                [slug, description, price, resalePrice, numberRemaining] = res;
                var ticketSetsByEventId = Object.assign({}, this.state.ticketSetsByEventId, {
                        [eventId]: {
                            slug,
                            description,
                            price,
                            resalePrice,
                            numberRemaining
                        }
                })
                this.setState({ ticketSetsByEventId })
                })
            })
    }
    
    redeemTicket(ticketId, photoUrl) {
        var that = this
        this.EventTickets.deployed().then(function(instance) {
            console.log(parseInt(ticketId), photoUrl, that.state.currentAccount)
            instance.redeemTicket(parseInt(ticketId), photoUrl, {from:that.state.currentAccount}).then(function(res) {
                that.getTicketsForAddress(that.state.currentAccount, function(tickets) {
                    console.log(tickets)
                    outside.setState({
                        ticketsOwned: tickets
                    })
                })
            })
        })
    }
    
    handleTicketResale() {
        
    }
    
    componentWillMount() {
        this.EventTickets.setProvider(this.w3.currentProvider);
        this.setState({
            currentAccountId: 0,
            currentAccount: this.props.accounts[0],
            isIssuer: true
        })
    }
    
    componentDidMount() {
        
    }
    
    switchAccount(address) {
        console.log(address)
        var outside = this
        var accountIndex = this.props.accounts.indexOf(address.value)
        this.props.w3.eth.accounts[accountIndex]
        this.isIssuer(address.value, function(res) {
            var that = this
            if (res === true) {
                outside.getEventsForIssuer(address.value, function(events) {
                    console.log(events)
                    outside.setState({
                        currentAccountId: accountIndex,
                        currentAccount: address.value,
                        isIssuer: true,
                        issuerEvents: events,
                        showInputs: false,
                        selectedInput: undefined
                        
                    })
                })

            } else {
                outside.getTicketsForAddress(address.value, function(tickets) {
                    console.log(tickets)
                    outside.setState({
                        currentAccountId: accountIndex,
                        currentAccount: address.value,
                        isIssuer: res,
                        ticketsOwned: tickets
                })
                })
            }
        })
        
    }
    
    updateSelection(row, id) {
        this.setState({
            selectedRow: row,
            showInputs: false,
            currentEvent: id
        })
    }
    
    renderIssuerUI() {
        console.log()
        if(this.state.showInputs === true && this.state.selectedInput === "addEvent") {
            return <EventAdder addEvent={this.handleEventAdd} handleAddEvent={this.handleAddEvent}/>
        } else {
            return <EventList events={this.state.issuerEvents} addEvent={this.addEvent} updateSelection={this.updateSelection}/>
        }
        
    }
    
    renderUserUI() {
        if(this.state.showInputs === true && this.state.selectedInput === "redeemTicket") {
            return <TicketRedeemer redeemTicket={this.redeemTicket}/>
        } else {
            return <MyTickets tickets={this.state.ticketsOwned} updateSelection={this.updateSelection} />
        }
        
    }

    
    renderIssuerButtons() {
        return <div><button onClick={(e)=>this.setInputSelection('addEvent')}>Create Event</button>
                <button onClick={(e) => this.setInputSelection('assignTicket')} disabled={this.state.selectedRow > -1? false:true}>Distribute Ticket</button></div>
    }
    
    renderUserButtons() {
        return <div><button onClick={(e)=>this.setInputSelection('redeemTicket')} disabled={this.state.selectedRow > -1? false:true}>Redeem Ticket</button>
                <button onClick={(e) => this.setInputSelection('sellTicket')} disabled={this.state.selectedRow > -1? false:true}>Sell Ticket</button></div>
    }
    
    renderInputFields() {
        switch (this.state.selectedInput) {
            case "assignTicket":
                return <TicketAssignmentUI sendTicket={this.handleTicketSend}/>
            case "sellTicket":
                return <TicketResaleUI sellTicket={this.handleTicketResale}/>
            default:
                return
        }
    }
    
    setInputSelection(input) {
        this.setState({
            showInputs: input ? true:false,
            selectedInput: input
        })
    }
    
    render() {
        
        return <div>
                <Dropdown className="dropdown" options={this.props.accounts} onChange={this.switchAccount} placeholder={this.props.accounts[this.state.currentAccountId]}/>
                <div className="ui-container">{ this.state.isIssuer ? this.renderIssuerUI() : this.renderUserUI() }</div>
                <div className="bottom-buttons">{this.state.isIssuer? this.renderIssuerButtons() : this.renderUserButtons()}</div>
                {this.state.showInputs? this.renderInputFields() : ""}
            </div>
        
    }
    
    
    
}

export default EventTicketsUI