import i18next from 'i18next';
import { resources } from './Strings.json';

class Localizer {
  static init(): void {
    i18next.init({
      lng: 'en',
      debug: false,
      resources
    });
  }
}

export default Localizer;
