import {insertAfter} from '../helpers/insertHelpers';
import {render} from 'preact';
import NotificationPopup from '../components/NotificationPopup/NotificationPopup';
import {delay, stringToObjectStyle} from '../utils/utils';
import {formatDistanceToNow} from 'date-fns';

export default class DisplayManager {
  constructor() {
    this.notifications = [];
    this.settings = {};
  }

  async initialize({notifications, settings}) {
    this.notifications = notifications.slice(0, settings.maxPopsDisplay);
    this.settings = settings;
    await delay(this.settings.firstDelay);
    for (let i = 0; i < notifications.length; i++) {
      this.insertContainer();
      await this.display({notification: notifications[i]});
      await delay(this.settings.displayDuration);
      this.fadeOut();
      await delay(this.settings.popsInterval);
      this.removeContainer();
    }
  }

  fadeOut() {
    const container = document.querySelector('#Avada-SalePop');
    container.innerHTML = '';
  }

  async display({notification}) {
    const position = stringToObjectStyle(this.settings.position);
    const container = document.querySelector('#Avada-SalePop');
    render(
      <NotificationPopup
        {...notification}
        position={position}
        relativeDate={formatDistanceToNow(notification.timestamp, {addSuffix: true})}
      />,
      container
    );
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = `Avada-SalePop`;
    popupEl.classList.add('Avada-SalePop__OuterWrapper');
    const targetEl = document.querySelector('body').firstChild;
    if (targetEl) {
      insertAfter(popupEl, targetEl);
    }

    return popupEl;
  }

  removeContainer() {
    const popupEl = document.getElementById('Avada-SalePop');
    if (popupEl) {
      popupEl.remove();
    }
  }
}
