
import Notiflix from 'notiflix';

const Notification = {
  success: (message) => {
    Notiflix.Notify.success(message, { 
        position: 'center-top',  
        distance: '100px',
        top: '100px',
        width: '300px',
        timeout: 3000,
        clickToClose: true,
        showOnlyTheLastOne: true,
        pauseOnHover: true
    });
  },
  error: (message) => {
    Notiflix.Notify.failure(message);
  },
  info: (message) => {
    Notiflix.Notify.info(message);
  },
  warning: (message) => {
    Notiflix.Notify.warning(message);
  },
};

export default Notification;
