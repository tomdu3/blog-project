
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center space-x-6">
          <Link href="https://github.com" passHref>
            <span className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">GitHub</span>
          </Link>
          <Link href="https://twitter.com" passHref>
            <span className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Twitter</span>
          </Link>
          <Link href="https://linkedin.com" passHref>
            <span className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">LinkedIn</span>
          </Link>
          <Link href="https://example.com" passHref>
            <span className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Website</span>
          </Link>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
          <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
