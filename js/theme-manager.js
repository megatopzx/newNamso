/**
 * Theme Manager for handling light/dark mode
 */
export default class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'namsogen-theme';
    this.DARK_THEME = 'dark-theme';
    this.LIGHT_THEME = 'light-theme';
  }

  init() {
    // Get the toggle button
    this.toggleButton = document.getElementById('theme-toggle');
    
    // Get saved theme or use system preference as default
    this.theme = this.getSavedTheme() || this.getSystemTheme();
    
    // Apply theme
    this.applyTheme(this.theme);
    
    // Add event listener to toggle button
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', () => this.toggleTheme());
    }
    
    // Watch for system preference changes
    this.watchSystemThemeChanges();
  }

  /**
   * Get saved theme from cookies
   */
  getSavedTheme() {
    // Get cookie by name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    
    return getCookie(this.STORAGE_KEY);
  }

  /**
   * Get system theme preference
   */
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.DARK_THEME;
    }
    return this.LIGHT_THEME;
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    document.body.classList.remove(this.LIGHT_THEME, this.DARK_THEME);
    document.body.classList.add(theme);
    this.saveTheme(theme);
  }

  /**
   * Save theme preference to cookie
   */
  saveTheme(theme) {
    // Set cookie with expiration date (365 days)
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    document.cookie = `${this.STORAGE_KEY}=${theme}; expires=${date.toUTCString()}; path=/; SameSite=Strict`;
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme() {
    const newTheme = document.body.classList.contains(this.DARK_THEME)
      ? this.LIGHT_THEME
      : this.DARK_THEME;
    
    this.applyTheme(newTheme);
  }

  /**
   * Watch for system theme preference changes
   */
  watchSystemThemeChanges() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          // Only change theme if user hasn't manually set a preference
          if (!this.getSavedTheme()) {
            this.applyTheme(e.matches ? this.DARK_THEME : this.LIGHT_THEME);
          }
        });
    }
  }
}

