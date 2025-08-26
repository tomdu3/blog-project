import React from 'react';

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Contact Me</h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-4">
        I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out to me through any of the following channels:
      </p>
      <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed">
        <li>Email: [your-email@example.com](mailto:your-email@example.com)</li>
        <li>LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/your-profile)</li>
        <li>GitHub: [Your GitHub Profile](https://github.com/your-username)</li>
      </ul>
    </div>
  );
};

export default ContactPage;