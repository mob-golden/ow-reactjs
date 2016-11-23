import 'whatwg-fetch';
import * as types from '../constants/types';
import { browserHistory } from 'react-router';

export function goToRoute(route) {
  browserHistory.push(`${route}`);
}
