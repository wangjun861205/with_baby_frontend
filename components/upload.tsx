import * as FS from "expo-file-system";
import { ViewProps, View, Image } from "react-native";
import useAsync from "../hooks/async";
import { upload } from "../apis/upload";
import { useEffect } from "react";
import { readAsStringAsync } from "expo-file-system";

export interface UploadProps extends ViewProps {
    uris: string[],
    immediately: boolean,
    onUploaded: () => void,
}

export const Upload = ({uris, immediately, onUploaded}: UploadProps) => {
    useEffect(() => {
        if (immediately) {
            const data: string[] = [];
            uris.map(uri => {
                readAsStringAsync(uri, {encoding: FS.EncodingType.Base64}).then(s => {
                    data.push(s);
                })
            })
            upload(data).then()
        }
    }, [immediately]);

    return <View>
        {
            uris.map(uri => {
                return <Image key={uri} source={{uri: uri}} />
            })
        }
    </View>
}

