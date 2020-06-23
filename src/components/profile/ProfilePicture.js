import { PROFILE_PIC_PREFIX, IMG_PREFIX_URL } from '../../config/constant';

export function returnProfilePicture(user) {
    // debugger
    if (user.enableFacebook === 'true') {
        return user.fb_picture;
    } else {
        if (user.profile_picture && user.profile_picture.includes('https://platform-lookaside.fbsbx.com')) {
            // debugger
            return user.profile_picture;
        } else {
            // debugger
            return PROFILE_PIC_PREFIX + user.profile_picture;
        }
    }
    return '';
}

export function returnProfilePictureWithoutPrefix(user) {
    // debugger
    if (user.enableFacebook === 'true') {
        return user.fb_picture;
    } else {
        if (user.profile_picture && user.profile_picture.includes('https://platform-lookaside.fbsbx.com')) {
            return user.profile_picture;
        } else {
            return user.profile_picture;
        }
    }
    return '';
}

function isString (value) {
    return typeof value === 'string' || value instanceof String ? true : false;
}
