import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import moment from 'moment'

import Ticket from './Ticket'
import RedeemedTicket from './RedeemedTicket'

class MyTickets extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            processedData: [],
            selectedRow: -1,
            zoomedIntoRedeemedTicket: false,
        }
        this.renderTickets = this.renderTickets.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.renderTicketList = this.renderTicketList.bind(this)
        this.renderRedeemedDisplay = this.renderRedeemedDisplay.bind(this)
    }
    
    componentWillMount() {
        var processingData = []
        if (this.props.tickets) {
            this.props.tickets.forEach(function(row){
                processingData.push({
                    userPic: row.userPic,
                    redeemed: row.redeemed,
                    ticketId: row.ticketId,
                    ticketSetId: row.ticketSetId,
                    issuer: row.issuer,
                    artist: row.artist,
                    location: row.location,
                    description: row.description,
                    doors: moment(row.doors.toString(10), 'x').format("h:mm:ss a"),
                    startTime: moment(row.startTime.toString(10), 'x').format("h:mm:ss a"),
                    date: moment(row.startTime.toString(10), 'x').format("MMM D YY")
                    // doors: (moment(parseInt(row[6].toString())).toString())
                })
            })
            console.log(processingData)
            this.setState({
                processedData: processingData
            })
        }
    }
    
    handleSelection(row) {
        if (this.state.selectedRow != row && !this.state.zoomedIntoRedeemedTicket) {
            this.props.updateSelection(row)
            this.setState({
                selectedRow: row
            })
        }
        else {
            this.props.updateSelection(-1)
            this.setState({
                selectedRow: -1
            })
        }
    }
    
    renderTickets() {
        var renderedTickets = []
        var selectedRow = this.state.selectedRow
        var that = this
        this.state.processedData.forEach(function(row, index) {
            console.log(row)
            renderedTickets.push(<Ticket {...row} selected={(selectedRow == index) ? true:false} 
                                 key={row.issuer + "-" + index} selectTicket={that.handleSelection} row={index}/>)
        })
        return renderedTickets
    }
    
    renderTicketList() {
        return <div className="ticket-list"><div className="patron-label">Patron</div><div className="ticket-header">My Tickets</div>{this.renderTickets()}</div>
    }
    
    renderRedeemedDisplay() {
        return <div className="redeemed-container">
            <RedeemedTicket {...this.state.processedData[this.state.selectedRow]} 
                            onClick={() => this.setState({selectedRow: -1})} />
            </div>
    }

    render() {
        var renderTickets = this.renderTickets
        var state = this.state
        console.log(state.processedData)
        // const columns=[
        //     { Header: 'Issuer', accessor: 'issuer' },
        //     { Header: 'Artist', accessor: 'artist' },
        //     { Header: 'Location', accessor: 'location' },
        //     { Header: 'Description', accessor: 'description' },
        //     { Header: 'Date/Time', accessor: 'date' },
        //     { Header: 'Doors', accessor: 'doors' }
        // ]
        // return <div>
        //     
        //     <ReactTable style={{height: 500}} data={this.state.processedData} columns={columns}/>
        // </div>
        return <div>{state.selectedRow != -1 ? (state.processedData[state.selectedRow].redeemed ? this.renderRedeemedDisplay() : this.renderTicketList()) : this.renderTicketList()}</div>
    }
    
    
    
}

export default MyTickets