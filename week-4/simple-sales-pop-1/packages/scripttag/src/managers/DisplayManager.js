import {render} from 'preact';
import NotificationPopup from '../components/NotificationPopup/NotificationPopup';
import {delay, stringToObjectStyle} from '../utils/utils';
import {formatDistanceToNow} from 'date-fns';
import './DisplayManager.css';

const MAX_ITEMS_PER_POPUP = 3;
const HIDE_DURATION_MINUTES = 15;
const STORAGE_KEY = 'sale_pop_hide_until';

export default class DisplayManager {
  constructor() {
    this.notifications = [];
    this.displayItems = [];
    this.settings = {};

    this.isOpen = false;
    this.currentIndex = MAX_ITEMS_PER_POPUP - 1;

    this.fabContainer = null;
    this.popupContainer = null;
    this.buttonEl = null;

    this.rotationTimeout = null;
  }

  async initialize({notifications, settings}) {
    if (this.isHiddenByTimeout()) return;

    this.notifications = notifications.slice(0, settings.maxPopsDisplay);
    this.settings = settings;
    if (!this.notifications.length) return;

    this.insertContainers();
    this.initPositionElement();
    await delay(settings.firstDelay);
    this.renderAllElements();
  }

  initPositionElement() {
    this.positionFloatingButton();
    this.positionPopup();
  }

  renderAllElements() {
    this.renderFloatingActionButton();
    this.renderPopupContent();
    this.startRotation();
  }

  isHiddenByTimeout() {
    const hideUntil = Number(localStorage.getItem(STORAGE_KEY));
    return hideUntil && Date.now() < hideUntil;
  }

  closeFloatingActionButton() {
    const hideUntil = Date.now() + HIDE_DURATION_MINUTES * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, hideUntil.toString());
    this.destroy();
  }

  startRotation() {
    const run = async () => {
      await delay(this.settings.displayDuration);
      await delay(this.settings.popsInterval);

      this.displayItems = this.getNextGroup();
      this.renderPopupContent();

      this.rotationTimeout = setTimeout(run, 0);
    };

    run();
  }

  getNextGroup() {
    const nextIndex = (this.currentIndex + 1) % this.notifications.length;
    this.currentIndex = nextIndex;

    return Array.from({length: MAX_ITEMS_PER_POPUP}, (_, i) => {
      const idx =
        (nextIndex - (MAX_ITEMS_PER_POPUP - 1) + i + this.notifications.length) %
        this.notifications.length;
      return this.notifications[idx];
    });
  }

  renderFloatingActionButton() {
    this.fabContainer.innerHTML = '';

    const closeBtn = document.createElement('div');
    closeBtn.innerText = '×';
    closeBtn.className = 'popup-close';
    closeBtn.onclick = () => this.closeFloatingActionButton();

    this.buttonEl = document.createElement('div');
    this.buttonEl.className = 'popup-button';
    this.buttonEl.onclick = () => this.togglePopup();

    this.renderButtonIcon();

    this.fabContainer.append(closeBtn, this.buttonEl);
  }

  renderButtonIcon() {
    this.buttonEl.innerHTML = '';
    const img = document.createElement('img');
    img.src = this.isOpen
      ? 'https://www.svgrepo.com/show/499592/close-x.svg'
      : 'https://icon-library.com/images/limited-time-icon/limited-time-icon-5.jpg';
    this.buttonEl.appendChild(img);
  }

  renderPopupContent() {
    this.popupContainer.innerHTML = '';
    this.popupContainer.classList.toggle('show', this.isOpen);
    this.popupContainer.style.maxHeight = '285px';
    if (this.displayItems.length <= 0) {
      return render(
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          loading...
        </div>,
        this.popupContainer
      );
    }
    this.displayItems.forEach(noti => {
      const item = document.createElement('div');
      item.className = 'popup-item';

      render(
        <NotificationPopup
          {...noti}
          hideTimeAgo={this.settings.hideTimeAgo}
          relativeDate={formatDistanceToNow(noti.timestamp, {addSuffix: true})}
        />,
        item
      );

      this.popupContainer.appendChild(item);
    });
  }

  togglePopup() {
    this.isOpen = !this.isOpen;
    this.renderButtonIcon();
    this.popupContainer.classList.toggle('show', this.isOpen);
  }

  positionFloatingButton() {
    Object.assign(this.fabContainer.style, {
      position: 'fixed',
      zIndex: 100,
      ...stringToObjectStyle({
        position: this.settings.position,
        first: 30,
        second: 20
      })
    });
  }

  positionPopup() {
    const pos = this.settings.position;

    Object.assign(this.popupContainer.style, {
      position: 'fixed',
      zIndex: 99,
      ...(pos.includes('bottom') && {bottom: '80px'}),
      ...(pos.includes('top') && {top: '80px'}),
      ...(pos.includes('right') && {right: '20px'}),
      ...(pos.includes('left') && {left: '20px'})
    });
  }

  insertContainers() {
    this.fabContainer = document.createElement('div');
    this.fabContainer.id = 'Avada-SalePop-FAB';

    this.popupContainer = document.createElement('div');
    this.popupContainer.id = 'Avada-SalePop-Popup';
    this.popupContainer.className = 'popup-content';

    document.body.append(this.fabContainer, this.popupContainer);
  }

  destroy() {
    clearTimeout(this.rotationTimeout);
    this.fabContainer?.remove();
    this.popupContainer?.remove();
  }
}
