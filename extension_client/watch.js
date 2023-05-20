const chokidar = require('chokidar');
const { exec } = require('child_process');

const watcher = chokidar.watch('src', {
    ignored: /(^|[\/\\])\../,
    persistent: true,
});

watcher.on('ready', () => {
    console.log('Initial scan complete. Ready for changes');
});

watcher.on('all', (event, path) => {
    console.log(`File ${path} was ${event}, running tasks...`);
    exec('npm run build', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
});
