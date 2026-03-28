function el(q){ return document.querySelector(q); }
function ell(q){ return Array.from(document.querySelectorAll(q)); }

async function apiGET(path){ const res = await fetch(path); return res.json(); }
async function apiPOST(path, body){ const token = localStorage.getItem('scrms_token'); const res = await fetch(path, {method:'POST',headers:{'Content-Type':'application/json','Authorization': token?`Bearer ${token}`:''},body:JSON.stringify(body)}); return res.json(); }
async function apiPUT(path, body){ const token = localStorage.getItem('scrms_token'); const res = await fetch(path, {method:'PUT',headers:{'Content-Type':'application/json','Authorization': token?`Bearer ${token}`:''},body:JSON.stringify(body)}); return res.json(); }
async function apiDEL(path){ const token = localStorage.getItem('scrms_token'); const res = await fetch(path, {method:'DELETE',headers:{'Authorization': token?`Bearer ${token}`:''}}); return res.json(); }

document.addEventListener('DOMContentLoaded', ()=>{
  if(!el('#resource-list')) return;
  const listEl = el('#resource-list');
  const search = el('#search');
  const refresh = el('#refresh');
  const addBtn = el('#add-btn');
  const editor = el('#editor');
  const form = el('#resource-form');
  let editingId = null;

  async function load(){
    const items = await apiGET('/api/resources');
    render(items);
  }

  function render(items){
    const q = search.value.trim().toLowerCase();
    const filtered = items.filter(i=> !q || (i.title+i.type+i.location+i.description).toLowerCase().includes(q));
    listEl.innerHTML = '';
    filtered.forEach(i=>{
      const d = document.createElement('div'); d.className='resource';
      const statusClass = i.status && i.status.toLowerCase().includes('unavail') ? 'status-unavailable' : (i.status && i.status.toLowerCase().includes('reserved') ? 'status-reserved' : 'status-available');
      const badge = `<span class="status-badge ${statusClass}">${i.status}</span>`;
      d.innerHTML = `<h4>${i.title} <small style="color:var(--muted);font-size:12px">${i.type}</small></h4><p style="margin:6px 0">${i.location} • ${badge}</p><p style="color:var(--muted)">${i.description||''}</p>`;
      const tools = document.createElement('div'); tools.style.marginTop='10px';
      const edit = document.createElement('button'); edit.textContent='Edit'; edit.className='btn outline'; edit.onclick = ()=>openEditor(i);
      const del = document.createElement('button'); del.textContent='Delete'; del.className='btn'; del.style.marginLeft='8px'; del.onclick = async ()=>{ if(confirm('Delete?')){ await apiDEL('/api/resources/'+i.id); load(); } };
      tools.appendChild(edit); tools.appendChild(del); d.appendChild(tools);
      listEl.appendChild(d);
    });
  }

  function openEditor(item){
    editingId = item? item.id: null;
    el('#editor-title').textContent = item? 'Edit Resource' : 'Add Resource';
    el('#r-title').value = item? item.title : '';
    el('#r-type').value = item? item.type : '';
    el('#r-location').value = item? item.location : '';
    el('#r-status').value = item? item.status : 'available';
    el('#r-desc').value = item? item.description : '';
    editor.classList.remove('hidden');
  }

  function closeEditor(){ editor.classList.add('hidden'); editingId = null; }

  addBtn.onclick = ()=> openEditor(null);
  el('#cancel').onclick = closeEditor;

  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const payload = { title: el('#r-title').value, type: el('#r-type').value, location: el('#r-location').value, status: el('#r-status').value, description: el('#r-desc').value };
    if(editingId){ await apiPUT('/api/resources/'+editingId, payload); }
    else { await apiPOST('/api/resources', payload); }
    closeEditor(); load();
  });

  refresh.onclick = load;
  search.addEventListener('input', load);
  load();
});
