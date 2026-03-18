// image-placeholder.js
document.addEventListener('DOMContentLoaded', () => {
  const imgs = Array.from(document.querySelectorAll('img[data-dominant], video[data-dominant]'));
  imgs.forEach(el => {
    const color = el.getAttribute('data-dominant');
    if (!color) return;
    // Compute intrinsic/display size — prefer data attributes, then bounding box or natural size
    const dataW = el.getAttribute('data-width');
    const dataH = el.getAttribute('data-height');
    const rect = el.getBoundingClientRect();
    const intrinsicW = dataW ? Number(dataW) : (el.naturalWidth || el.videoWidth || null);
    const intrinsicH = dataH ? Number(dataH) : (el.naturalHeight || el.videoHeight || null);

    // Apply placeholder to the nearest non-replaced ancestor (parent) so pseudo-element can be used.
    // This avoids creating wrappers and keeps sliders responsive.
    const host = el.parentElement || el;
    host.classList.add('has-placeholder');
    host.style.setProperty('--placeholder-color', color || '#e9e9e9');
    if (intrinsicW && intrinsicH) {
      host.style.aspectRatio = `${intrinsicW} / ${intrinsicH}`;
    }

    // Ensure the media fills the wrapper responsively
    el.style.display = el.style.display || 'block';
    el.style.width = el.style.width || '100%';
    el.style.height = el.style.height || '100%';
    // Start hidden image/video, show on load
    el.style.opacity = '0';
    el.style.transition = 'opacity 300ms';
    const onLoaded = () => {
      el.style.opacity = '1';
      // remove the placeholder marker from host so ::before fades out via CSS
      host.classList.remove('has-placeholder');
      // clear the variable after transition
      setTimeout(() => host.style.removeProperty('--placeholder-color'), 350);
      removeListeners();
    };
    const removeListeners = () => {
      el.removeEventListener('load', onLoaded);
      el.removeEventListener('loadeddata', onLoaded);
    };
    if ((el.tagName === 'IMG' && el.complete) || (el.tagName === 'VIDEO' && el.readyState >= 2)) {
      onLoaded();
    } else {
      el.addEventListener('load', onLoaded, { once: true });
      el.addEventListener('loadeddata', onLoaded, { once: true });
    }
  });
});