# NeuroFleetX Frontend

A modern, responsive React.js frontend for NeuroFleetX, an AI-driven urban mobility optimization platform.

## 🚀 Features

### Landing Page
- Hero section with compelling tagline: "Optimizing Urban Mobility with AI"
- Call-to-action buttons for "Get Started" and "Learn More"
- Abstract city/transportation/AI-themed illustrations

### Dashboard
- Responsive layout with sidebar navigation
- Real-time traffic data visualization (charts/graphs)
- Fleet status widgets (active vehicles, trips)
- AI suggestions for route optimization
- Interactive map integration (Mapbox) showing live fleet locations

### Fleet Management
- Complete vehicle management system
- Filter by status, location, or vehicle type
- Add, edit, and delete vehicles
- Real-time status updates

### Route Optimization
- AI-powered route planning
- Input form for origin, destination, and vehicle type
- Optimized route display with metrics
- Distance, time, fuel efficiency, and traffic conditions

### Reports Section
- Historical data visualization
- Trip counts, average delivery times
- Vehicle usage and CO2 emissions tracking
- Export options (CSV/PDF)

### Data Management Dashboard
- Full CRUD operations for vehicles, drivers, and telemetry
- Real-time data management interface
- Database integration with MySQL backend

## 🛠️ Tech Stack

- **Frontend Framework**: React.js 18
- **Styling**: Tailwind CSS
- **UI Components**: Material-UI (MUI)
- **Charts**: Recharts
- **Maps**: Mapbox GL JS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see Backend-Node or Backend-Java)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Bhuvan-1005/Bhuvan-NeuroFleetX.git
cd Bhuvan-NeuroFleetX/Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

```bash
npm start
```

The application will start on `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## 🔧 Configuration

### Backend Connection

The frontend connects to the NeuroFleetX backend API. Configure the API URL in your `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## 📁 Project Structure

```
Frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── VehicleManager.js
│   │   ├── DriverManager.js
│   │   ├── TelemetryManager.js
│   │   ├── Layout.js
│   │   ├── Map.js
│   │   └── ...
│   ├── pages/
│   │   ├── Landing.js
│   │   ├── DataManagementDashboard.js
│   │   └── ...
│   ├── services/
│   │   ├── neurofleetx-api.js
│   │   └── api.js
│   ├── context/
│   │   └── AppContext.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Authentication

The application supports role-based authentication:
- **Fleet Managers** (Teachers): Full access to all features
- **Drivers** (Students): Limited access to driver-specific features

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Dark Mode Support**: Toggle between light and dark themes
- **Modern Design**: Clean, professional interface using Material-UI
- **Interactive Charts**: Real-time data visualization with Recharts
- **Smooth Animations**: Enhanced user experience with Framer Motion

## 🔗 API Integration

The frontend integrates with the NeuroFleetX backend providing:

### Vehicles API
- `GET /api/vehicles` - Fetch all vehicles
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Drivers API
- `GET /api/drivers` - Fetch all drivers
- `POST /api/drivers` - Create new driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Telemetry API
- `GET /api/telemetry` - Fetch telemetry data
- `POST /api/telemetry` - Add telemetry record
- `DELETE /api/telemetry/:id` - Delete telemetry record

### Authentication API
- `POST /api/auth/teacher/signup` - Fleet manager signup
- `POST /api/auth/teacher/login` - Fleet manager login
- `POST /api/auth/student/login` - Driver login

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Bhuvan-1005** - *Initial work* - [GitHub](https://github.com/Bhuvan-1005)

## 🙏 Acknowledgments

- React.js community
- Material-UI team
- Mapbox for mapping services
- All contributors and supporters

---

**NeuroFleetX** - Revolutionizing urban mobility with AI-powered solutions.