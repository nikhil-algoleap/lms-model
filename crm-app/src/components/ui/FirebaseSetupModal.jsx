import React, { useState } from 'react';
import { Modal } from './Modal';
import { Database, Key, FileText, CheckCircle, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

export function FirebaseSetupModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  const envTemplate = `# Firebase Configuration Environment Variables
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Firebase Database">
      <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
        {/* Intro */}
        <p className="text-slate-500">
          This application supports real-time synchronization with Google Cloud Firestore. Follow these steps to connect your own Firebase project.
        </p>

        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-semibold border border-blue-100">
            1
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              Create a Firebase Project
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:underline font-normal"
              >
                Open Console <ExternalLink className="w-3 h-3" />
              </a>
            </h4>
            <p className="text-slate-500 mt-1">
              Go to the Firebase Console, click **Add project**, and follow the instructions to create a new project.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-semibold border border-blue-100">
            2
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              Create a Firestore Database
            </h4>
            <p className="text-slate-500 mt-1">
              In your Firebase project sidebar, click **Build &gt; Firestore Database**, then click **Create database**. Start in **Test mode** for initial testing.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-semibold border border-blue-100">
            3
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">
              Register a Web App
            </h4>
            <p className="text-slate-500 mt-1">
              Go to **Project Settings** (gear icon) &gt; **General**. Scroll down to **Your apps**, click the web icon (<code>&lt;/&gt;</code>), register your app, and copy the <code>firebaseConfig</code> object.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-semibold border border-blue-100">
            4
          </div>
          <div className="w-full">
            <h4 className="font-semibold text-slate-800">
              Create a .env File
            </h4>
            <p className="text-slate-500 mt-1">
              Create a file named <code>.env</code> in the root of your project and paste your keys in the following format:
            </p>

            <div className="relative mt-3 group bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-[11px] select-all border border-slate-800">
              <button
                onClick={copyToClipboard}
                className="absolute right-3 top-3 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all border border-slate-700/50"
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <pre className="overflow-x-auto whitespace-pre-wrap pr-8">{envTemplate}</pre>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">
              Restart Development Server
            </h4>
            <p className="text-slate-500 mt-1">
              Once you save the <code>.env</code> file, restart your development server. The app will automatically connect and seed the mock data if the database is empty!
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
