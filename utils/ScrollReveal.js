import React, { useState, useEffect, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';

const ScrollReveal = React.forwardRef((props, ref) => {
  // Safely initialize viewportHeight
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  const [revealEl, setRevealEl] = useState([]);

  const checkComplete = () => {
    if (typeof document === 'undefined') return true;
    return revealEl.length <= document.querySelectorAll('[class*=reveal-].is-revealed').length;
  };

  const elementIsVisible = (el, offset) => {
    return (el.getBoundingClientRect().top <= viewportHeight - offset);
  };

  const revealElements = () => {
    if (checkComplete()) return;
    for (let i = 0; i < revealEl.length; i++) {
      let el = revealEl[i];
      let revealDelay = el.getAttribute('data-reveal-delay');
      let revealOffset = el.getAttribute('data-reveal-offset') ? el.getAttribute('data-reveal-offset') : '200';
      let listenedEl = el.getAttribute('data-reveal-container')
        ? el.closest(el.getAttribute('data-reveal-container'))
        : el;
      if (elementIsVisible(listenedEl, revealOffset) && !el.classList.contains('is-revealed')) {
        if (revealDelay && revealDelay !== 0) {
          setTimeout(() => {
            el.classList.add('is-revealed');
          }, revealDelay);
        } else {
          el.classList.add('is-revealed');
        }
      }
    }
  };

  useImperativeHandle(ref, () => ({
    init() {
      if (typeof document !== 'undefined') {
        setRevealEl(document.querySelectorAll('[class*=reveal-]'));
      }
    }
  }));

  useEffect(() => {
    // This effect runs only in the browser
    if (revealEl && revealEl.length > 0) {
      if (!checkComplete() && typeof window !== 'undefined') {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
      }
      revealElements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealEl]);

  const handleListeners = () => {
    if (!checkComplete() && typeof window !== 'undefined') return;
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
  };

  const handleScroll = throttle(() => {
    handleListeners();
    revealElements();
  }, 30);

  const handleResize = throttle(() => {
    if (typeof window !== 'undefined') {
      setViewportHeight(window.innerHeight);
    }
  }, 30);

  useEffect(() => {
    // Update on viewportHeight change
    handleListeners();
    revealElements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportHeight]);

  return <>{props.children()}</>;
});

ScrollReveal.propTypes = {
  children: PropTypes.func.isRequired
};

export default ScrollReveal;
