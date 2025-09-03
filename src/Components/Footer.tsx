import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container px-6 mx-auto flex flex-col md:flex-row justify-between gap-8">
        {/* Block 1: About */}
        <div className="flex-1">
          <h3 className="font-bold mb-2">About</h3>
          <p>Short description or company info.</p>
        </div>
        {/* Block 2: Links */}
        <div className="flex-1">
          <h3 className="font-bold mb-2">Links</h3>
          <ul>
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/collection" className="hover:underline">Collection</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        {/* Block 3: Contact */}
        <div className="flex-1">
          <h3 className="font-bold mb-2">Contact</h3>
          <p>Email: info@example.com</p>
          <p>Phone: +123456789</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
