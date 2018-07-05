import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import Event from './Event'

class EventList extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            processedData: [],
            selectedRow: -1
        }
        this.renderEvents = this.renderEvents.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
    }
    
    componentWillMount() {
        var processingData = []
        if (this.props.events) {
            console.log(this.props.events)
            this.props.events.forEach(function(row){
                processingData.push({
                    issuer: row[0],
                    artist: row[1],
                    location: row[2],
                    description: row[3],
                    date: new Date(parseInt(row[5].toString())).toString(),
                    doors: new Date(parseInt(row[4].toString())).toString(),
                    thumbnailUrl: row[6],
                    id: parseInt(row[7]),
                    ticketGroupDesc: row[8][1],
                    ticketGroupPrice: row[8][2].toString(10),
                    ticketResalePrice: row[8][3].toString(10),
                    numberRemaining: row[8][4].toString(10)
                })
            })
            this.setState({
                processedData: processingData
            })
        }
    }
    
    handleSelection(row) {
        if (this.state.selectedRow != row) {
            this.props.updateSelection(row, this.state.processedData[row].id)
            this.setState({
                selectedRow: row
            })
        }
        else {
            this.props.updateSelection(-1, null)
            this.setState({
                selectedRow: -1
            })
        }
    }
    
    renderEvents() {
        var renderedEvents = []
        var selectedRow = this.state.selectedRow
        var that = this
        this.state.processedData.forEach(function(row, index) {
            renderedEvents.push(<Event {...row} selected={(selectedRow == index) ? true:false} 
                                 key={row.issuer + "-" + index} selectEvent={that.handleSelection} row={index}/>)
        })
        return renderedEvents
    }

    render() {
        var renderEvents = this.renderEvents
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
        return <div className="event-list"><div className="issuer-label">Ticket Vendor</div><div className="issuer-header">My Events</div>{this.renderEvents()}</div>
    }
    
    
    
}


export default EventList