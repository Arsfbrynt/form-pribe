import { createApp } from "vue";
import "./style.css";
import "./styles.scss";
import App from "./App.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPen,
  faShirt,
  faMagnifyingGlass,
  faCloudArrowUp,
  faBoxOpen,
  faTruckFast,
  faClipboardCheck,
  faCalendarDays,
  faPaperclip,
  faFilePdf,
  faPrint,
  faPlus,
  faTrash,
  faCircleCheck,
  faGlobe,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faPen,
  faShirt,
  faMagnifyingGlass,
  faCloudArrowUp,
  faBoxOpen,
  faTruckFast,
  faClipboardCheck,
  faCalendarDays,
  faFilePdf,
  faPaperclip,
  faPrint,
  faPlus,
  faTrash,
  faCircleCheck,
  faGlobe,
  faPhone,
);

const app = createApp(App);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.mount("#app");
