export default defineNuxtPlugin(() => {
  // block opening external links unless they are from example.com
  if (process.client) {
    window.open = (ctx) => {
      if (ctx.includes('example.com')) {
        return window.open(ctx);
      }

      console.log(
        '%c Popups are blocked. ',
        'background: #222; color: #bada55; font-size: 20px'
      );
      return null;
    };
  }
});
