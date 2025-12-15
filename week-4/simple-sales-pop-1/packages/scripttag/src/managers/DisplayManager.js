import {useSignal, useSignalEffect} from '@preact/signals';
import {formatDistanceToNow} from 'date-fns';
import NotificationPopup from '../components/NotificationPopup/NotificationPopup';
import {delay, stringToObjectStyle} from '../utils/utils';
import './DisplayManager.css';

const MAX_ITEMS_PER_POPUP = 3;
const TIME_HIDDEN_FLOATING_ACTION_BUTTON = 15; //  15 minutes
const STORAGE_KEY = 'timeoutCloseEnd';

const isUrlMatched = (urlPatterns = '', currentPath = '') => {
  if (!urlPatterns) return false;
  const patterns = urlPatterns.split(',');

  return patterns.some(pattern => currentPath.includes(pattern));
};

const DisplayManager = ({notifications: initNotifications, settings}) => {
  const allowShow = useSignal(false);
  const notifications = useSignal(initNotifications.slice(0, settings.maxPopsDisplay));
  const notificationsDisplay = useSignal(notifications.value.slice(0, MAX_ITEMS_PER_POPUP));
  const isOpen = useSignal(false);
  const position = stringToObjectStyle({position: settings.position, first: 30, second: 30});
  const lastCurrentIndex = useSignal(MAX_ITEMS_PER_POPUP - 1);

  useSignalEffect(() => {
    const currentPath = window.location.pathname;
    const {allShow, includeUrls, excludeUrls} = settings;
    let canShow = true;

    if (allShow === 'specific') {
      // chỉ có 1 trong 2 giá trị includesUrl hoặc excludeUrl ( có 1 cái thì cái kia sẽ là string rỗng) từ backend
      if (excludeUrls === '') {
        // có giá trị includeUrls
        canShow = isUrlMatched(includeUrls, currentPath);
        // console.log('----', canShow);
      } else {
        canShow = !isUrlMatched(excludeUrls, currentPath);
        // console.log('+++', canShow);
      }
    }
    allowShow.value = canShow;
  });

  // chỉ chạy 1 lần
  useSignalEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!notifications.value.length) return;
      await delay(settings.firstDelay);

      while (!cancelled) {
        await delay(settings.displayDuration);
        await delay(settings.popsInterval);
        if (cancelled) break; // stop nếu effect bị cleanup

        const nextIndex = (lastCurrentIndex.value + 1) % notifications.value.length; // khá hay
        const startIndex = nextIndex - (MAX_ITEMS_PER_POPUP - 1);
        const validStart = startIndex < 0 ? notifications.value.length + startIndex : startIndex;

        const newGroup = [];
        for (let i = 0; i < MAX_ITEMS_PER_POPUP; i++) {
          const idx = (validStart + i) % notifications.value.length;
          newGroup.push(notifications.value[idx]);
        }

        notificationsDisplay.value = newGroup;
        lastCurrentIndex.value = nextIndex;
      }
    };
    delay(settings.firstDelay).then(() => {
      run();
    });

    return () => {
      cancelled = true;
    };
  });

  useSignalEffect(() => {
    let timer;

    const checkTimeout = () => {
      const endTime = localStorage.getItem(STORAGE_KEY);
      if (!endTime) {
        allowShow.value = true;
        return;
      }
      localStorage.setItem(STORAGE_KEY, endTime - 1000);

      const remaining = endTime - Date.now();

      if (remaining <= 0) {
        localStorage.removeItem(STORAGE_KEY);
        allowShow.value = true;
      } else {
        allowShow.value = false;
      }
    };

    checkTimeout();
    timer = setInterval(checkTimeout, 1000);

    return () => clearInterval(timer);
  });

  const toggleOpenPopup = () => {
    isOpen.value = !isOpen.value;
  };
  const handleCloseFloatingActionButton = () => {
    const endTime = Date.now() + TIME_HIDDEN_FLOATING_ACTION_BUTTON * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, endTime);
    allowShow.value = false;
  };

  return (
    <div>
      {allowShow.value && (
        <div
          className="popup"
          style={{
            position: 'fixed',
            ...position,
            zIndex: 99
          }}
        >
          <div
            onClick={handleCloseFloatingActionButton}
            style={{
              position: 'absolute',
              top: -20,
              right: -5,
              color: 'red',
              cursor: 'pointer',
              fontSize: '24px'
            }}
          >
            x
          </div>

          <div className="popup-button" onClick={toggleOpenPopup}>
            {!isOpen.value ? (
              <img
                src="https://icon-library.com/images/limited-time-icon/limited-time-icon-5.jpg"
                alt="popup-icon"
              />
            ) : (
              <img src="https://www.svgrepo.com/show/499592/close-x.svg" alt="popup-icon" />
            )}
          </div>

          <div
            className={`popup-content ${isOpen.value ? 'show' : ''}`}
            style={{...stringToObjectStyle({position: settings.position, first: 70})}}
          >
            {notificationsDisplay.value.length > 0 ? (
              notificationsDisplay.value.map((notification, idx) => (
                <div key={idx} className="popup-item">
                  <NotificationPopup
                    {...notification}
                    position={position}
                    hideTimeAgo={settings.hideTimeAgo}
                    relativeDate={formatDistanceToNow(notification.timestamp, {
                      addSuffix: true
                    })}
                  />
                </div>
              ))
            ) : (
              <div className="popup-empty">Không có thông báo nào</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayManager;
