import { Platform, Dimensions } from 'react-native';
import Snackbar from 'react-native-snackbar'

export const diff = Platform.OS === 'ios' ? 0 : 0;
export const myHeight = Dimensions.get ('window').height;
export const myWidth = Dimensions.get ('window').width;

export const getDistance = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2
        + c(lat1 * p) * c(lat2 * p)
        * (1 - c((lon2 - lon1) * p)) / 2;

    const result = 12742 * Math.asin(Math.sqrt(a));
    return Math.floor(result * 100) / 100;
};

export const getLocationObj = async(data = {}) => {
    const { description = '', geometry: { location: { lat = 0, lng = 0 } = {}} = {}, address_components } = data;
    const code = await getPostalCode(address_components, lat, lng)
    return { description, lat, lng, code };
};

export const timeConversion = (time = 0) => {
    let TimeType;
    let hour = time.toString ().slice (0, 2);
    const minutes = time.toString ().slice (3, 5);
    hour = parseInt (hour, 10);

    if (hour <= 11) {
        TimeType = 'AM';
    } else {
        TimeType = 'PM';
    }

    if (hour > 12) {
        hour -= 12;
    }

    if (hour === 0) {
        hour = 12;
    }
    return `${hour.toString ()}:${minutes.toString ()} ${TimeType.toString ()}`;
};

export const calculateFare = (list: any, distance: number) => {
    let totalprice = 0;
    let remainingMiles = distance;
    list.forEach((item) => {
        if (remainingMiles === 0) return;
        if (item.miles === -1) {
            totalprice += item.price * remainingMiles;
            remainingMiles = 0;
            return;
        }
        if (remainingMiles >= item.miles) {
            totalprice += item.price * item.miles;
            remainingMiles -= item.miles;
        } else {
            totalprice += item.price * remainingMiles;
            remainingMiles = 0;
        }
    });
    return Math.floor(totalprice * 100) / 100;
};


export const applyPercentage = (amount: number, per: number) => {
    const totalprice = per === 0
        ? amount : amount + amount * (per / 100);
    return Math.floor(totalprice * 100) / 100;
};

const getCode = (array) => {
    const lastObj = array[array.length - 1];
    const { types = [] } = lastObj || {};
    const index = types.findIndex(item => item === 'postal_code');
    if (index !== -1) {
        const code = lastObj.short_name
        return code.split(' ')[0];
    }
    return '';
}

export const getPostalCode = async (array = [], lat, lng) => {
    const code = getCode(array)
    if (code) return code
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=AIzaSyC1yCPUGUUdpy64y2oEAnJ21iPqOLwQlDY`;
    const res = await fetch(url);
    const data = await res.json();
    const { results = [] } = data;
    return getCode(results[0].address_components);
};

export const showMessage = (message: string) => {
    Snackbar.show({
        title: message,
        duration: Snackbar.LENGTH_LONG,
        action: {
            title: 'OK',
            color: 'white',
            onPress: () => {
            }
        }
    })
}
