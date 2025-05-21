export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Nom. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="https://x.com/NOMME_sol" className="hover:text-gray-300" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://t.me/+lKGrybYSJmk1ZDVl" className="hover:text-gray-300" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 