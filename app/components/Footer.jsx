// components/Footer.js
export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2025 CodeMaper. All rights reserved.</p>
          <div className="mt-4">
            <a href="https://github.com/yourprofile" target="_blank" className="mx-2 text-lg hover:text-gray-400">
              GitHub
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" className="mx-2 text-lg hover:text-gray-400">
              LinkedIn
            </a>
          </div>
          <p className="mt-4 text-xs">Designed with ❤️ by CodeMaper Team</p>
        </div>
      </footer>
    );
  }
  