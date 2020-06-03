
import {
    LOCATION,
    COORDINATE,
} from './types';

export function getLocation(location) {
    return {
        type: LOCATION,
        payload: location,
    };
}

export function setCoordinate(coordinate) {
    return {
        type: COORDINATE,
        payload: coordinate,
    };
}
