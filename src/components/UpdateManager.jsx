import React, { useState, useEffect } from 'react';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Network } from '@capacitor/network';
import { RefreshCw, X, Download } from 'lucide-react';
import pkg from '../../package.json';

const UpdateManager = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [downloadedBundle, setDownloadedBundle] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const initializeUpdateLogic = async () => {
      try {
        // 1. Notify that the current app version is ready and working
        // This prevents Capgo from rolling back to a previous version
        await CapacitorUpdater.notifyAppReady();

        // 2. Check network status - fail silently if offline
        const status = await Network.getStatus();
        if (!status.connected) return;

        // 3. Check for updates silently
        const current = await CapacitorUpdater.current();
        const latest = await CapacitorUpdater.getLatest({ channel: 'production' });
        
        const currentVer = (current.version && current.version !== 'builtin') ? current.version : pkg.version;
        
        if (latest && latest.url && currentVer !== latest.version) {
          if (sessionStorage.getItem('skipUpdate') === 'true') return;
          // 4. Download the update in the background
          const bundle = await CapacitorUpdater.download({
            url: latest.url,
            version: latest.version,
          });
          
          if (bundle) {
            setDownloadedBundle(bundle);
            setShowUpdateModal(true);
          }
        }
      } catch (error) {
        // Fail silently as per requirements
        console.warn('Update check failed:', error);
      }
    };

    initializeUpdateLogic();

    // Also listen for any updates downloaded in the background (if configured elsewhere)
    let listenerHandle = null;
    
    // Resolve the promise to safely store the handle
    CapacitorUpdater.addListener('updateDownloaded', (bundle) => {
      if (sessionStorage.getItem('skipUpdate') === 'true') return;
      setDownloadedBundle(bundle);
      setShowUpdateModal(true);
    }).then((handle) => {
      listenerHandle = handle;
    });

    return () => {
      if (listenerHandle) listenerHandle.remove();
    };
  }, []);

  const handleUpdateNow = async () => {
    if (!downloadedBundle) return;
    
    // The bundle object might be directly the bundle or nested inside { bundle: ... } 
    // depending on whether it came from .download() or the event listener
    const updateId = downloadedBundle.id || (downloadedBundle.bundle && downloadedBundle.bundle.id);
    
    if (!updateId) {
      setErrorMsg("Error: Could not find update ID in the downloaded bundle.");
      return;
    }

    setIsUpdating(true);
    setErrorMsg(null);
    try {
      // Apply the update and reload the app
      await CapacitorUpdater.set({ id: updateId });
    } catch (error) {
      console.error('Failed to apply update:', error);
      setErrorMsg(error.message || 'Failed to apply update');
      setIsUpdating(false);
    }
  };

  const handleUpdateLater = () => {
    sessionStorage.setItem('skipUpdate', 'true');
    setShowUpdateModal(false);
  };

  if (!showUpdateModal) return null;

  return (
    <div className="update-modal-backdrop">
      <div className="update-modal-card">
        <div className="update-icon-wrapper">
          <Download size={40} />
        </div>
        
        <h2>Update Available</h2>
        <p>
          A new version of the app is ready! <br />
          Would you like to restart and apply the update now?
        </p>

        <div className="update-modal-actions" style={{ flexWrap: 'wrap' }}>
          {errorMsg && (
            <div style={{ width: '100%', color: 'var(--danger-color)', textAlign: 'center', marginBottom: '12px', fontSize: '0.9rem' }}>
              {errorMsg}
            </div>
          )}
          <button 
            className="btn-update btn-update-later" 
            onClick={handleUpdateLater}
            disabled={isUpdating}
          >
            <X size={20} />
            Not Now
          </button>
          
          <button 
            className="btn-update btn-update-now" 
            onClick={handleUpdateNow}
            disabled={isUpdating}
            style={{ opacity: isUpdating ? 0.7 : 1 }}
          >
            <RefreshCw size={20} className={isUpdating ? 'spin' : ''} />
            {isUpdating ? 'Updating...' : 'Update Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateManager;
