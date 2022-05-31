import * as Location from "expo-location";

export const getLocation = async ():  Promise<Location.LocationObject> => {
    try {
        let permission = await Location.getForegroundPermissionsAsync();
        if (permission.status === Location.PermissionStatus.UNDETERMINED || permission.status === Location.PermissionStatus.DENIED) {
            permission = await Location.requestForegroundPermissionsAsync();
            if (permission.status === Location.PermissionStatus.DENIED) {
                return Promise.reject(new Error("user denied"));
            }
        }
        return Location.getCurrentPositionAsync();
    } catch(e) {
        return Promise.reject(e)
    }
};
