// Add this to your existing script.js file
function setupTicketTracking() {
    const trackForm = document.getElementById('track-form');
    const ticketResults = document.getElementById('ticket-results');
    
    if (trackForm) {
        trackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('track-email').value.trim();
            const ticketId = document.getElementById('track-ticket-id').value.trim();
            
            if (!email) {
                showError("Please enter your email address");
                return;
            }
            
            const tickets = JSON.parse(localStorage.getItem('tickets') || [];
            let filteredTickets = tickets.filter(ticket => 
                ticket.email.toLowerCase() === email.toLowerCase()
            );
            
            if (ticketId) {
                filteredTickets = filteredTickets.filter(ticket => 
                    ticket.id.toLowerCase() === ticketId.toLowerCase()
                );
            }
            
            displayTicketResults(filteredTickets);
        });
    }
}

function displayTicketResults(tickets) {
    const resultsContainer = document.getElementById('ticket-results');
    resultsContainer.innerHTML = '';
    
    if (!tickets || tickets.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                No tickets found matching your criteria.
            </div>
        `;
        return;
    }
    
    const html = tickets.map(ticket => `
        <div class="card ticket-card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <h5 class="card-title">${ticket.subject}</h5>
                    <span class="badge ${getStatusBadgeClass(ticket.status)}">
                        ${ticket.status}
                    </span>
                </div>
                <h6 class="card-subtitle mb-2 text-muted">
                    Ticket ID: ${ticket.id}
                </h6>
                <p class="card-text">${ticket.description}</p>
                <div class="ticket-meta">
                    <small class="text-muted">
                        <strong>Submitted:</strong> ${new Date(ticket.createdAt).toLocaleString()}
                    </small>
                    <small class="text-muted">
                        <strong>Priority:</strong> ${ticket.priority}
                    </small>
                    <small class="text-muted">
                        <strong>Department:</strong> ${ticket.department}
                    </small>
                </div>
            </div>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = html;
}

function getStatusBadgeClass(status) {
    const statusClasses = {
        'open': 'bg-primary',
        'pending': 'bg-warning text-dark',
        'resolved': 'bg-success',
        'closed': 'bg-secondary'
    };
    return statusClasses[status.toLowerCase()] || 'bg-info';
}

function showError(message) {
    const resultsContainer = document.getElementById('ticket-results');
    resultsContainer.innerHTML = `
        <div class="alert alert-danger">
            ${message}
        </div>
    `;
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setupTicketTracking();
    // Your other initialization code...
});
