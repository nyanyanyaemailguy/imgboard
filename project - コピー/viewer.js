const THREAD_FILE = 'threads.json';

async function loadThreads() {
  const res = await fetch(THREAD_FILE);
  const threads = await res.json();
  displayThreads(threads);
}

function displayThreads(threads) {
  const area = document.getElementById('threadArea');
  area.innerHTML = '';
  threads.forEach(t => {
    const table = document.createElement('table');
    table.border = "1";
    const row = table.insertRow();
    const cell1 = row.insertCell();
    const cell2 = row.insertCell();

    if (t.image) {
      const img = document.createElement('img');
      img.src = t.image;
      img.style.maxWidth = '200px';
      cell1.appendChild(img);
    }

    const date = document.createElement('div');
    date.textContent = t.date;
    const msg = document.createElement('div');
    msg.textContent = t.message;
    cell2.appendChild(date);
    cell2.appendChild(msg);

    area.appendChild(table);
  });
}

function generateID() {
  return btoa(new Date().toDateString()).slice(0,3) + Math.random().toString(36).slice(2, 9);
}

document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim() || '名無し';
  const image = document.getElementById('imageURL').value.trim();
  const message = document.getElementById('message').value.trim();
  const uid = generateID();
  const now = new Date();
  const dateStr = `${now.getFullYear()}年 ${now.getMonth()+1}月 ${now.getDate()}日 ${now.getHours()}時${now.getMinutes()}分`;
  
  const res = await fetch(THREAD_FILE);
  const threads = await res.json();
  const newPost = {
    id: threads.length + 1,
    name,
    uid,
    date: `${threads.length + 1}.${name} (${uid}) ${dateStr}`,
    image,
    message
  };

  threads.push(newPost);

  await fetch(THREAD_FILE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(threads)
  });

  loadThreads();
  document.getElementById('postForm').reset();
});

loadThreads();
