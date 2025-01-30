import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from "expo-notifications";
import { AxiosInstance } from '../config/AxiosInstace';
import { AxiosError } from 'axios';

type Device = {
    notificationToken: string;
    manufacturer: string;
    osName: string;
    osVersion: string;
    deviceType: string;
}

export function UtilDevice () {

    const  getDevice = async (): Promise<Device> => {

        let notificationToken = "";

        const status = await Notifications.requestPermissionsAsync();
        
        if(Constants.executionEnvironment !== "storeClient" && status.granted) {
            notificationToken = await messaging().getToken();
        }
        
        return  {
            notificationToken: notificationToken,
            manufacturer: Device.manufacturer ?? "",
            osName: Device.osName ?? "",
            osVersion: Device.osVersion ?? "",
            deviceType: Device.DeviceType[Device.deviceType ?? 0]
        } as Device;
    }

    const saveDevice = (funcAlert: Function) => {

        getDevice().then((device) => {
            console.log(device)
            AxiosInstance.post("/devices", {
                txNotificationToken: device.notificationToken,
                nmManufacturer: device.manufacturer,
                nmOs: device.osName,
                txOsVersion: device.osVersion,
                txDeviceType: device.deviceType
            })
            .catch((error: AxiosError) => {
                console.log(error.response?.status);

                if(error.response?.status !== 409)
                    funcAlert();
            });
        });
    }

    return {
        getDevice,
        saveDevice
    }
}


