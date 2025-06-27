import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  PenTool, 
  Users, 
  MessageCircle, 
  BarChart3, 
  Lightbulb,
  ArrowRight,
  Clock,
  Shield,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  Award
} from 'lucide-react'

const LandingPage: React.FC = () => {

  const features = [
    {
      icon: BookOpen,
      title: "Lesson Planning",
      description: "Create comprehensive lesson plans aligned with curriculum standards in minutes",
      color: "bg-sp-brand-blue",
      gradient: "from-sp-brand-blue to-primary-blue"
    },
    {
      icon: PenTool,
      title: "Assessment Writing",
      description: "Generate quizzes, tests, and rubrics tailored to your learning objectives",
      color: "bg-sp-brand-red",
      gradient: "from-sp-brand-red to-primary-red"
    },
    {
      icon: Users,
      title: "Pupil Support",
      description: "Differentiate instruction and create personalised learning experiences",
      color: "bg-sp-text-secondary",
      gradient: "from-sp-text-secondary to-primary-gray"
    },
    {
      icon: MessageCircle,
      title: "Communication",
      description: "Draft professional emails, newsletters, and parent communications effortlessly",
      color: "bg-sp-brand-blue",
      gradient: "from-sp-brand-blue to-primary-blue"
    },
    {
      icon: BarChart3,
      title: "Data Analysis",
      description: "Analyse pupil performance and generate insightful reports",
      color: "bg-sp-text-primary",
      gradient: "from-sp-text-primary to-primary-darkgray"
    },
    {
      icon: Lightbulb,
      title: "Creative Tools",
      description: "Design engaging activities and innovative teaching strategies",
      color: "bg-sp-brand-red",
      gradient: "from-sp-brand-red to-primary-red"
    }
  ]

  const stats = [
    { number: "80+", label: "AI Tools", icon: Zap },
    { number: "10+", label: "Hours Saved Weekly", icon: Clock },
    { number: "6", label: "AI Providers", icon: Users },
    { number: "24/7", label: "Availability", icon: Shield }
  ]



  const benefits = [
    { icon: Target, text: "British Curriculum Aligned" },
    { icon: Clock, text: "Save 10+ Hours Weekly" },
    { icon: Shield, text: "Secure & Private" },
    { icon: Award, text: "St. Paul's Excellence" }
  ]

  return (
    <div className="min-h-screen bg-sp-bg-white">
      {/* Header */}
      <header className="bg-sp-bg-white shadow-sm border-b border-sp-bg-medium sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="/logos/BRAND_ST PAULS_Primary logo_P.png" 
                alt="St. Paul's School" 
                className="h-12 w-auto hover:scale-105 transition-transform duration-300"
              />
              <div className="border-l-2 border-sp-brand-blue/20 pl-4">
                <h1 className="text-2xl font-bold text-sp-brand-blue font-archer tracking-tight">PauleanAI</h1>
                <p className="text-sm text-sp-text-medium font-segoe font-medium">Powered by St. Paul's School</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sp-text-medium hover:text-sp-brand-blue transition-colors font-medium">Features</a>
              <a href="#about" className="text-sp-text-medium hover:text-sp-brand-blue transition-colors font-medium">About</a>
              <a href="#school-focus" className="text-sp-text-medium hover:text-sp-brand-blue transition-colors font-medium">St. Paul's Focus</a>

              <Link 
                to="/dashboard" 
                className="bg-sp-brand-red text-white px-6 py-3 rounded-lg hover:bg-sp-brand-red/90 transition-all font-semibold shadow-sp-card hover:shadow-sp-hover transform hover:scale-105"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-sp-brand-blue via-sp-text-primary to-sp-brand-red opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-sp-brand-red/5 to-transparent opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          {/* Logo Horizontal no Canto Superior Esquerdo - Movido mais à esquerda e aumentado 20% */}
          <div className="absolute top-6 left-4 z-10">
            <img 
              src="/BRAND_ST PAULS_Horizontal_V1_Colour_N.png" 
              alt="St. Paul's School" 
              className="h-40 lg:h-48 w-auto hover:scale-105 transition-transform duration-300 drop-shadow-lg"
            />
          </div>
          
          <div className="text-center max-w-5xl mx-auto mt-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sp-brand-blue/10 to-sp-brand-red/10 border border-sp-brand-blue/20 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-sp-brand-red" />
              <span className="text-sm font-semibold text-sp-brand-blue">Exclusive to St. Paul's School Community</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-sp-text-primary mb-8 leading-tight font-archer">
              <span className="block mb-2">AI-Powered Education</span>
              <span className="block bg-gradient-to-r from-sp-brand-blue via-sp-brand-red to-sp-brand-blue bg-clip-text text-transparent animate-pulse">
                For St. Paul's Excellence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-sp-text-medium mb-8 leading-relaxed max-w-3xl mx-auto font-segoe">
              Transform your teaching with 80+ AI tools designed specifically for educators. 
              Save 10+ hours per week whilst maintaining St. Paul's high standards of excellence.
            </p>
            
            {/* Benefits Row */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <div key={index} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-sp-brand-blue/20 shadow-sm">
                    <IconComponent className="w-5 h-5 text-sp-brand-red" />
                    <span className="font-semibold text-sp-brand-blue">{benefit.text}</span>
                  </div>
                )
              })}
            </div>
            
            <div className="flex justify-center">
              <Link 
                to="/dashboard" 
                className="bg-gradient-to-r from-sp-brand-red via-sp-brand-red to-sp-brand-red/80 text-white px-12 py-6 rounded-2xl text-2xl font-bold hover:shadow-2xl transition-all transform hover:scale-110 shadow-xl flex items-center justify-center gap-4 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                Enter PauleanAI Dashboard
                <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-sp-bg-light via-white to-sp-bg-light border-y border-sp-bg-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-sp-brand-blue mb-2 font-archer">
                    {stat.number}
                  </div>
                  <div className="text-sp-text-medium font-medium font-segoe">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-sp-bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-sp-brand-red/10 text-sp-brand-red rounded-full px-4 py-2 mb-6">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-semibold">POWERFUL FEATURES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-sp-text-primary mb-4 font-archer">
              Everything You Need to Teach Better
            </h2>
            <p className="text-xl text-sp-text-medium max-w-3xl mx-auto font-segoe">
              Comprehensive AI tools designed specifically for educators, 
              helping you save time whilst improving pupil outcomes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="group bg-gradient-to-br from-white to-sp-bg-light rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-sp-bg-medium hover:border-sp-brand-blue/30 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-sp-brand-blue/5 hover:to-sp-brand-red/5">
                  <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-sp-text-primary mb-3 font-archer">
                    {feature.title}
                  </h3>
                  <p className="text-sp-text-medium leading-relaxed font-segoe">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* St. Paul's School Focus Section */}
      <section id="school-focus" className="py-20 bg-sp-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-sp-brand-red/10 text-sp-brand-red rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">EXCLUSIVELY FOR ST. PAUL'S</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-sp-text-primary mb-4 font-archer">
              Designed for Our School Community
            </h2>
            <p className="text-xl text-sp-text-medium font-segoe max-w-3xl mx-auto">
              PauleanAI is crafted specifically for St. Paul's School, understanding our British curriculum standards, 
              our values, and our pupils' unique educational journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white via-sp-brand-blue/5 to-sp-brand-blue/10 rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all group border-l-4 border-sp-brand-blue hover:border-l-8 hover:-translate-y-1">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sp-brand-blue rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto group-hover:scale-110 transition-transform">
                  🎓
                </div>
              </div>
              <h3 className="text-xl font-bold text-sp-text-primary mb-4 text-center font-archer">
                British Curriculum Aligned
              </h3>
              <p className="text-sp-text-medium text-center font-segoe leading-relaxed">
                Every tool is designed to support our British educational standards, 
                using proper terminology like "pupils" and "Year groups" that align with our academic framework.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white via-sp-brand-red/5 to-sp-brand-red/10 rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all group border-l-4 border-sp-brand-red hover:border-l-8 hover:-translate-y-1">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sp-brand-red rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto group-hover:scale-110 transition-transform">
                  🏫
                </div>
              </div>
              <h3 className="text-xl font-bold text-sp-text-primary mb-4 text-center font-archer">
                St. Paul's Context
              </h3>
              <p className="text-sp-text-medium text-center font-segoe leading-relaxed">
                All content generated is contextualised for our school community, 
                incorporating our values, traditions, and educational philosophy into every response.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white via-purple-50 to-purple-100 rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all group border-l-4 border-purple-500 hover:border-l-8 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-sp-text-primary rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto group-hover:scale-110 transition-transform">
                  🤖
                </div>
              </div>
              <h3 className="text-xl font-bold text-sp-text-primary mb-4 text-center font-archer">
                Intelligent AI Routing
              </h3>
              <p className="text-sp-text-medium text-center font-segoe leading-relaxed">
                Advanced AI system with multiple providers, circuit breakers, and intelligent fallback 
                ensures reliable, high-quality content generation for our community.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red text-white rounded-2xl font-semibold text-lg shadow-card-hover group hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              <span>Exclusive to St. Paul's School Community</span>
              <CheckCircle className="w-6 h-6 ml-3" />
            </div>
            <p className="text-sp-text-medium mt-4 font-segoe">
              Access restricted to authenticated St. Paul's School staff and faculty
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sp-brand-blue to-sp-brand-red relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-archer">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-segoe">
            Join the AI education revolution. Start saving time and improving 
            pupil outcomes with PauleanAI today.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Free to start</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Privacy-first</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Save 10+ hours/week</span>
            </div>
          </div>
          <Link 
            to="/dashboard" 
            className="bg-white text-sp-brand-blue px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/95 transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-2 group"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sp-text-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logos/BRAND_ST PAULS_White Outline.png" 
                  alt="St. Paul's School" 
                  className="h-10 w-auto"
                />
                <div>
                  <h3 className="text-xl font-bold font-archer">PauleanAI</h3>
                  <p className="text-sm text-white/70 font-segoe">Powered by St. Paul's School</p>
                </div>
              </div>
              <p className="text-white/80 mb-4 font-segoe leading-relaxed">
                Empowering educators with AI tools that maintain the highest standards 
                of educational excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-archer">Product</h4>
              <ul className="space-y-2 text-white/80 font-segoe">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-archer">Support</h4>
              <ul className="space-y-2 text-white/80 font-segoe">
                <li><a href="#" className="hover:text-white transition-colors">Help Centre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/70 font-segoe">
            <p>&copy; 2024 St. Paul's School. All rights reserved.</p>
          </div>
        </div>
      </footer>


    </div>
  )
}

export default LandingPage 