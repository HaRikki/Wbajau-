/**
 * Storage Module — LocalStorage management for Premium Bio
 * Architecture ready for future Backend / Cloud Storage integration
 */
const Storage = (() => {
  const KEY = 'premium_bio_data_v1';

  const DEFAULTS = {
    profile: {
      name: 'LG Official',
      bio: 'ទំនាក់ទំនង Admin, Bot SMM និង Channel បានគ្រប់ពេល',
      status: 'Online',
      badge: '',
      logo: 'assets/logo/logo.jpg',
      logoSize: 120,
      logoAnimation: true
    },
    links: [
      { id: 'l1', name: 'LG Admin', url: 'https://t.me/AhGa78', icon: 'telegram', customIcon: '', enabled: true, newTab: false, animation: true },
      { id: 'l2', name: 'LG BOT SMM', url: 'https://t.me/AngKer_smm_Bot', icon: 'telegram', customIcon: '', enabled: true, newTab: false, animation: true },
      { id: 'l3', name: 'LG Channel', url: 'https://t.me/harikki_Channel', icon: 'telegram', customIcon: '', enabled: true, newTab: false, animation: true }
    ],
    music: [
      { id: 'yt-default', title: 'That Girl', artist: 'S.P YT', src: 'youtube:QbQyjbXr-No', type: 'youtube', enabled: true }
    ],
    background: {
      type: 'video', // none | image | video
      image: '',
      video: 'assets/background/bg.mp4',
      mobileImage: '',
      mobileVideo: '',
      overlay: 0.35,
      brightness: 1,
      blur: 0,
      opacity: 1,
      scale: 1,
      position: 'center',
      loop: true,
      autoplay: true
    },
    appearance: {
      theme: 'dark',
      font: 'system',
      fontSize: 16,
      buttonSize: 58,
      borderRadius: 50,
      glow: true,
      shadow: true,
      animationSpeed: 1
    },
    effects: {
      emojiTrail: false,
      particles: false,
      cursor: true,
      touch: true,
      click: true,
      hearts: false,
      stars: false,
      snow: false,
      musicNotes: false,
      density: 0.6,
      speed: 1,
      size: 1,
      emojis: ['•', '◦', '○', '◎', '●', '+', '×']
    },
    popup: {
      enabled: false,
      title: '',
      description: '',
      image: '',
      buttonText: '',
      buttonLink: '',
      mode: 'session' // every | session | day
    },
    settings: {
      title: '',
      favicon: '',
      loadingDuration: 2000,
      autoPlayMusic: true,
      autoNext: true,
      defaultVolume: 70,
      soundEffects: false,
      maintenanceMode: false,
      customCursor: false,
      disableTextSelection: false,
      disableRightClick: false,
      seoDescription: ''
    },
    security: {
      passwordHash: '', // will be set on first load
      autoLogout: false,
      sessionTimeout: 30, // minutes
      loginAttempts: 0,
      maxAttempts: 5,
      locked: false
    },
    analytics: {
      totalClicks: 0,
      linkClicks: {},
      musicPlays: {},
      visits: 0
    },
    media: {
      images: [],
      videos: [],
      audio: [],
      logos: [],
      icons: []
    }
  };

  // Simple hash for demo (not production secure)
  function simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return 'h' + Math.abs(h).toString(36);
  }

  function isAdminContext() {
    try {
      return /admin\.html$/i.test(location.pathname) || sessionStorage.getItem('admin_auth') === '1';
    } catch (e) { return false; }
  }

  /* Public visitors read config.js (if filled in); admins always read their own LocalStorage. */
  function load() {
    const remote = window.__REMOTE_CONFIG__;
    if (remote && typeof remote === 'object' && !isAdminContext()) {
      const merged = deepMerge(structuredClone(DEFAULTS), structuredClone(remote));
      const local = loadLocal();                       /* keep the real password hash + analytics from this browser */
      merged.security = Object.assign({}, merged.security, { passwordHash: merged.security.passwordHash || local.security.passwordHash });
      merged.analytics = local.analytics;
      return merged;
    }
    return loadLocal();
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        const data = structuredClone(DEFAULTS);
        data.security.passwordHash = simpleHash('789789');
        save(data);
        return data;
      }
      const data = JSON.parse(raw);
      // Merge with defaults for missing keys
      return deepMerge(structuredClone(DEFAULTS), data);
    } catch (e) {
      console.warn('Storage load error', e);
      return structuredClone(DEFAULTS);
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Storage save error (quota?)', e);
      return false;
    }
  }

  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  function exportData() {
    const data = load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `premium-bio-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      save(data);
      return true;
    } catch {
      return false;
    }
  }

  function reset() {
    localStorage.removeItem(KEY);
    const data = structuredClone(DEFAULTS);
    data.security.passwordHash = simpleHash('789789');
    save(data);
    return data;
  }

  function verifyPassword(pw) {
    const data = loadLocal();
    return (data.security.passwordHash || simpleHash('789789')) === simpleHash(pw);
  }

  function setPassword(pw) {
    const data = loadLocal();
    data.security.passwordHash = simpleHash(pw);
    data.security.loginAttempts = 0;
    data.security.locked = false;
    save(data);
  }

  return { load, loadLocal, save, exportData, importData, reset, verifyPassword, setPassword, simpleHash, DEFAULTS, KEY };
})();
