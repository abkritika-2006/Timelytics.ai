
# 🎓 Intelligent Timetable Generator

A comprehensive, modern web application for educational institutions to generate, manage, and optimize academic timetables with advanced AI-powered scheduling algorithms and real-time collaboration features.

## ✨ Features

### 🏫 Multi-Institution Support
- **Institution Management**: Support for multiple educational institutions
- **Role-Based Access**: Admin, Faculty, and Student portals with specific permissions
- **Scalable Architecture**: Designed to handle institutions of any size

### 🤖 Intelligent Scheduling
- **AI-Powered Algorithm**: Advanced constraint-solving algorithms for optimal timetable generation
- **Conflict Resolution**: Automatic detection and resolution of scheduling conflicts
- **Resource Optimization**: Efficient allocation of rooms, faculty, and time slots
- **NEP 2020 Compliance**: Adherence to National Education Policy guidelines

### 👥 User Management
- **Multi-Role Authentication**: Secure login system for different user types
- **Profile Management**: Comprehensive user profiles with preferences
- **Institution Boundaries**: Data isolation between different institutions

### 📊 Advanced Analytics
- **Real-time Dashboard**: Live statistics and performance metrics
- **Resource Utilization**: Track room and faculty utilization rates
- **Conflict Analysis**: Detailed reports on scheduling conflicts and resolutions
- **Export Capabilities**: Generate reports in multiple formats (PDF, Excel, CSV)

### 🔄 Real-time Collaboration
- **Live Updates**: Real-time synchronization across all users
- **Collaborative Editing**: Multiple users can work on timetables simultaneously
- **Presence Indicators**: See who's currently working on the system
- **Change Notifications**: Instant alerts for important updates

### 🗄️ Database Management
- **Comprehensive Schema**: 15+ interconnected database tables
- **Data Integrity**: Foreign key constraints and validation rules
- **Audit Logging**: Complete history of all changes
- **Backup & Recovery**: Automated data protection

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **Radix UI** for accessible, customizable components
- **Lucide React** for beautiful icons

### Backend & Database
- **Supabase** for backend-as-a-service
- **PostgreSQL** with Row Level Security (RLS)
- **Real-time subscriptions** for live updates
- **File storage** with secure access controls

### Development Tools
- **TypeScript** for enhanced developer experience
- **ESLint** for code quality
- **Git** for version control
- **npm** for package management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Timetable Generator Design"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```


3. **Set up the database**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the SQL commands from `database_schema.sql`
   - Apply security policies from `security_policies.sql`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── AdminDashboard.tsx
│   │   ├── FacultyPortal.tsx
│   │   ├── StudentPortal.tsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   ├── utils/              # Utility functions
│   │   ├── supabase/       # Supabase integration
│   │   ├── constraints.ts  # Scheduling constraints
│   │   ├── intelligentScheduler.ts
│   │   └── ...
│   ├── styles/             # Global styles
│   └── assets/             # Static assets
├── database_schema.sql     # Database schema
├── security_policies.sql   # RLS policies
└── package.json
```

## 🔧 Configuration

### Supabase Setup

1. **Create a Supabase project**
   - Visit [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Database Setup**
   - Execute `database_schema.sql` in Supabase SQL Editor
   - Apply `security_policies.sql` for security


## 🎯 Usage

### For Administrators
1. **Institution Setup**: Configure institution details and settings
2. **User Management**: Add faculty and students to the system
3. **Resource Management**: Define rooms, courses, and time slots
4. **Timetable Generation**: Use AI algorithms to generate optimal schedules
5. **Analytics**: Monitor system performance and resource utilization

### For Faculty
1. **Profile Management**: Update personal information and preferences
2. **Course Assignment**: View assigned courses and schedules
3. **Availability**: Set preferred time slots and unavailable periods
4. **Collaboration**: Work with other faculty on timetable optimization

### For Students
1. **Schedule Viewing**: Access personal and class timetables
2. **Course Information**: View course details and faculty information
3. **Notifications**: Receive updates about schedule changes

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Role-based Permissions**: Different access levels for each user type
- **Institution Isolation**: Data separation between institutions
- **Audit Logging**: Complete change history
- **Secure File Storage**: Protected file uploads and downloads

## 📊 Database Schema

The application uses a comprehensive database schema with 15+ tables:

- **institutions**: Educational institution information
- **users**: Base user accounts with role management
- **faculty**: Faculty-specific data and preferences
- **students**: Student information and academic details
- **courses**: Course catalog and requirements
- **rooms**: Room inventory with capacity and equipment
- **timetables**: Generated timetables with metadata
- **timetable_entries**: Individual schedule entries
- **constraints**: Scheduling rules and preferences
- **audit_log**: Change tracking and history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/src/guidelines/` directory
- Review the authentication guide in `/src/AUTHENTICATION_GUIDE.md`

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

The application is optimized for deployment on modern hosting platforms with built-in support for:
- Static site generation
- Environment variable management
- Automatic HTTPS
- Global CDN distribution

---

**Built with ❤️ for educational institutions worldwide**
  
