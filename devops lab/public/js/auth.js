// Simple auth helpers
const API = '';
function setToken(t){ localStorage.setItem('scrms_token', t); updateAuthLink(); }
function getToken(){ return localStorage.getItem('scrms_token'); }
function clearToken(){ localStorage.removeItem('scrms_token'); updateAuthLink(); }

function updateAuthLink(){
  const a = document.getElementById('auth-link');
  if(!a) return;
  const t = getToken();
  if(t){ a.textContent = 'Sign out'; a.href = '#'; a.onclick = e=>{ e.preventDefault(); clearToken(); window.location = '/'; } }
  else { a.textContent = 'Sign in'; a.href = '/signin.html'; a.onclick = null }
}

async function postJSON(url, body){
  const res = await fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  return res.json();
}

document.addEventListener('DOMContentLoaded', ()=>{
  updateAuthLink();
  const signup = document.getElementById('signup-form');
  const signin = document.getElementById('signin-form');

  if(signup){
    signup.addEventListener('submit', async e=>{
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const r = await postJSON('/api/signup', {name,email,password});
      if(r.token){ setToken(r.token); window.location = '/'; }
      else alert(r.error || 'Signup failed');
    });
  }

  if(signin){
    signin.addEventListener('submit', async e=>{
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const r = await postJSON('/api/login', {email,password});
      if(r.token){ setToken(r.token); window.location = '/'; }
      else alert(r.error || 'Login failed');
    });
  }
});
