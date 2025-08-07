document.addEventListener('DOMContentLoaded', function() {
    // Initialize ticket data if not exists
    if (!localStorage.getItem('tickets')) {
        localStorage.setItem('tickets', JSON.stringify([]));
    }

    // Tab switching functionality
    const tabs = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.ticket-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.id.replace('-tab', '-section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById(targetId).style.display = 'block';
        });
    });

    // Ticket submission
    const ticketForm = document.getElementById('ticket-form');
    if (ticketForm) {
        ticketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const ticketId = 'TKT-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
            
            const ticketData = {
                id: ticketId,
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                department: document.getElementById('department').value,
                priority: document.getElementById('priority').value,
                description: document.getElementById('description').value,
                status: 'open',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            let tickets = JSON.parse(localStorage.getItem('tickets'));
            tickets.push(ticketData);
            localStorage.setItem('tickets', JSON.stringify(tickets));
            
            document.getElementById('ticket-id').textContent = ticketId;
            document.getElementById('ticket-confirmation').style.display = 'block';
            ticketForm.reset();
        });
    }

    // Track tickets functionality
    const trackForm = document.getElementById('track-form');
    if (trackForm) {
        trackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('track-email').value.trim().toLowerCase();
            const ticketId = document.getElementById('track-ticket-id').value.trim().toUpperCase();
            
            if (!email) {
                displayResults('Please enter your email address', 'error');
                return;
            }
            
            try {
                const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
                let filteredTickets = tickets.filter(ticket => 
                    ticket.email.toLowerCase() === email
                );
                
                if (ticketId) {
                    filteredTickets = filteredTickets.filter(ticket => 
                        ticket.id.toUpperCase() === ticketId
                    );
                }
                
                if (filteredTickets.length === 0) {
                    displayResults('No tickets found matching your criteria', 'info');
                } else {
                    displayTicketResults(filteredTickets);
                }
            } catch (error) {
                console.error('Error retrieving tickets:', error);
                displayResults('Error retrieving tickets. Please try again.', 'error');
            }
        });
    }

    function displayTicketResults(tickets) {
        const resultsContainer = document.getElementById('ticket-results');
        resultsContainer.innerHTML = '';
        
        tickets.forEach(ticket => {
            const ticketElement = document.createElement('div');
            ticketElement.className = 'card ticket-card mb-3';
            ticketElement.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${ticket.subject}</h5>
                        <span class="badge ${getStatusClass(ticket.status)}">${ticket.status}</span>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">Ticket ID: ${ticket.id}</h6>
                    <p class="card-text">${ticket.description}</p>
                    <div class="d-flex justify-content-between">
                        <small class="text-muted">Submitted: ${new Date(ticket.createdAt).toLocaleString()}</small>
                        <small class="text-muted">Priority: ${ticket.priority}</small>
                        <small class="text-muted">Department: ${ticket.department}</small>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(ticketElement);
        });
    }

    function displayResults(message, type) {
        const resultsContainer = document.getElementById('ticket-results');
        resultsContainer.innerHTML = `
            <div class="alert alert-${type}">
                ${message}
            </div>
        `;
    }

    function getStatusClass(status) {
        const statusMap = {
            'open': 'bg-primary',
            'pending': 'bg-warning text-dark',
            'resolved': 'bg-success',
            'closed': 'bg-secondary'
        };
        return statusMap[status.toLowerCase()] || 'bg-info';
    }
});
