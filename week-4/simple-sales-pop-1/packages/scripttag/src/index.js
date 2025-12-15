import DisplayManager from './managers/DisplayManager';
import ApiManager from './managers/ApiManager';
import {render} from 'preact';

console.log('this is scripttag ');

(async () => {
  try {
    const container = document.createElement('div');
    container.id = 'Avada-SalePop';
    container.className = 'Avada-SalePop__OuterWrapper';
    document.body.insertBefore(container, document.body.firstChild);
    const apiManager = new ApiManager();
    const {notifications, settings} = await apiManager.getNotificationsAndSettingsShop();
    // if (!notifications?.length) return;
    render(
      <DisplayManager notifications={notifications} settings={settings} />,
      document.getElementById('Avada-SalePop')
    );
    // const displayManager = new DisplayManager(settings, notifications);
    // displayManager.start(notifications, settings);
  } catch (err) {
    console.error('Avada Sale Pop error:', err);
  }
})();
