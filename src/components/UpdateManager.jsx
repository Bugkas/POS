import React, { useState, useEffect } from 'react';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Network } from '@capacitor/network';
import { RefreshCw, X, Download } from 'lucide-react';

const UpdateManager = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [downloadedBundle, setDownloadedBundle] = useState(null);

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
        const update = await CapacitorUpdater.check();
        
        if (update && update.url) {
          // 4. Download the update in the background
          const bundle = await CapacitorUpdater.download({
            url: update.url,
            version: update.version,
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
    const listener = CapacitorUpdater.addListener('updateDownloaded', (bundle) => {
      setDownloadedBundle(bundle);
      setShowUpdateModal(true);
    });

    return () => {
      listener.remove();
    };
  }, []);

  const handleUpdateNow = async () => {
    if (!downloadedBundle) return;
    try {
      // Apply the update and reload the app
      await CapacitorUpdater.set({ id: downloadedBundle.id });
    } catch (error) {
      console.error('Failed to apply update:', error);
      setShowUpdateModal(false);
    }
  };

  const handleUpdateLater = () => {
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

        <div className="update-modal-actions">
          <button 
            className="btn-update btn-update-later" 
            onClick={handleUpdateLater}
          >
            <X size={20} />
            Not Now
          </button>
          
          <button 
            className="btn-update btn-update-now" 
            onClick={handleUpdateNow}
          >
            <RefreshCw size={20} />
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateManager;
