pragma solidity ^0.4.17;

// This is a contract for securely issuing and redeeming event tickets.
// State is as follows:
// issuers: [{
//	address: String,
//	name: String,
//  website: String,
// }],
// events: [{     array of event records
//	artist: String,
//  location: String,
//  description: String,
//  date: Int,
//  doors: Int,
//	startTime: Int,
//  artistStarts: [{
//		name: String,
//		time: Int,
//  }],
//	ticketSets: [{
//		description: String,
//		price: Double,
//		resalePrice: Double,
//		rows: [ [rowIndex]: numberOfSeats ]
//		sold: [ [rowIndex]: seatNumber ]]
//		sales: [ {
//			rowIndex: String,
//			seatNumber: Number,
//			buyer: String,
//			redeemed: bool,
//			proofOfRedemption: String,
//		}]
//	}]
//  
// }]


contract EventTickets {					// optional functions marked with a *
	// define data structures
	struct Sale {
		address recipient;
		uint eventId;
		uint ticketSetId;
		uint quantity;
		uint[] ticketIds;
	}
	
	struct Issuer {
		string name;
		string website;
		Event[] events;
		bool enabled;
		uint[] eventIds;
	}
	
	struct TicketSet {
		string slug;
		string description;
		uint price;
		uint resalePrice;
		uint numberRemaining;
		mapping(address => Sale[]) sales;
	}
	
	struct Ticket {
		address ticketowner;
		uint eventId;
		uint ticketSetId;
		bool redeemed;
		string userPic;
	}
	
	struct Event {
		string slug;
		address issuer;
		string artist;
		string location;
		string description;
		uint date;
		uint doors;
		uint startTime;
		uint numberOfTicketSets;
		string photoUrl;
		mapping(string => uint) artistStarts;
		mapping(uint => TicketSet) ticketSets;
	}
	
	address public owner = 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1;
	mapping(address => Issuer) issuers;
	mapping(address => uint[]) ticketHolders;
	mapping(uint => Ticket) public tickets;
	mapping(uint => Sale) sales;
	mapping(uint => Event) events;
	
	uint nextSaleId;
	uint nextTicketId;
	uint nextEventId;
	
	
	
	// addIssuer
	function addIssuer(address newIssuer) public {
		require((msg.sender == owner) || (issuers[msg.sender].enabled == true));
		issuers[newIssuer].enabled = true;
	}
	
	// defineEvent
	function defineEvent (string slug, string artist, string location, 
			              string description, uint date, uint doors, 
			              uint startTime, string photoUrl) public returns (uint eventId) {
		require((msg.sender == owner) || (issuers[msg.sender].enabled == true));
		events[nextEventId] = Event({
			slug: slug,
			issuer: msg.sender,
			artist: artist,
			location: location,
			description: description,
			date: date,
			doors: doors,
			startTime: startTime,
			numberOfTicketSets: 0,
			photoUrl: photoUrl
		});
		issuers[msg.sender].eventIds.push(nextEventId);
		nextEventId++;
		return nextEventId-1;
	}
	
	// defineTicketSet
	function defineTicketSet (uint eventId, string ticketSetSlug, string description, uint price, uint resalePrice, 
							  uint quantity) public {
		require((msg.sender == events[eventId].issuer));
		TicketSet memory newSet = TicketSet({
			slug: ticketSetSlug,
			description: description,
			price: price,
			resalePrice: resalePrice,
			numberRemaining: quantity
		});
		
		uint nextSet = events[eventId].numberOfTicketSets;
		events[eventId].ticketSets[nextSet] = newSet;
		events[eventId].numberOfTicketSets++;
		//events[eventSlug].ticketSetSlugs = events[eventSlug].ticketSets[]
		//events[eventSlug].ticketSets[ticketSetSlug] = newSet;
	}
	
	// editEvent*
	
	// sellTicketToRecipient
	function sellTicketsToRecipient (uint eventId, uint ticketSetId, 
									 uint numberOfSeats, address recipient) public {
		require((msg.sender == events[eventId].issuer));				// seller is issuer
		require((checkAvailability(eventId, ticketSetId, numberOfSeats))); // seats are available

		uint[] memory ticketsCreated = new uint[](numberOfSeats);
		
		// create tickets
		for (uint i = 0; i < numberOfSeats; i++) {
			tickets[nextTicketId] = Ticket({
				redeemed: false,
				ticketowner: recipient,
				eventId: eventId,
				ticketSetId: ticketSetId,
				userPic: ""
			});
			ticketHolders[recipient].push(nextTicketId);
			ticketsCreated[i] = nextTicketId;
			nextTicketId++;
		}
		
		Sale memory newSale = Sale({
			recipient: recipient,
			eventId: eventId,
			ticketSetId: ticketSetId,
			quantity: numberOfSeats,
			ticketIds: ticketsCreated	
		});
		
		// decrement available seats
		events[eventId].ticketSets[ticketSetId].numberRemaining = events[eventId].ticketSets[ticketSetId].numberRemaining - numberOfSeats;
		// record sale in sales
		sales[nextSaleId] = newSale;
		// map tickets to recipient
		for (uint g = 0; g < ticketsCreated.length; g++) {
			ticketHolders[recipient].push(ticketsCreated[g]);
		}

		nextSaleId++;

	}
	
	// redeemTicket
	function redeemTicket (uint ticketId, string userPicUrl) public {
		require((msg.sender == tickets[ticketId].ticketowner));
		require((tickets[ticketId].redeemed == false));
		tickets[ticketId].redeemed = true;
		tickets[ticketId].userPic = userPicUrl;
	}
	
	// reassignTicketToNewHolder
	function reassignTicketToNewHolder(uint ticketId, address recipient) public {
		require((tickets[ticketId].redeemed == false));
		require((msg.sender == tickets[ticketId].ticketowner));
		tickets[ticketId].ticketowner = recipient;
		// add ticketId to new owner's array
		ticketHolders[recipient].push(ticketId);
		// remove ticketId from old owner's array
		for (uint i = 0; i < ticketHolders[msg.sender].length; i++ ) {
			if (ticketHolders[msg.sender][i] == ticketId) {
				delete ticketHolders[msg.sender][i];
			}
		}
	}
	
	function getTicketIdsByHolderAddress(address holder) public view returns (uint[] ticketIds) {
		ticketIds = ticketHolders[holder];
	}
	
	function getTicketStateById(uint ticketId) public view returns (string status) {
		if (tickets[ticketId].redeemed == true) {
			status = "redeemed";
		}
		else if (tickets[ticketId].ticketowner == 0) {
			status = "ticket not found";
		}
		else if (tickets[ticketId].redeemed == false) {
			status = "ticket ready for redemption";
		}
		else {
			status = "unknown error";
		}
	}
	
	function getTicketInfoById(uint ticketId) public view returns (address, uint, uint, bool, string) {
		return(tickets[ticketId].ticketowner, tickets[ticketId].eventId, tickets[ticketId].ticketSetId, tickets[ticketId].redeemed, tickets[ticketId].userPic);
	}
	
	function isIssuer() public view returns (bool isthey) {
		if ((issuers[msg.sender].enabled == true) || (msg.sender == owner)) {
					return true;
		}
		else {
			return false;
		}
	}
	
	function getEventIdsForIssuer() public view returns (uint[] issuerEvents) {
		require((issuers[msg.sender].enabled == true || owner == msg.sender));
		issuerEvents = issuers[msg.sender].eventIds;
		
	}
	
	function getEventDetailById(uint id) public view returns (address, string, string, string, uint, uint, string) {
		return (events[id].issuer, events[id].artist, events[id].location, events[id].description, events[id].doors, events[id].startTime, events[id].photoUrl);
	}
	
	function getTicketSetInfoById(uint eventId, uint ticketSetId) public view returns (string, string, uint, uint, uint) {
		return (events[eventId].ticketSets[ticketSetId].slug,
				events[eventId].ticketSets[ticketSetId].description,
				events[eventId].ticketSets[ticketSetId].price,
				events[eventId].ticketSets[ticketSetId].resalePrice,
				events[eventId].ticketSets[ticketSetId].numberRemaining);
	}
	
	function getTicketOwnerById(uint ticketId) public view returns (address ticketOwner) {
		ticketOwner = tickets[ticketId].ticketowner;
	}
	
	function checkAvailability (uint eventId, uint ticketSetId, uint numberOfSeats) public view returns (bool available) {
		available = events[eventId].ticketSets[ticketSetId].numberRemaining >= numberOfSeats;
	}

	function confirmMessageSender() public view returns (address sender) {
		sender = msg.sender;
	}
}
