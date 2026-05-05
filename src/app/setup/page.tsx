'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SetupPage() {
  const [copied, setCopied] = useState(false);

  const envExample = `NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=optional_measurement_id`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">MadadWala Setup</h1>
            <p className="text-slate-400">Configure Firebase to get started</p>
          </div>

          {/* Demo Mode Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-amber-200 text-sm">
              <strong>Demo Mode:</strong> The application is running without Firebase configuration. 
              Set up your Firebase project to enable authentication, database operations, and file uploads.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6">
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="bg-primary text-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
                Create Firebase Project
              </h2>
              <p className="text-slate-300 text-sm">
                Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Console</a> and create a new project.
              </p>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="bg-primary text-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                Get Firebase Credentials
              </h2>
              <p className="text-slate-300 text-sm mb-4">
                In Firebase Console, go to Project Settings → General and copy your web app credentials.
              </p>
              <div className="bg-slate-800 rounded p-3 text-xs font-mono overflow-x-auto space-y-1">
                {envExample.split('\n').map((line, i) => (
                  <div key={i} className="text-slate-400">{line}</div>
                ))}
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full bg-primary hover:bg-primary/90 text-dark font-semibold py-2 rounded transition"
              >
                {copied ? '✓ Copied!' : 'Copy to Clipboard'}
              </button>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="bg-primary text-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                Create .env.local File
              </h2>
              <p className="text-slate-300 text-sm">
                Create a <code className="bg-slate-800 px-2 py-1 rounded text-amber-300">.env.local</code> file in the project root and paste your credentials.
              </p>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="bg-primary text-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</span>
                Enable Firebase Services
              </h2>
              <ul className="text-slate-300 text-sm space-y-2 list-disc list-inside">
                <li>Enable <strong>Authentication</strong> (Email/Password + Google)</li>
                <li>Enable <strong>Firestore Database</strong> (Start in test mode)</li>
                <li>Enable <strong>Cloud Storage</strong></li>
              </ul>
            </div>

            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="bg-primary text-dark rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</span>
                Restart Dev Server
              </h2>
              <p className="text-slate-300 text-sm">
                Stop and restart your development server for the environment variables to take effect.
              </p>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Helpful Resources</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="https://firebase.google.com/docs/web/setup" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Firebase Setup Guide →
                </a>
              </li>
              <li>
                <a href="/DEPLOYMENT.md" className="text-primary hover:underline">
                  Deployment Documentation →
                </a>
              </li>
              <li>
                <a href="/DEVELOPMENT.md" className="text-primary hover:underline">
                  Development Guide →
                </a>
              </li>
            </ul>
          </div>

          {/* Back Link */}
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded text-center transition"
            >
              Back to App
            </Link>
            <Link
              href="/login"
              className="flex-1 bg-primary hover:bg-primary/90 text-dark font-semibold py-3 rounded text-center transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
