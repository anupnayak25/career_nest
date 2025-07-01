// auto-fetcher.js
const simpleGit = require('simple-git');
const path = require('path');

const git = simpleGit(path.resolve(__dirname));

async function autoFetchAndPull() {
  try {
    await git.fetch();

    const status = await git.status();
    if (status.behind > 0) {
      console.log(`[AutoFetcher] Updates found. Pulling...`);
      await git.pull();
      console.log(`[AutoFetcher] Pull completed.`);
    } 
  } catch (err) {
    console.error(`[AutoFetcher] Error:`, err);
  }
}

// Check every 60 seconds
setInterval(autoFetchAndPull, 30 * 1000);

console.log("[AutoFetcher] Running...");
