import {render} from 'preact';
import NotificationPopup from '../NotificationPopup/NotificationPopup';
import {formatDistanceToNow} from 'date-fns';

export default class PopupRenderer {
  constructor(container, settings) {
    this.container = container;
    this.settings = settings;
  }

  render(notifications, isOpen) {
    this.container.innerHTML = '';
    this.container.classList.toggle('show', isOpen);

    if (!isOpen || !notifications.length) return;

    notifications.forEach(noti => {
      const item = document.createElement('div');
      item.className = 'popup-item';

      render(
        <NotificationPopup
          {...noti}
          hideTimeAgo={this.settings.hideTimeAgo}
          relativeDate={formatDistanceToNow(noti.timestamp, {
            addSuffix: true
          })}
        />,
        item
      );

      this.container.appendChild(item);
    });
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
