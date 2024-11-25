"use strict";
class ContactManager {
    constructor() {
        this.contacts = [];
        this.currentId = null;
        this.form = document.getElementById('contactForm');
        this.contactsList = document.getElementById('contactsList');
        this.submitBtn = document.getElementById('submitBtn');
        this.loadContacts();
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.contactsList.addEventListener('click', this.handleContactActions.bind(this));
    }
    loadContacts() {
        const savedContacts = localStorage.getItem('contacts');
        if (savedContacts) {
            this.contacts = JSON.parse(savedContacts);
            this.renderContacts();
        }
    }
    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
    handleSubmit(e) {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const contact = {
            id: this.currentId || Date.now().toString(),
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        };
        if (this.currentId) {
            this.contacts = this.contacts.map(c => c.id === this.currentId ? contact : c);
            this.currentId = null;
            this.submitBtn.textContent = 'Add Contact';
        }
        else {
            this.contacts.push(contact);
        }
        this.saveContacts();
        this.renderContacts();
        this.form.reset();
    }
    handleContactActions(e) {
        const target = e.target;
        if (!target.matches('button'))
            return;
        const contactCard = target.closest('.contact-card');
        const contactId = contactCard === null || contactCard === void 0 ? void 0 : contactCard.dataset.id;
        if (!contactId)
            return;
        if (target.classList.contains('edit-btn')) {
            this.editContact(contactId);
        }
        else if (target.classList.contains('delete-btn')) {
            this.deleteContact(contactId);
        }
    }
    editContact(id) {
        const contact = this.contacts.find(c => c.id === id);
        if (!contact)
            return;
        document.getElementById('name').value = contact.name;
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone;
        this.currentId = id;
        this.submitBtn.textContent = 'Update Contact';
    }
    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contacts = this.contacts.filter(c => c.id !== id);
            this.saveContacts();
            this.renderContacts();
        }
    }
    renderContacts() {
        this.contactsList.innerHTML = this.contacts.map(contact => `
            <div class="contact-card" data-id="${contact.id}">
                <div class="contact-info">
                    <h3>${contact.name}</h3>
                    <p>${contact.email}</p>
                    <p>${contact.phone}</p>
                </div>
                <div class="contact-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `).join('');
    }
}
window.addEventListener('DOMContentLoaded', () => {
    new ContactManager();
});
