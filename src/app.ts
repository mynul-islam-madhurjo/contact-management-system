interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
}

class ContactManager {
    private contacts: Contact[] = [];
    private currentId: string | null = null;
    private form: HTMLFormElement;
    private contactsList: HTMLDivElement;
    private submitBtn: HTMLButtonElement;

    constructor() {
        this.form = document.getElementById('contactForm') as HTMLFormElement;
        this.contactsList = document.getElementById('contactsList') as HTMLDivElement;
        this.submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;

        this.loadContacts();

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.contactsList.addEventListener('click', this.handleContactActions.bind(this));
    }

    private loadContacts(): void {
        const savedContacts = localStorage.getItem('contacts');
        if (savedContacts) {
            this.contacts = JSON.parse(savedContacts);
            this.renderContacts();
        }
    }

    private saveContacts(): void {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();

        const nameInput = document.getElementById('name') as HTMLInputElement;
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const phoneInput = document.getElementById('phone') as HTMLInputElement;

        const contact: Contact = {
            id: this.currentId || Date.now().toString(),
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        };

        if (this.currentId) {
            this.contacts = this.contacts.map(c =>
                c.id === this.currentId ? contact : c
            );
            this.currentId = null;
            this.submitBtn.textContent = 'Add Contact';
        } else {
            this.contacts.push(contact);
        }

        this.saveContacts();
        this.renderContacts();
        this.form.reset();
    }

    private handleContactActions(e: Event): void {
        const target = e.target as HTMLElement;
        if (!target.matches('button')) return;

        const contactCard = target.closest('.contact-card') as HTMLElement;
        const contactId = contactCard?.dataset.id;

        if (!contactId) return;

        if (target.classList.contains('edit-btn')) {
            this.editContact(contactId);
        } else if (target.classList.contains('delete-btn')) {
            this.deleteContact(contactId);
        }
    }

    private editContact(id: string): void {
        const contact = this.contacts.find(c => c.id === id);
        if (!contact) return;

        (document.getElementById('name') as HTMLInputElement).value = contact.name;
        (document.getElementById('email') as HTMLInputElement).value = contact.email;
        (document.getElementById('phone') as HTMLInputElement).value = contact.phone;

        this.currentId = id;
        this.submitBtn.textContent = 'Update Contact';
    }

    private deleteContact(id: string): void {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contacts = this.contacts.filter(c => c.id !== id);
            this.saveContacts();
            this.renderContacts();
        }
    }

    private renderContacts(): void {
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