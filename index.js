#!/usr/bin/env node
const { Select, Input, MultiSelect } = require('enquirer');
const pc = require('picocolors');
const figlet = require('figlet');
const { execSync } = require('child_process');

async function main() {
  console.clear();
  
  console.log(pc.magenta(figlet.textSync(' LazyCode ', { font: 'Slant' })));
  console.log(pc.cyan("  v1.0\n"));
  console.log(pc.cyan("  Ngapain ngetik kalau bisa milih!\n"));

  try {
    const folderName = await new Input({
      message: 'Project Name:',
      initial: 'lazy-web-app'
    }).run();

    const stack = await new Select({
      name: 'stack',
      message: 'Select Web Stack:',
      choices: [
        { name: 'nextjs', message: 'Next.js (Fullstack / App Router)' },
        { name: 'react', message: 'React (Vite + TS)' },
        { name: 'react-js', message: 'React (Vite + JS)' },
        { name: 'express', message: 'Express.js (Backend API)' },
        { role: 'separator' },
        { name: 'exit', message: 'Exit' }
      ]
    }).run();

    if (stack === 'exit') return;

    const addons = await new MultiSelect({
      message: 'Addons & UI Libraries (Space to select):',
      choices: [
        { name: 'tailwindcss', message: 'Tailwind CSS' },
        { name: 'shadcn', message: 'Shadcn/UI' },
        { name: 'lucide', message: 'Lucide Icons' },
        { name: 'prisma', message: 'Prisma ORM' },
        { name: 'axios', message: 'Axios' }
      ]
    }).run();

    console.log(pc.yellow(`\n⚡ Building ${stack.toUpperCase()}...`));

    const isWindows = process.platform === 'win32';
    const cdCmd = isWindows ? `cd /d ${folderName} &&` : `cd ${folderName} &&`;

    if (stack === 'nextjs') {
      execSync(`npx create-next-app@latest ${folderName} --ts --tailwind --eslint --app --src-dir --no-git`, { stdio: 'inherit' });
    } else if (stack === 'react') {
      execSync(`npm create vite@latest ${folderName} -- --template react-ts`, { stdio: 'inherit' });
    } else if (stack === 'react-js') {
      execSync(`npm create vite@latest ${folderName} -- --template react`, { stdio: 'inherit' });
    } else if (stack === 'express') {
      execSync(`mkdir ${folderName} && ${cdCmd} npm init -y && npm install express`, { stdio: 'inherit', shell: true });
    }

    if (addons.length > 0) {
      console.log(pc.blue(`\n📦 Adding libraries: ${addons.join(', ')}`));
      execSync(`${cdCmd} npm install ${addons.join(' ')}`, { stdio: 'inherit', shell: true });

      if (addons.includes('prisma')) {
        execSync(`${cdCmd} npx prisma init`, { stdio: 'inherit', shell: true });
      }
      if (addons.includes('shadcn')) {
        execSync(`${cdCmd} npx shadcn-ui@latest init -y`, { stdio: 'inherit', shell: true });
      }
    }

    console.log("\n" + pc.green("✔ Project Berhasil Dibuat!"));
    console.log(pc.dim("--------------------------"));
    console.log(`${pc.white('Lanjut ketik:')} ${pc.cyan(`cd ${folderName}`)}`);
    console.log(`${pc.white('Buka editor:')} ${pc.cyan('code .')}`);
    console.log(pc.dim("--------------------------\n"));

  } catch (err) {
    console.log(pc.red('\n✖ Batal.'));
  }
}

main();