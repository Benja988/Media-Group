import Link from 'next/link';
import { Radio } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container-width py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Radio className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <span className="text-lg md:text-xl font-bold">RadioWave</span>
            </div>
            <p className="text-muted text-sm">Professional radio broadcasting platform for modern media groups and stations.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4">Platform</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {['Features', 'Pricing', 'Documentation', 'API'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-muted hover:text-gray-900 dark:hover:text-white transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4">Legal</h4>
            <ul className="space-y-1.5 md:space-y-2">
              {[{ name: 'Privacy Policy', path: '/privacy' },{ name: 'Terms of Service', path: '/terms' },{ name: 'Cookie Policy', path: '/cookies' },{ name: 'GDPR Compliance', path: '/gdpr' }].map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-muted hover:text-gray-900 dark:hover:text-white transition-colors text-sm">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4">Contact</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li className="text-muted text-sm">support@radiowave.com</li>
              <li className="text-muted text-sm">+1 (555) 123-4567</li>
              <li className="text-muted text-sm">123 Broadcast Street</li>
              <li className="text-muted text-sm">Media City, MC 12345</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center">
          <p className="text-muted text-sm">© {new Date().getFullYear()} RadioWave Broadcasting Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
