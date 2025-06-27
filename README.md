# PauleanAI - AI-Powered Educational Platform

**Powered by St. Paul's School Excellence**

PauleanAI is a comprehensive AI-powered educational platform designed specifically for educators, inspired by MagicSchool AI but customised with St. Paul's School's official branding and British educational standards.

## 🎨 Official St. Paul's School Color System

We now use the complete official color palette extracted from St. Paul's School's website:

### Primary Brand Colors
- **Brand Red**: `#a3282f` - Primary brand color for CTAs and highlights
- **Brand Blue**: `#002f5c` - Secondary brand color for headers and accents
- **Primary Text**: `#3f4449` - Main text color for optimal readability
- **Secondary Text**: `#373737` - Supporting text and headers
- **Medium Grey**: `#636363` - Subtle text and borders

### Background Colors
- **Pure White**: `#ffffff` - Clean backgrounds
- **Light Grey**: `#f8f8f8` - Section backgrounds
- **Border Grey**: `#e5e5e5` - Subtle borders and dividers
- **Dark Grey**: `#131313` - Dark UI elements
- **Pure Black**: `#000000` - High contrast elements

### Interactive Colors
- **Semi-transparent overlays**: `rgba(63, 68, 73, 0.5)` and `rgba(63, 68, 73, 0.25)`
- **Hover states**: Enhanced with official color variations
- **Focus states**: Consistent with brand colors

## ✨ Features

### 🎯 **80+ AI Tools Across 6 Categories**

#### 📚 **Lesson Planning (15 tools)**
- Lesson Plan Generator
- Unit Plan Creator  
- Learning Objective Writer
- Curriculum Mapper
- Pacing Guide Creator
- Standards Alignment Tool
- Differentiation Planner
- Extension Activity Generator
- Remediation Planner
- Cross-Curricular Connector
- Field Trip Planner
- Project-Based Learning Designer
- Assessment Integration Planner
- Technology Integration Guide
- Collaborative Learning Designer

#### ✏️ **Assessment (12 tools)**
- Quiz Generator
- Rubric Creator
- Test Maker
- Question Bank Builder
- Formative Assessment Designer
- Peer Assessment Creator
- Self-Assessment Builder
- Portfolio Assessment Guide
- Performance Task Designer
- Feedback Generator
- Grade Calculator
- Progress Tracker

#### 👥 **Pupil Support (18 tools)**
- IEP Goal Generator
- Behaviour Plan Creator
- Accommodation Suggester
- Social Skills Curriculum
- Transition Planning Tool
- Motivation Booster
- Study Skills Guide
- Emotional Support Planner
- Learning Style Adapter
- Confidence Builder
- Goal Setting Assistant
- Peer Mediation Guide
- Inclusion Planner
- Crisis Intervention Guide
- Parent Collaboration Tool
- Attendance Improvement Plan
- Homework Support System
- Career Exploration Guide

#### 💬 **Communication (10 tools)**
- Email Generator
- Newsletter Creator
- Parent Conference Prep
- Progress Report Writer
- Meeting Agenda Creator
- Presentation Builder
- Social Media Post Creator
- Thank You Note Generator
- Announcement Writer
- Supply Teacher Notes

#### 📊 **Productivity (14 tools)**
- Schedule Optimiser
- To-Do List Manager
- Time Tracker
- Resource Organiser
- Data Analyser
- Report Card Helper
- Seating Chart Creator
- Supply List Generator
- Budget Planner
- Event Planner
- Substitute Planner
- Professional Development Tracker
- Collaboration Scheduler
- Workflow Automator

#### 💡 **Creative Tools (11 tools)**
- Activity Generator
- Story Starter
- Game Creator
- Art Project Planner
- Music Lesson Builder
- Drama Activity Designer
- Science Experiment Guide
- Creative Writing Prompts
- Maker Space Planner
- Innovation Challenge Creator
- Cultural Exchange Planner

## 🇬🇧 British Education Standards

- **Year Groups**: Reception through Year 13
- **British Spelling**: Colour, centre, behaviour, etc.
- **UK Terminology**: Pupils (not students), supply teachers, etc.
- **Curriculum Alignment**: Designed for British educational standards

## 🧠 Intelligent AI Routing System

PauleanAI features an advanced AI routing system that automatically selects the best AI provider for each specific task:

### AI Providers
- **🎓 Claude AI (Anthropic)**: Optimised for educational content creation
  - Lesson plans and curriculum design
  - Assessment creation and rubrics
  - Educational best practices
  
- **🤖 OpenAI GPT-4**: Excellence in general writing and communication
  - Professional emails and letters
  - Meeting agendas and presentations
  - General administrative tasks
  
- **⚡ Mistral AI**: Creative and multilingual capabilities
  - Creative writing prompts
  - Story starters and innovative content
  - Multilingual educational materials
  
- **🎵 TopMedia AI**: Specialised audio and music generation
  - Educational background music
  - Audio content for lessons
  - Voice and sound effects

### Smart Features
- **Automatic Selection**: System intelligently routes requests to the best AI
- **Performance Monitoring**: Langfuse integration tracks usage and costs
- **Real-time Analytics**: Monitor AI performance and efficiency
- **Cost Optimisation**: Balanced approach to quality and cost-effectiveness
- **Transparent Reporting**: See which AI generated your content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### API Keys Required
To use PauleanAI's full functionality, you'll need the following API keys:

- **Supabase**: Database and backend services
- **OpenAI**: GPT-4 for general AI tasks  
- **Claude (Anthropic)**: Specialised for educational content
- **Mistral**: Creative and multilingual tasks
- **Langfuse**: AI monitoring and analytics
- **TopMedia**: Audio and music generation

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pauleanai-live.git
cd pauleanai-live
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory with your API keys:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI APIs
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_CLAUDE_AI_API=your_claude_api_key
VITE_MISTRAL_API=your_mistral_api_key
VITE_TOPMEDIA_API=your_topmedia_api_key

# Langfuse Configuration
VITE_LANGFUSE_API_SECRET=your_langfuse_secret_key
VITE_LANGFUSE_API_PUBLIC_KEY=your_langfuse_public_key
VITE_LANGFUSE_API_URL=https://us.cloud.langfuse.com
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 🎨 Design System

### Typography
- **Primary Font**: Archer (St. Paul's official font)
- **Secondary Font**: Segoe UI (web-safe alternative)
- **Body Text**: 16px/24px for optimal readability
- **Headings**: Scaled typography system

### Components
- **Cards**: Rounded corners (8px), subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky header with backdrop blur

### Responsive Design
- **Mobile-first**: Optimised for all screen sizes
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid and Flexbox

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── LandingPage.tsx  # Homepage with hero, features, testimonials
│   ├── Dashboard.tsx    # Main dashboard with tool categories
│   ├── ToolPage.tsx     # Individual tool interface
│   └── ...              # Other UI components
├── hooks/               # Custom React hooks
├── services/            # API services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── assets/              # Static assets
```

## 🎯 Key Features

### Landing Page
- **Hero Section**: Gradient background with official colors
- **Statistics**: 80+ tools, 10+ hours saved, 5M+ educators
- **Feature Categories**: Visual cards for each tool category
- **Testimonials**: Educator feedback with avatars
- **Call-to-Action**: Prominent buttons with hover effects

### Dashboard
- **Category Sidebar**: Interactive navigation with tool counts
- **Search & Filter**: Real-time tool discovery
- **Popular Tools**: Highlighted frequently-used tools
- **Grid/List Views**: Flexible tool browsing
- **Progress Tracking**: User statistics and achievements

### Tool Pages
- **Dynamic Forms**: Context-aware input fields
- **AI Generation**: Mock AI content generation
- **Export Options**: Copy, download, share functionality
- **Tips Section**: Helpful guidance for better results
- **Professional Output**: Curriculum-aligned content

## 🔮 Future Development

### Phase 2: Backend Integration
- [ ] User authentication system
- [ ] Real AI API integration (OpenAI/Claude)
- [ ] User preferences and history
- [ ] Content saving and organisation
- [ ] Collaboration features

### Phase 3: Advanced Features
- [ ] Custom tool creation
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Offline functionality
- [ ] Integration with school systems

### Phase 4: Community Features
- [ ] Tool sharing marketplace
- [ ] Educator community
- [ ] Professional development tracking
- [ ] Certification programmes

## 🎨 Branding Assets

### Available Logos
- `BRAND_ST PAULS_Primary logo_P.png` - Primary logo
- `BRAND_ST PAULS_Black Outline.png` - Black outline version
- `BRAND_ST PAULS_White Outline.png` - White outline version
- Various horizontal and alternative versions

### Brand Guidelines
- **Primary Colors**: Blue (#002f5c) and Red (#a3282f)
- **Typography**: Archer for headings, Segoe UI for body text
- **Voice**: Professional, supportive, educational excellence
- **Imagery**: Clean, modern, education-focused

## 🤝 Contributing

We welcome contributions from the St. Paul's community!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary to St. Paul's School. All rights reserved.

## 🙏 Acknowledgments

- **St. Paul's School** - For branding and educational excellence standards
- **MagicSchool AI** - For inspiration and feature concepts  
- **React Community** - For the amazing ecosystem
- **Tailwind CSS** - For the utility-first CSS framework

---

**Built with ❤️ for St. Paul's School educators**

*Transforming education through AI whilst maintaining the highest standards of academic excellence.*
