# Doctor Appointment Booking Website (Frontend)

This is the frontend of a Doctor Appointment Booking website built using ReactJS, Vite, and styled with Tailwind CSS. It allows users to view doctor profiles, book appointments, and manage their appointments. This project focuses solely on the frontend, with mock data or placeholder content.

## Features

- Responsive Design with Tailwind CSS
- Navigation between pages like Home, Doctor Profile, Appointments, etc.
- User Interface for doctor booking and profile management.
- React Router for page navigation.
- React Toastify for notifications (e.g., booking success).
- Context API for state management across the app (e.g., user appointments).

## Tech Stack:

- ReactJS: JavaScript library for building user interfaces
- Vite: Build tool for fast development
- React Router: For routing between pages
- Tailwind CSS: Utility-first CSS framework for fast UI styling
- React Toastify: For toast notifications
- PostCSS & Autoprefixer: For CSS optimization

## Setup Instructions

1. Clone the Repository
   Clone this repository to your local machine using:

```bash
git clone https://github.com/AnilPavagada/Doctor-Appointment-Booking-Website-in-ReactJS-.git

cd doctor-appointment-booking-frontend

```

2. Install Dependencies
   Run the following command to install all the required dependencies

```bash
npm install

```

3. Set Up Tailwind CSS
   Tailwind CSS is already configured, but if you want to set it up from scratch, run:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

```

Make sure your tailwind.config.js is set up properly. Here’s a basic example:

```bash
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

4. Update the index.html
   Change the <title> tag in your index.html to:

```html
<title>Prescripto</title>
```

5. Run the Development Server
   Once everything is set up, start the development server by running:

```bash
npm run dev
```

## Fonts Used

This project uses Google Fonts for text styling. The following <link> tag is included in the index.html for font inclusion:

```bash
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

```

## Components Overview

- Navbar: Navigation links to pages like Home, Contact, Login, etc.
- Header: The welcoming section at the top of the page.
- SpecialityMenu: Filters doctors based on specialties (e.g., cardiology, dermatology).
- Doctor: Displays the doctor’s profile with booking options.
- RelatedDoctor: Shows a list of related doctors under the doctor’s profile page.
- Banner: Large banner at the top of the homepage with promotional content.
- Footer: Footer section with social links and contact information.

## Context API (AppContext)

The AppContext manages global states, such as user data and booked appointments, across different pages of the website.

## React Router Setup

React Router is used to navigate between different pages (Home, Doctor, Appointments, etc.). All routes are set up inside the App.jsx file.

## Contribution Guidelines

Feel free to fork this repository, create issues, or submit pull requests to improve the project.

## License

This project is licensed under the MIT License.
