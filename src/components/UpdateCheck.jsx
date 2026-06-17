import React, { useState, useEffect } from 'react';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { RefreshCw, Download, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import pkg from '../../package.json';

export default function UpdateCheck() {
  const [checking, setChecking] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(pkg.version);
  const [status, setStatus] = useState('idle'); // idle, checking, update-available, up-to-date, error
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentVersion();
  }, []);

  const fetchCurrentVersion = async () => {
    try {
      const current = await CapacitorUpdater.current();
      console.log('Current version info:', current);
      
      // If we have a real version from Capgo, use it
      if (current.version && current.version !== 'builtin' && current.version !== 'Unknown') {
        setCurrentVersion(current.version);
      } else if (current.bundle && current.bundle.version && current.bundle.version !== 'builtin') {
        // Handle alternative structure found in some versions/mocks
        setCurrentVersion(current.bundle.version);
      } else {
        // Fallback to package.json version already set in state
        setCurrentVersion(pkg.version);
      }
    } catch (err) {
      console.error('Failed to get current version:', err);
      // Keep package.json version as fallback
    }
  };

  const handleCheckUpdate = async () => {
    setChecking(true);
    setStatus('checking');
    setError(null);
    
    try {
      const current = await CapacitorUpdater.current();
      const latest = await CapacitorUpdater.getLatest({ channel: 'production' });
      
      const currentVer = (current.version && current.version !== 'builtin') ? current.version : pkg.version;
      
      if (latest && latest.url && currentVer !== latest.version) {
        setUpdateInfo(latest);
        setStatus('update-available');
      } else {
        setStatus('up-to-date');
      }
    } catch (err) {
      console.error('Update check failed:', err);
      setError(err.message || 'Failed to connect to update server');
      setStatus('error');
    } finally {
      setChecking(false);
    }
  };

  const handleDownloadUpdate = async () => {
    if (!updateInfo) return;
    
    setStatus('downloading');
    try {
      // Manual download
      const bundle = await CapacitorUpdater.download({
        url: updateInfo.url,
        version: updateInfo.version,
      });
      
      if (bundle) {
        setStatus('ready-to-apply');
        // We could automatically set it here, but it's safer to let the user choose
        // The UpdateManager modal will pick this up if it's listening
      }
    } catch (err) {
      console.error('Download failed:', err);
      setError(err.message || 'Failed to download update');
      setStatus('error');
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>App Updates</h1>
        <p className="subtitle">Manage and check for software updates.</p>
      </header>

      <div className="scrollable-content">
        <div className="stat-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="item-icon-wrapper" style={{ backgroundColor: 'var(--surface-highlight)', color: 'var(--accent-color)' }}>
              <Info size={24} />
            </div>
            <div>
              <span className="stat-label">Current Version</span>
              <h2 className="stat-value">{currentVersion}</h2>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>Update Status</h2>
          
          <div className="update-status-card" style={{ 
            backgroundColor: 'var(--surface-color)', 
            padding: '24px', 
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--surface-highlight)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            {status === 'idle' && (
              <>
                <RefreshCw size={48} className="text-secondary" style={{ opacity: 0.5 }} />
                <p>Check if a new version is available for download.</p>
              </>
            )}

            {status === 'checking' && (
              <>
                <RefreshCw size={48} className="spin" style={{ color: 'var(--accent-color)' }} />
                <p>Connecting to Capgo Cloud...</p>
              </>
            )}

            {status === 'up-to-date' && (
              <>
                <CheckCircle2 size={48} style={{ color: 'var(--success-color)' }} />
                <p>You are running the latest version!</p>
              </>
            )}

            {status === 'update-available' && (
              <>
                <Download size={48} style={{ color: 'var(--accent-color)' }} />
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>New Version Found: {updateInfo.version}</p>
                  <p className="subtitle">An update is available for download.</p>
                </div>
              </>
            )}

            {status === 'downloading' && (
              <>
                <RefreshCw size={48} className="spin" style={{ color: 'var(--accent-color)' }} />
                <p>Downloading update bundle...</p>
              </>
            )}

            {status === 'ready-to-apply' && (
              <>
                <CheckCircle2 size={48} style={{ color: 'var(--success-color)' }} />
                <p>Update downloaded and ready to apply!</p>
                <p className="subtitle">You can apply it via the pop-up or by restarting the app.</p>
              </>
            )}

            {status === 'error' && (
              <>
                <AlertCircle size={48} style={{ color: 'var(--danger-color)' }} />
                <p style={{ color: 'var(--danger-color)' }}>{error}</p>
              </>
            )}

            <div style={{ width: '100%', marginTop: '8px' }}>
              {status === 'update-available' ? (
                <button 
                  className="btn confirm" 
                  onClick={handleDownloadUpdate}
                  style={{ width: '100%' }}
                >
                  <Download size={20} />
                  Download Update
                </button>
              ) : (
                <button 
                  className="btn" 
                  onClick={handleCheckUpdate} 
                  disabled={checking || status === 'downloading'}
                  style={{ 
                    width: '100%', 
                    backgroundColor: checking ? 'var(--surface-highlight)' : 'var(--accent-color)' 
                  }}
                >
                  <RefreshCw size={20} className={checking ? 'spin' : ''} />
                  {checking ? 'Checking...' : 'Check for Updates'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
