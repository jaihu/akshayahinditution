document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.ticket-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
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
            
            // Generate random ticket ID
            const ticketId = 'T-' + Math.floor(100000 + Math.random() * 900000);
            
            // Show confirmation
            document.getElementById('ticket-id').textContent = ticketId;
            document.getElementById('ticket-confirmation').style.display = 'block';
            
            // In a real app, you would send this data to your backend
            const ticketData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                department: document.getElementById('department').value,
                priority: document.getElementById('priority').value,
                description: document.getElementById('description').value,
                status: 'open',
                createdAt: new Date().toISOString(),
                id: ticketId
            };
            
            // Store in localStorage for demo purposes
            let tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
            tickets.push(ticketData);
            localStorage.setItem('tickets', JSON.stringify(tickets));
            
            // Reset form
            ticketForm.reset();
            
            // Scroll to confirmation
            document.getElementById('ticket-confirmation').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Track tickets form
    const trackForm = document.getElementById('track-form');
    if (trackForm) {
        trackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('track-email').value;
            const ticketId = document.getElementById('track-ticket-id').value;
            
            let tickets = JSON.parse(localStorage.getItem('tickets') || [];
            
            // Filter tickets by email and optionally by ticket ID
            let filteredTickets = tickets.filter(ticket => ticket.email === email);
            if (ticketId) {
                filteredTickets = filteredTickets.filter(ticket => ticket.id === ticketId);
            }
            
            displayTicketResults(filteredTickets);
        });
    }
});

function displayTicketResults(tickets) {
    const resultsContainer = document.getElementById('ticket-results');
    
    if (tickets.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                No tickets found matching your criteria.
            </div>
        `;
        return;
    }
    
    let html = '<h3>Your Tickets</h3>';
    
    tickets.forEach(ticket => {
        const priorityClass = ticket.priority === 'high' ? 'high-priority' : 
                            ticket.priority === 'critical' ? 'critical-priority' : '';
        
        const statusClass = `status-${ticket.status.toLowerCase()}`;
        
        html += `
            <div class="card ticket-card ${priorityClass} mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${ticket.subject}</h5>
                        <span class="status-badge ${statusClass}">${ticket.status}</span>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">Ticket ID: ${ticket.id}</h6>
                    <p class="card-text">${ticket.description}</p>
                    <div class="d-flex justify-content-between">
                        <small class="text-muted">Submitted: ${new Date(ticket.createdAt).toLocaleString()}</small>
                        <small class="text-muted">Priority: ${ticket.priority}</small>
                        <small class="text-muted">Department: ${ticket.department}</small>
                    </div>
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
}
