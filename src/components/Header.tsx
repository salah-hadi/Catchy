import React from 'react';
import { Bug, Zap } from 'lucide-react';

function Header() {
  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Bug className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Bug Catcher</h1>
          <p className="text-red-100 text-sm">Capture, Document, Report</p>
        </div>
        <div className="ml-auto">
          <Zap className="w-5 h-5 text-red-200" />
        </div>
      </div>
    </div>
  );
}

export default Header;