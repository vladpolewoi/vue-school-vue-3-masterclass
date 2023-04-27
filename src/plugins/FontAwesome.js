import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPencilAlt, faCamera);

export default (app) => {
  // eslint-disable-next-line vue/multi-word-component-names
  app.component("fa", FontAwesomeIcon);
};
