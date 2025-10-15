// Simple demo behavior (no real payments).
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('purchaseForm');
  const overlay = document.getElementById('overlay');
  const tick = document.getElementById('tick');
  const closeBtn = document.getElementById('closeBtn');
  const accountsInput = document.getElementById('accountsInput');
  const balanceEl = document.getElementById('balance');

  // card input formatting
  const cardInput = document.getElementById('cardInput');
  cardInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/[^0-9]/g, '');
    v = v.match(/.{1,4}/g)?.join(' ') || v;
    e.target.value = v;
  });

  const exp = document.getElementById('exp');
  exp.addEventListener('input', (e) => {
    let v = e.target.value.replace(/[^0-9]/g, '');
    if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2,4);
    e.target.value = v;
  });

  document.querySelectorAll('.fake-account').forEach(label => {
    label.addEventListener('click', () => {
      const inp = label.querySelector('input');
      inp.checked = true;
      const val = inp.value;
      if (val === 'visa1') cardInput.value = '7532 **** **** ****';
      else if (val === 'mc1') cardInput.value = '5555 **** **** ****';
      else cardInput.value = '';
    });
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const pack = form.pack.value;
    const accounts = accountsInput.value.split('\n').map(s => s.trim()).filter(Boolean);
    if (accounts.length === 0) {
      alert('من فضلك اكتب الحسابات المستهدفة (سطر واحد لكل حساب).');
      return;
    }
    const fakeChosen = document.querySelector('input[name="fakeAccount"]:checked')?.value || 'none';

    overlay.classList.remove('hidden');
    tick.classList.add('show');

    try {
      const current = arabicToNumber(balanceEl.textContent);
      const newBal = Math.max(0, current - Number(pack));
      balanceEl.textContent = numberToArabicFormat(newBal);
    } catch(e){/* ignore */ }

    // show chosen pack price in console (for demo)
    const selectedPackEl = document.querySelector('input[name="pack"]:checked').closest('.pack');
    const price = selectedPackEl?.getAttribute('data-price') || '—';
    console.log('عرض واجهة:', {pack, accounts, fakeChosen, price});
  });

  closeBtn.addEventListener('click', () => {
    document.getElementById('overlay').classList.add('hidden');
    tick.classList.remove('show');
  });

  function arabicToNumber(s){
    const map = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'};
    let out = '';
    for (const ch of s){
      if (map[ch]) out += map[ch];
      else if (ch >= '0' && ch <= '9') out += ch;
    }
    return Number(out);
  }

  function numberToArabicFormat(n){
    const parts = Math.round(n).toString().split('').reverse().join('').match(/.{1,3}/g).map(s=>s.split('').reverse().join('')).reverse();
    const western = parts.join('.');
    const map = {'0':'٠','1':'١','2':'٢','3':'٣','4':'٤','5':'٥','6':'٦','7':'٧','8':'٨','9':'٩'};
    return western.split('').map(ch => map[ch] || ch).join('');
  }
});
