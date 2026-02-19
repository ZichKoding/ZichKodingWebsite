import { Metadata } from 'next';
import { ContactForm } from '@/components/public/ContactForm';
import { Mail, Github, Linkedin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact - Chris | ZichKoding',
  description: 'Get in touch with me. I\'d love to hear from you!',
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Let's Connect</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out. I'm
            always interested in hearing about new projects and opportunities.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-8">
              <ContactForm />
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1 flex flex-col justify-center space-y-8">
            {/* Email */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Mail className="text-blue-400" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">Email</h3>
              </div>
              <p className="text-gray-400">
                <a
                  href="mailto:hello@example.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  hello@example.com
                </a>
              </p>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Connect With Me</h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                <span className="font-semibold">Response time:</span> I typically respond
                within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
