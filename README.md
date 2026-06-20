# ShoolinTech LLC - Website

A professional, responsive website for ShoolinTech LLC, an IT consultancy firm providing comprehensive services across multiple domains and technologies.

## Features

- **Home Page**: Company overview with highlights of key services and value propositions
- **Services Page**: Detailed descriptions of 8 main service offerings including:
  - Cloud Architecture & Migration
  - Cybersecurity & Compliance
  - DevOps & Automation
  - Data Analytics & BI
  - AI & Machine Learning
  - Enterprise Architecture
  - API & Integration Services
  - Training & Knowledge Transfer

- **Contact Page**: 
  - Contact form with service selection
  - Contact information display
  - **Editable company address** (changes persist in browser storage)
  - Phone and email information
  - Business hours

## File Structure

```
shoolintechllc-website/
├── index.html          # Home page
├── services.html       # Services page
├── contact.html        # Contact page
├── styles.css          # All styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use

1. **Open the Website**: Open `index.html` in your web browser
2. **Navigate**: Use the navigation menu to move between Home, Services, and Contact pages
3. **Edit Address**: On the Contact page, click "Edit Address" button to modify the company address
   - Changes are automatically saved to your browser's local storage
   - They will persist even after closing the browser

## Editing Content

### To change company information:
- Edit the text in `index.html`, `services.html`, or `contact.html`

### To change colors:
- Edit the CSS variables in the `:root` section of `styles.css`
- Main variables: `--primary-color`, `--secondary-color`, etc.

### To add/modify services:
- Edit the service cards in `services.html`
- Each service card includes an icon, title, description, and feature list

### To update contact information:
- Edit phone, email, and business hours in `contact.html`
- Address can be edited via the "Edit Address" button on the contact page

## Technical Details

- **Pure HTML/CSS/JavaScript** - No dependencies required
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Local Storage** - Address changes are stored in browser's localStorage
- **Smooth Animations** - Hover effects and smooth transitions throughout

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Quick Start

1. Extract all files to a folder
2. Open `index.html` in a web browser
3. Customize the content as needed
4. Deploy to your web server

## Customization Tips

- Replace emoji icons in service cards with custom icons or images
- Add your company logo by modifying the `.logo` class
- Update the color scheme by changing CSS variables
- Add more sections by copying existing section structures
- Connect the contact form to a backend service for actual email submissions

## Support

For questions or modifications, refer to the inline comments in the HTML, CSS, and JavaScript files.
