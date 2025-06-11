# Purple Painting Interview Management System

A web application for managing employee interviews at Purple Painting. This system helps track interviewees, conduct interviews, and export interview results.

## Features

- Add and manage interviewees
- Track interview status (Pending, Confirmed, Completed)
- Conduct interviews with a comprehensive form
- Export interview results to CSV
- Multiple location support
- Position-based interview tracking

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/purplepainting/interviewquestions.git
cd interviewquestions
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Usage

1. Add new interviewees using the "Add Interviewee" button
2. Confirm attendance when interviewees arrive
3. Start the interview process by clicking "Start Interview"
4. Fill out the interview form
5. Export completed interviews using the "Export Today's Interviews" button

## Technologies Used

- React
- TypeScript
- Material-UI
- Vite 