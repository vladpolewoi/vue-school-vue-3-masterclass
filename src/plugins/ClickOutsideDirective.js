const ClickOutsideDirective = {
  mounted(el, binding) {
    el.__ClickOutsideHandler__ = (event) => {
      if (!el.contains(event.target) && el !== event.target) {
        binding.value(event);
      }
    };
    document.body.addEventListener("click", el.__ClickOutsideHandler__);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.__ClickOutsideHandler__);
  },
};

export default (app) => {
  app.directive("click-outside", ClickOutsideDirective);
};
