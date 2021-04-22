/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (type, data) => {
  const endpoint = type === 'user' ? 'updateMe' : 'updateMyPassword';
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${endpoint}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated sucessfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
