
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          My Blog
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About Me
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact Me
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
