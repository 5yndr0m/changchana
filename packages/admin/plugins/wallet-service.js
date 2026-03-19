import walletService from '~/services/walletService';

export default (context, inject) => {
  const services = {
    wallet: walletService(context.$axios),
  };

  inject('walletService', services.wallet);
};
