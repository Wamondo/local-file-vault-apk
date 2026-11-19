import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

const VAULT_DIR = 'vault_files';
const fileInput = document.getElementById('fileInput');
const saveBtn = document.getElementById('saveBtn');
const fileList = document.getElementById('fileList');

async function ensureDir() {
  try {
    await Filesystem.mkdir({
      path: VAULT_DIR,
      directory: Directory.Data,
      recursive: true
    });
  } catch (e) {
    // Directory may already exist
  }
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function loadFiles() {
  await ensureDir();
  try {
    const res = await Filesystem.readdir({
      path: VAULT_DIR,
      directory: Directory.Data
    });
    if (!res.files.length) {
      fileList.innerHTML = '<li>No files stored yet.</li>';
      return;
    }
    fileList.innerHTML = '';
    for (const item of res.files) {
      const name = typeof item === 'string' ? item : item.name;
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = name;
      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.className = 'del';
      del.onclick = async () => {
        await Filesystem.deleteFile({
          path: `${VAULT_DIR}/${name}`,
          directory: Directory.Data
        });
        loadFiles();
      };
      li.appendChild(span);
      li.appendChild(del);
      fileList.appendChild(li);
    }
  } catch (err) {
    fileList.innerHTML = `<li>Error reading files: ${err.message}</li>`;
  }
}

saveBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert('Please choose a file first.');
    return;
  }
  const buffer = await file.arrayBuffer();
  const base64Data = arrayBufferToBase64(buffer);
  await ensureDir();
  await Filesystem.writeFile({
    path: `${VAULT_DIR}/${file.name}`,
    data: base64Data,
    directory: Directory.Data
  });
  fileInput.value = '';
  loadFiles();
});

loadFiles();
