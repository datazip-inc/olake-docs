# Accessibility Guidelines for OLake Documentation Site

This document outlines the accessibility improvements implemented and guidelines for maintaining accessibility standards across the OLake documentation site.

## Implemented Accessibility Features

### 1. Form Accessibility ✅

- **Error Association**: Form errors are properly associated with their respective input fields using `aria-describedby`
- **ARIA Invalid**: Input fields are marked with `aria-invalid` when validation fails
- **Live Regions**: Error messages and status updates are announced to screen readers using `role="alert"` and `aria-live="polite"`
- **Icon Accessibility**: Form icons are marked with `aria-hidden="true"` to prevent screen reader confusion

### 2. Color Contrast Improvements ✅

- **Footer Links**: Updated from `#555555` to `#374151` for better contrast (4.5:1 ratio)
- **Search Muted Text**: Improved contrast for better readability
- **High Contrast Support**: Added CSS media query for `prefers-contrast: high`

### 3. Keyboard Navigation ✅

- **Focus Management**: Enhanced focus styles with visible focus rings
- **Tab Order**: Proper tab order maintained across all interactive elements
- **Keyboard Shortcuts**: Custom components support Enter and Space key activation
- **Focus Indicators**: Clear visual focus indicators for all interactive elements

### 4. Screen Reader Support ✅

- **Skip Links**: Added skip-to-content and skip-to-navigation links
- **ARIA Labels**: Comprehensive ARIA labeling for complex components
- **Live Regions**: Dynamic content updates are announced to screen readers
- **Semantic HTML**: Proper use of semantic HTML elements and landmarks

### 5. Content Structure ✅

- **Heading Hierarchy**: Proper H1-H6 heading structure maintained
- **Landmark Roles**: Main content areas marked with appropriate ARIA landmarks
- **Section Labels**: Sections properly labeled with `aria-labelledby`
- **Table Structure**: Tables include proper headers and scope attributes

### 6. Interactive Components ✅

- **Button Semantics**: Custom buttons converted from div to semantic button elements
- **Tooltip Accessibility**: Tooltips properly associated with their triggers
- **Loading States**: Loading indicators include screen reader announcements
- **Icon Accessibility**: Decorative icons marked with `aria-hidden="true"`

### 7. Mobile Accessibility ✅

- **Touch Targets**: Minimum 44px touch target size for mobile devices
- **Responsive Design**: Accessibility features work across all screen sizes
- **Mobile Navigation**: Touch-friendly navigation elements

### 8. Motion Preferences ✅

- **Reduced Motion**: Respects `prefers-reduced-motion` user preference
- **Animation Control**: Animations can be disabled for users with vestibular disorders
- **Smooth Scrolling**: Respects user motion preferences

## CSS Accessibility Utilities

### Screen Reader Utilities

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Focus Styles

```css
.focus-visible:focus {
  outline: 2px solid var(--ifm-color-primary);
  outline-offset: 2px;
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### High Contrast Support

```css
@media (prefers-contrast: high) {
  .markdown a,
  div[class^='docMainContainer_'] a {
    text-decoration: underline;
  }

  button,
  .button {
    border: 2px solid currentColor;
  }
}
```

### Mobile Touch Targets

```css
@media (max-width: 768px) {
  button,
  .button,
  input[type='button'],
  input[type='submit'],
  a[role='button'],
  [role='button'] {
    min-height: 44px;
    min-width: 44px;
  }

  input[type='text'],
  input[type='email'],
  input[type='password'],
  textarea,
  select {
    min-height: 44px;
  }
}
```

## Component Accessibility Patterns

### Form Field Pattern

```jsx
<div>
  <label htmlFor='fieldId' className='mb-1 block text-sm font-medium'>
    Field Label
  </label>
  <div className='flex items-center rounded-md border'>
    <Icon className='ml-3' aria-hidden='true' />
    <input
      type='text'
      id='fieldId'
      name='fieldName'
      className='w-full bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      aria-invalid={hasError}
      aria-describedby={hasError ? 'fieldId-error' : undefined}
      required
    />
  </div>
  {hasError && (
    <div id='fieldId-error' role='alert' aria-live='polite' className='mt-1 text-sm text-red-600'>
      Error message
    </div>
  )}
</div>
```

### Button Pattern

```jsx
<button
  type='button'
  className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  aria-label='Descriptive button label'
  disabled={loading}
>
  {loading ? (
    <>
      <Spinner aria-hidden='true' />
      <span className='sr-only'>Loading...</span>
    </>
  ) : (
    'Button Text'
  )}
</button>
```

### Skip Links Pattern

```jsx
<a
  href='#main-content'
  className='sr-only z-50 rounded-md bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4'
>
  Skip to main content
</a>
```

## Testing Guidelines

### Automated Testing

- Use axe-core for automated accessibility testing
- Run Lighthouse accessibility audits regularly
- Integrate accessibility testing into CI/CD pipeline

### Manual Testing

- Test with keyboard-only navigation (Tab, Enter, Space, Arrow keys)
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Test with high contrast mode enabled
- Test with reduced motion preferences
- Test on mobile devices with touch navigation

### Color Contrast Testing

- Use WebAIM's contrast checker
- Ensure all text meets WCAG AA standards (4.5:1 ratio)
- Test color combinations in both light and dark modes

## Maintenance Checklist

When adding new components or features:

- [ ] Form fields have proper labels and error associations
- [ ] Interactive elements are keyboard accessible
- [ ] Images have appropriate alt text or are marked as decorative
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators are visible and consistent
- [ ] Screen reader announcements work for dynamic content
- [ ] Mobile touch targets meet minimum size requirements
- [ ] Motion respects user preferences
- [ ] Semantic HTML structure is maintained
- [ ] ARIA attributes are used appropriately

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)

## Contact

For accessibility questions or issues, please contact the development team or create an issue in the repository.
