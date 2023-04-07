import { CHANGE_LOCALE } from '@redux/actions';

export const changeLocale = locale => {
  localStorage.setItem('currentLanguage', locale);
  return {
    type: CHANGE_LOCALE,
    payload: locale,
  };
};
s