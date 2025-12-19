import DisplayManager from './managers/DisplayManager';
import ApiManager from './managers/ApiManager';

(async () => {
  try {
    console.log('this is scripttag');
    const apiManager = new ApiManager();
    const {notifications, settings} = await apiManager.getNotificationsAndSettingsShop();

    // if (!notifications?.length) return;
    console.log('aaa');
    const displayManager = new DisplayManager({notifications, settings});
    await displayManager.initialize({notifications, settings});
    console.log('init');
  } catch (err) {
    console.error('Avada Sale Pop error:', err);
  }
})();
