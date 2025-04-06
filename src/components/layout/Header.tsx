
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="font-bold text-xl flex items-center gap-2">
            <img 
              src="/lovable-uploads/d31e9fa0-0ffb-4a96-8186-8fd0b01c4cc2.png" 
              alt="Placement Pulse Logo" 
              className="h-8 w-auto"
            />
            <span className="text-blue-600">Placement Pulse</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Button size="sm">Upload Resume</Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 py-2 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Button 
              className="w-full mt-2" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload Resume
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
