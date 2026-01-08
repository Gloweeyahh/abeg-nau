(() => {
  const createBtn = document.getElementById('createBtn');
  const importBtn = document.getElementById('importBtn');
  const connectBtn = document.getElementById('connectBtn');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const output = document.getElementById('output');

  function openModal(title, bodyHtml){
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modal.classList.remove('hidden');
  }
  function close(){ modal.classList.add('hidden'); modalBody.innerHTML = '' }
  closeModal.addEventListener('click', close);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) close() });

  function showOutput(html){ output.innerHTML = html }

  createBtn.addEventListener('click', ()=>{
    // create random wallet using ethers
    const wallet = window.ethers.Wallet.createRandom();
    const mnemonic = wallet.mnemonic?.phrase || '';
    const address = wallet.address;
    const body = `
      <p><strong>Mnemonic (seed phrase)</strong></p>
      <pre class="seed">${mnemonic}</pre>
      <p><strong>Address</strong> ${address}</p>
      <div style="margin-top:12px"><button id="copySeed" class="btn">Copy Seed</button>
      <button id="done" class="btn primary" style="margin-left:8px">Done</button></div>
      <p style="margin-top:12px;color:#9aa4b2;font-size:13px">Keep this seed safe. Do not share. This demo stores nothing.</p>
    `;
    openModal('Create Wallet', body);
    document.getElementById('copySeed').addEventListener('click', ()=>{
      navigator.clipboard.writeText(mnemonic).then(()=>alert('Seed copied')); 
    });
    document.getElementById('done').addEventListener('click', ()=>{
      close();
      showOutput(`<p>Created wallet <strong>${address}</strong>. Use Import to restore.</p>`);
    });
  });

  importBtn.addEventListener('click', ()=>{
    const body = `
      <p>Paste your mnemonic (12 or 24 words)</p>
      <textarea id="importSeed" rows="3" style="width:100%;padding:8px;border-radius:8px;background:#031018;color:#dff7ea"></textarea>
      <div style="margin-top:12px"><button id="doImport" class="btn primary">Import</button></div>
      <p style="margin-top:12px;color:#9aa4b2;font-size:13px">This demo extracts the address locally using ethers.js only.</p>
    `;
    openModal('Import Wallet', body);
    document.getElementById('doImport').addEventListener('click', ()=>{
      const seed = document.getElementById('importSeed').value.trim();
      try{
        const w = window.ethers.Wallet.fromPhrase(seed);
        showOutput(`<p>Imported wallet <strong>${w.address}</strong></p>`);
        close();
      }catch(err){
        alert('Invalid mnemonic');
      }
    });
  });

  connectBtn.addEventListener('click', async ()=>{
    if(window.ethereum){
      try{
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        showOutput(`<p>Connected: <strong>${accounts[0]}</strong></p>`);
      }catch(err){
        showOutput(`<p style="color:#ff9b9b">Connection rejected</p>`);
      }
    }else{
      showOutput('<p>No injected wallet found. Install MetaMask or use WalletConnect (not wired in demo).</p>');
    }
  });

  // small onboarding hint
  showOutput('<p>Try creating a wallet to see a generated seed phrase. This is a local demo — do not use real funds with test seeds here.</p>');
})();
