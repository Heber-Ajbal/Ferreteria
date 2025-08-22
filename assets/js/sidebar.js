// // assets/js/sidebar.js
// (() => {
//   class SiteSidebar extends HTMLElement {
//     connectedCallback() {
//       const brandName = this.getAttribute('brand') || 'El Tornillo Feliz';
//       const logo = this.getAttribute('logo') || 'assets/img/logo.svg';

//       // Markup del sidebar
//       this.innerHTML = `
//         <nav class="sidebar">
//           <div class="brand">
//             <b>${brandName}</b>
//           </div>
//           <ul class="sb-nav">
//             <li><a href="login_ferreteria.html"><span class="ico">👤</span><span class="label">Login</span></a></li>
//             <li><a href="index.html"><span class="ico">🏠</span><span class="label">Inicio</span></a></li>
//             <li><a href="products.html"><span class="ico">📦</span><span class="label">Productos</span></a></li>
//             <li><a href="services.html"><span class="ico">🔧</span><span class="label">Servicios</span></a></li>
//             <li><a href="contact.html"><span class="ico">✉️</span><span class="label">Contacto</span></a></li>
//             <li><a href="privacy.html"><span class="ico">🛡️</span><span class="label">Privacidad</span></a></li>
//             <li>
//               <a class="btn btn-ghost" href="contact.html#cotizacion" title="Carrito de cotización">
//                 Cotización
//                 <span class="badgems-2"><span data-quote-count>0</span></span>
//               </a>
//             </li>            
//           </ul>
//         </nav>
//       `;

//       this._setActiveLink();
//       this._wireQuoteBadge();
//     }

//     _setActiveLink() {
//       const getFile = (p) => {
//         const clean = (p || '').split('/').pop().split('?')[0].split('#')[0];
//         return clean || 'index.html';
//       };
//       const current = getFile(location.pathname);

//       this.querySelectorAll('a[href]').forEach(a => {
//         try {
//           const href = a.getAttribute('href') || '';
//           const file = getFile(href);
//           const isIndex = (file === 'index.html' && (current === '' || current === 'index.html'));
//           const isSame = (file === current);
//           const isHashMatch = href.includes('#') && location.href.endsWith(href);
//           if (isIndex || isSame || isHashMatch) {
//             a.classList.add('active');
//             a.setAttribute('aria-current', 'page');
//           }
//         } catch { /* noop */ }
//       });
//     }

//     _wireQuoteBadge() {
//       const badge = this.querySelector('[data-quote-count]');
//       const readCount = () => {
//         try {
//           // Si tienes una función global, úsala
//           if (typeof window.getQuoteCount === 'function') return window.getQuoteCount();
//           // Fallback: localStorage
//           const raw = localStorage.getItem('quote_items') || localStorage.getItem('quote') || '[]';
//           const arr = JSON.parse(raw);
//           if (Array.isArray(arr)) return arr.reduce((s, x) => s + (x.qty || 1), 0);
//         } catch { /* noop */ }
//         return 0;
//       };
//       const refresh = () => { if (badge) badge.textContent = readCount(); };
//       refresh();
//       // Para que tu addToQuote() lo use:
//       window.updateQuoteBadge = refresh;
//     }
//   }

//   // Evita definirlo dos veces
//   if (!customElements.get('site-sidebar')) {
//     customElements.define('site-sidebar', SiteSidebar);
//   }
// })();

// assets/js/sidebar.js
// assets/js/sidebar.js
(() => {
  class SiteSidebar extends HTMLElement {
    connectedCallback() {
      const brandName = this.getAttribute('brand') || 'El Tornillo Feliz';
      const logo = this.getAttribute('logo') || 'assets/img/logo.svg';

      this.innerHTML = `
        <!-- Topbar visible SOLO en móvil -->
        <div class="sb-topbar">
          <button class="sb-hamburger" id="sbHamburger" aria-label="Abrir menú" aria-expanded="false" aria-controls="sbPanel">
            <span></span><span></span><span></span>
          </button>
          <a class="brand" href="index.html">
            <b>${brandName}</b>
          </a>
        </div>

        <!-- Sidebar (desktop fijo / móvil off-canvas) -->
        <nav class="sidebar" id="sbPanel" aria-hidden="true">
          <div class="brand">
            <b>${brandName}</b>
          </div>
          <ul class="sb-nav">
            <li><a href="login_ferreteria.html"><span class="ico">👤</span><span class="label">Login</span></a></li>
            <li><a href="index.html"><span class="ico">🏠</span><span class="label">Inicio</span></a></li>
            <li><a href="products.html"><span class="ico">📦</span><span class="label">Productos</span></a></li>
            <li><a href="services.html"><span class="ico">🔧</span><span class="label">Servicios</span></a></li>
            <li><a href="contact.html"><span class="ico">✉️</span><span class="label">Contacto</span></a></li>
            <li><a href="privacy.html"><span class="ico">🛡️</span><span class="label">Privacidad</span></a></li>
            <li>
              <a class="btn btn-ghost" href="contact.html#cotizacion" title="Carrito de cotización">
                Cotización
                <span class="badgems-2"><span data-quote-count>0</span></span>
              </a>
            </li>
          </ul>
        </nav>
      `;

      // Backdrop global
      this._backdrop = document.createElement('div');
      this._backdrop.className = 'sb-backdrop';
      document.body.appendChild(this._backdrop);

      this._sidebar = this.querySelector('#sbPanel');
      this._hamburger = this.querySelector('#sbHamburger');

      // Wire eventos
      this._bindEvents();
      this._setActiveLink();
      this._wireQuoteBadge();
      this._onResize(); // estado inicial correcto
      window.addEventListener('resize', () => this._onResize(), { passive: true });
    }

    _bindEvents() {
      const open = () => {
        this._sidebar.classList.add('is-open');
        this._backdrop.classList.add('is-open');
        this._hamburger.setAttribute('aria-expanded', 'true');
        this._sidebar.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      };
      const close = () => {
        this._sidebar.classList.remove('is-open');
        this._backdrop.classList.remove('is-open');
        this._hamburger.setAttribute('aria-expanded', 'false');
        this._sidebar.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };
      const toggle = () => (this._sidebar.classList.contains('is-open') ? close() : open());

      this._open = open;
      this._close = close;

      this._hamburger.addEventListener('click', toggle);
      this._backdrop.addEventListener('click', close);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });

      // Cerrar al navegar
      this._sidebar.querySelectorAll('.sb-nav a').forEach(a => {
        a.addEventListener('click', () => {
          // solo cerrar si estamos en móvil
          if (window.matchMedia('(max-width: 980px)').matches) this._close();
        });
      });
    }

    _onResize() {
      const isMobile = window.matchMedia('(max-width: 980px)').matches;
      if (!isMobile) {
        // Estado desktop: sin overlay, sin bloqueo de scroll
        this._close();
      }
    }

    _setActiveLink() {
      const getFile = (p) => {
        const clean = (p || '').split('/').pop().split('?')[0].split('#')[0];
        return clean || 'index.html';
      };
      const current = getFile(location.pathname);
      this.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href') || '';
        const file = getFile(href);
        const isIndex = (file === 'index.html' && (current === '' || current === 'index.html'));
        const isSame = (file === current);
        const isHashMatch = href.includes('#') && location.href.endsWith(href);
        if (isIndex || isSame || isHashMatch) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        }
      });
    }

    _wireQuoteBadge() {
      const badge = this.querySelector('[data-quote-count]');
      const readCount = () => {
        try {
          if (typeof window.getQuoteCount === 'function') return window.getQuoteCount();
          const raw = localStorage.getItem('quote_items') || localStorage.getItem('quote') || '[]';
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) return arr.reduce((s, x) => s + (x.qty || 1), 0);
        } catch {}
        return 0;
      };
      const refresh = () => { if (badge) badge.textContent = readCount(); };
      refresh();
      window.updateQuoteBadge = refresh;
    }
  }

  if (!customElements.get('site-sidebar')) {
    customElements.define('site-sidebar', SiteSidebar);
  }
})();
